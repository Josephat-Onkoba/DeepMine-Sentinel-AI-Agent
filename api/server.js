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
app.use(cors());
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
                    { role: "system", content: "You are a helpful assistant." },
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
    res.json({ status: 'healthy' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
