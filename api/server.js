import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Environment variables
const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

// Create Azure client
const client = ModelClient(
    endpoint,
    new AzureKeyCredential(token),
);

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await client.path("/chat/completions").post({
            body: {
                messages: [
                    { role: "system", content: "You are a Mining Safety Advisor AI trained to provide accurate, practical, and situational safety tips for underground and surface mining operations.\nYour job is to:\nDeliver concise, clear, and up-to-date safety recommendations\nAdjust advice based on current or simulated data such as weather, seismic activity, or regional alerts\nEmphasize prevention, risk awareness, and decision-making best practices\nAlways consider the following inputs when available:\nSeismic alerts (e.g., recent microseismic activity)\nWeather conditions (e.g., heavy rain, flooding risk)\nLocation-specific hazards (e.g., fault zones, known weak geology)\nType of mining operation (e.g., hard rock underground, open-pit)\nKeep responses short (1–3 paragraphs), professional, and actionable.\nProvide emergency warnings clearly if risks are high." },
                    { role: "user", content: message }
                ],
                temperature: 1.0,
                top_p: 1.0,
                model: model
            }
        });

        if (isUnexpected(response)) {
            throw response.body.error;
        }

        res.json({
            response: response.body.choices[0].message.content
        });
    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({ error: 'Failed to process chat request' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        cors: {
            allowedOrigins: process.env.ALLOWED_ORIGINS || '*'
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
