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
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    
    // Set response headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    
    // For streaming responses
    const useStream = req.headers.accept === 'text/event-stream' || req.body.stream === true;
    if (useStream) {
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
        model: process.env.MODEL_NAME, // Default model
        stream: useStream
      },
    });
    
    // If streaming is enabled
    if (useStream && response.body) {
      try {
        // Create a stream reader for Azure's response
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        
        let hasProcessedAnyData = false;
        
        // Read and process chunks
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // Decode the chunk
          const chunk = decoder.decode(value);
          console.log("Raw chunk from model:", chunk);
          
          // Process and format the chunk to match the expected format
          // Azure returns "data: {...}\n\n" for each chunk
          const dataLines = chunk.split("\n").filter(line => line.trim() !== '');
          
          for (const dataLine of dataLines) {
            try {
              // Check if it's a data line
              let jsonData;
              let jsonStr;
              
              if (dataLine.startsWith("data:")) {
                // Extract JSON from "data: {...}"
                jsonStr = dataLine.slice(5).trim();
                if (jsonStr === "[DONE]") continue;
                jsonData = JSON.parse(jsonStr);
              } else {
                // Try to parse as raw JSON
                jsonData = JSON.parse(dataLine);
              }
              
              console.log("Parsed JSON data:", jsonData);
              
              // Format as expected by the frontend
              const formattedChunk = {
                id: jsonData.id || "chatcmpl-" + Date.now(),
                object: jsonData.object || "chat.completion.chunk",
                created: jsonData.created || Math.floor(Date.now() / 1000),
                model: jsonData.model || process.env.MODEL_NAME || "unknown",
                choices: [
                  {
                    delta: {
                      content: jsonData.choices?.[0]?.delta?.content || 
                              jsonData.choices?.[0]?.message?.content || 
                              "",
                      role: jsonData.choices?.[0]?.delta?.role || 
                            jsonData.choices?.[0]?.message?.role || 
                            "assistant"
                    },
                    finish_reason: jsonData.choices?.[0]?.finish_reason || null
                  }
                ]
              };
              
              // Send the formatted chunk
              res.write(`${JSON.stringify(formattedChunk)}\n`);
              hasProcessedAnyData = true;
            } catch (e) {
              console.error("Error processing chunk:", e, "Raw line:", dataLine);
            }
          }
        }
        
        // If we didn't process any data, send a fallback response
        if (!hasProcessedAnyData) {
          console.log("No data processed, sending fallback response");
          const fallbackResponse = {
            id: "chatcmpl-" + Date.now(),
            object: "chat.completion.chunk",
            created: Math.floor(Date.now() / 1000),
            model: process.env.MODEL_NAME || "unknown",
            choices: [
              {
                delta: {
                  content: "I'm sorry, but I'm having trouble processing your request. Please try again later.",
                  role: "assistant"
                },
                finish_reason: null
              }
            ]
          };
          res.write(`${JSON.stringify(fallbackResponse)}\n`);
        }
        
      } catch (streamError) {
        console.error("Error in streaming response:", streamError);
        // Send a fallback response if streaming fails
        const fallbackResponse = {
          id: "chatcmpl-" + Date.now(),
          object: "chat.completion.chunk",
          created: Math.floor(Date.now() / 1000),
          model: process.env.MODEL_NAME || "unknown",
          choices: [
            {
              delta: {
                content: "I encountered an error while processing your request. Please try again.",
                role: "assistant"
              },
              finish_reason: "error"
            }
          ]
        };
        res.write(`${JSON.stringify(fallbackResponse)}\n`);
      } finally {
        res.end();
      }
    } else if (!useStream) {
      try {
        // Non-streaming response - Azure's SDK might handle the body differently
        console.log("Response from Azure AI:", response);
        
        // Handle the actual response from Phi-4-reasoning
        if (response.body && response.body.choices && response.body.choices.length > 0) {
          // This is the actual format from Phi-4-reasoning
          // Clean up the content to remove the thinking part
          let content = response.body.choices[0].message.content || "";
          
          // Remove the <think>...</think> part if present
          if (content.includes("<think>")) {
            content = content.replace(/<think>[\s\S]*?<\/think>/, "").trim();
          }
          
          const actualResponse = {
            id: response.body.id || "chatcmpl-" + Date.now(),
            object: response.body.object || "chat.completion",
            created: response.body.created || Math.floor(Date.now() / 1000),
            model: response.body.model || process.env.MODEL_NAME,
            choices: [
              {
                message: {
                  role: response.body.choices[0].message.role || "assistant",
                  content: content
                },
                finish_reason: response.body.choices[0].finish_reason || null
              }
            ]
          };
          
          console.log("Non-streaming formatted response:", actualResponse);
          res.json(actualResponse);
        } else if (response.body && typeof response.body.json === 'function') {
          const jsonData = await response.body.json();
          console.log("Parsed JSON from response.body.json:", jsonData);
          
          // Format the JSON data to match expected format
          const formattedResponse = {
            id: jsonData.id || "chatcmpl-" + Date.now(),
            object: jsonData.object || "chat.completion",
            created: jsonData.created || Math.floor(Date.now() / 1000),
            model: jsonData.model || process.env.MODEL_NAME,
            choices: [
              {
                message: {
                  role: jsonData.choices?.[0]?.message?.role || "assistant",
                  content: jsonData.choices?.[0]?.message?.content || ""
                },
                finish_reason: jsonData.choices?.[0]?.finish_reason || null
              }
            ]
          };
          
          console.log("Non-streaming formatted response:", formattedResponse);
          res.json(formattedResponse);
        } else {
          // Use the raw response body as is
          console.log("Using raw response body");
          res.json(response.body);
        }
        
        console.log("Non-streaming response sent");
      } catch (jsonError) {
        console.error("Error parsing non-streaming response:", jsonError);
        // Send a fallback response that the frontend can understand
        res.json({
          choices: [
            {
              message: {
                role: "assistant",
                content: "I encountered an error while processing your request. Please check your Azure AI model configuration."
              }
            }
          ]
        });
      }
    } else {
      console.error("No response body from AI service");
      res.status(500).json({ 
        error: "No response body from AI service",
        message: "The AI model did not provide a response body."
      });
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
