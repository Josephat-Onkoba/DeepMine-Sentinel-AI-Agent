import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AzureKeyCredential } from "@azure/core-auth";
import ModelClient from "@azure-rest/ai-inference";

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Azure AI client
const client = new ModelClient(
  process.env.AZURE_INFERENCE_SDK_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_INFERENCE_SDK_KEY)
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API server is running" });
});

// Chat completion endpoint
app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request format. 'messages' array is required." });
    }
    
    console.log("Received chat request with messages:", JSON.stringify(messages));
    
    // Set response headers for SSE
    if (req.headers.accept === 'text/event-stream') {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
    }

    // Call Azure AI model
    const response = await client.path("chat/completions").post({
      body: {
        messages: messages,
        max_tokens: 2048,
        temperature: 0.7,
        top_p: 0.95,
        model: process.env.MODEL_NAME || "gpt-4o", // Default model
        stream: true
      },
    });
    
    // Stream the response back to the client
    if (response.body) {
      response.body.pipe(res);
    } else {
      res.status(500).json({ error: "No response body from AI service" });
    }
  } catch (error) {
    console.error('Error calling AI model:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing your request.',
      details: error.message
    });
  }
});

// Get the PORT from environment variable or use 3000 as default
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
