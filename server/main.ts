import express from 'express';
import axios from 'axios';
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(cors({
    origin: "https://abai.live",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

const router = express.Router();

router.get('/init-session', async (req, res) => {
    const apiKey = "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"
    try {
        const response = await axios.post('https://api.openai.com/v1/realtime/sessions', {
            "model": "gpt-4o-realtime-preview",
            input_audio_transcription: {
                language: "ru",
                model: "gpt-4o-mini-transcribe",
            },
            instructions: "Ты учитель математики. Отвечай на вопросы по математике."
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

app.use("/api/sps-chat", router);

export default app;