import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import FormData from 'form-data';
import openai from 'openai';

dotenv.config();

const openaiClient = new openai({
  apiKey: "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",
});

const app = express();

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

const router = express.Router();

const upload = multer();

router.post('/init-session', async (req, res) => {
  const apiKey = "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";
  const { instructions } = req.body;
  try {
    const response = await axios.post('https://api.openai.com/v1/realtime/sessions', {
      "model": "gpt-4o-realtime-preview",
      input_audio_transcription: {
        language: "ru",
        model: "gpt-4o-mini-transcribe",
      },
      instructions: instructions || "",
      voice: "shimmer"
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