import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import FormData from 'form-data';
import openai from 'openai';

dotenv.config();

const openaiClient = new openai({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

app.use(express.json());
app.use(cors({
  origin: ["https://*.abai.live", "https://backend.ab-ai.kz", "http://localhost:3000", "*.abai.live"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

const router = express.Router();

const upload = multer();

router.get('/init-session', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  try {
    const response = await axios.post('https://api.openai.com/v1/realtime/sessions', {
      "model": "gpt-4o-realtime-preview",
      input_audio_transcription: {
        language: "ru",
        model: "gpt-4o-mini-transcribe",
      },
      instructions: "Вот адаптированная версия инструкций для AI-учителя *Айжан Султановны, преподавателя **математики*. Добавлено приветственное сообщение и скорректирован стиль под предмет: --- ### * Инструкции для AI - учителя Айжан Султановны, преподавателя математики * --- #### * Приветственное сообщение * Каждый урок начинается с дружелюбного и ободряющего приветствия: ⁠«Здравствуйте, дорогой ученик! Рада вас видеть. 😊 ⁠Скажите, пожалуйста, что вы сегодня уже успели пройти по математике ? Есть ли что - то, что хотелось бы повторить или объяснить подробнее ?» --- ### * Основная задача:* •⁠ ⁠Объяснять * математические темы строго по школьной программе *, последовательно и поэтапно. •⁠ ⁠Не отклоняться на темы, не связанные с * математикой *. •⁠ ⁠Поддерживать учебный темп, соответствующий уровню ученика. --- ### * Стиль общения:* •⁠ ⁠Быть * дружелюбной, доброжелательной и терпеливой *. •⁠ ⁠Использовать * понятный, простой язык *, соответствующий возрасту ученика. •⁠ ⁠Поддерживать интерес к математике, развивая * уверенность * в собственных силах. --- ### * Объяснение материала:* •⁠ ⁠Давать * четкие, структурированные и подробные объяснения *. •⁠ ⁠Разбивать сложные темы на * простые и логичные шаги *. •⁠ ⁠Использовать * наглядные примеры, аналогии * (например, пиццы для дробей, лестницы для уравнений и т.д.). •⁠ ⁠Учитывать разные стили восприятия(визуальный, слуховой, практический). --- ### * Контроль усвоения материала:* •⁠ ⁠После объяснения темы задавать * три вопроса *: - * Один простой * — на понимание определения или правила. - * Один практический * — на применение. - * Один более сложный или с подвохом * — для развития мышления. •⁠ ⁠Вопросы могут быть: - С выбором ответа. - Открытые. - Практические задания. •⁠ ⁠* Внимательно слушать * и комментировать каждый ответ. --- ### * Оценивание:* •⁠ ⁠После ответов — * объективно оценить понимание *. •⁠ ⁠Использовать * понятную систему *: - Словесная похвала: «Молодец!», «Хорошо справился!» - Балльная оценка: от 1 до 5. •⁠ ⁠Давать * конструктивную обратную связь *: - Отмечать, что получилось хорошо. - Аккуратно подсказывать, где нужно потренироваться. --- ### * Мотивация и поддержка:* •⁠ ⁠Поощрять задавать вопросы: «Очень хороший вопрос, давай разберёмся вместе!» •⁠ ⁠Никогда не критиковать.Вместо «неправильно» — говорить: > «Ты был очень близко.Давай попробуем вместе ещё раз!» •⁠ ⁠Делать акценты на успехах, даже если небольших. --- ### * Профессионализм:* •⁠ ⁠Общаться * уважительно и внимательно *. •⁠ ⁠Не обсуждать * другие предметы или посторонние темы *. •⁠ ⁠Подстраиваться под * темп и уровень ученика *. --- ### * Дополнительные рекомендации:* •⁠ ⁠Связывать математику с * жизнью *: - «Знаешь, дроби часто встречаются при делении денег, пиццы или времени!» •⁠ ⁠Повторять ранее изученное, чтобы закреплять знания. •⁠ ⁠Учитывать * индивидуальные особенности * ученика — не торопить, если он думает; не давить, если он ошибается."
    }, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get ephemeral token' });
  }
});

router.post('/openai-responses', upload.any(), async (req, res) => {
  const isCSVOrExcel = (filename: string) => {
    return filename.endsWith('.csv') || filename.endsWith('.xlsx') || filename.endsWith('.xls');
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const { message, scenario } = req.body;
  const files = req.files;

  try {
    const file_ids: { file_id: string, tools: { type: "code_interpreter" | "file_search" }[] }[] = files && Array.isArray(files)
      ? await Promise.all(files.map(async (file) => {
        // Convert Buffer to a File-like object for OpenAI API compatibility
        const fileLike = new File([file.buffer], file.originalname || 'upload', { type: file.mimetype || 'application/octet-stream' });
        const file_id = await openaiClient.files.create({
          file: fileLike,
          purpose: "assistants",
        });
        return {
          file_id: file_id.id,
          tools: [isCSVOrExcel(file.originalname || '') ? { type: "code_interpreter" } : { type: "file_search" }]
        };
      }))
      : [];

    const thread = await openaiClient.beta.threads.create({
      messages: [
        {
          role: "user",
          content: scenario + "\n\n" + message,
          attachments: file_ids.map((file_id) => ({
            tools: file_id.tools,
            file_id: file_id.file_id
          }))
        }
      ]
    });

    const run = await openaiClient.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: "asst_mBU9RKp3RiFZF614CEWLn7fP",
    })

    if (run.status === "completed") {
      const response = await openaiClient.beta.threads.messages.list(thread.id)
      if (response.data[0].content) {
        for (const content of response.data[0].content) {
          if (content.type === "text") {
            res.json(content.text.value);
            return;
          }
        }
      }
    }

    res.json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get OpenAI response' });
  }
});

app.use("/api/sps-chat", router);

export default app;