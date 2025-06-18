import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { ReadableStream } from 'node:stream/web';

// Load environment variables
dotenv.config();

async function testAPIResponse(useStreaming = true) {
  try {
    console.log("Testing API endpoint...");
    
    // Test health check endpoint
    const healthResponse = await fetch("http://localhost:3000/health");
    const healthData = await healthResponse.json();
    console.log("Health check response:", healthData);
    
    // Test chat endpoint
    console.log(`\nTesting chat endpoint (streaming=${useStreaming})...`);
    const headers = {
      "Content-Type": "application/json",
    };
    
    if (useStreaming) {
      headers["Accept"] = "text/event-stream";
    }
    
    const chatResponse = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Hello, tell me a short joke." }
        ],
        stream: useStreaming
      })
    });
    
    // Get the response data
    const contentType = chatResponse.headers.get('content-type');
    if (contentType && contentType.includes('text/event-stream')) {
      console.log("\nReceived streaming response:");
      // Handle streaming response
      let chunks = [];
      
      if (chatResponse.body) {
        try {
          const reader = chatResponse.body.getReader();
          const decoder = new TextDecoder();
          
          let done = false;
          while (!done) {
            const result = await reader.read();
            done = result.done;
            if (!done) {
              const chunk = decoder.decode(result.value, { stream: true });
              chunks.push(chunk);
              console.log("\nChunk:", chunk);
              
              // Process response chunk
              const lines = chunk.split('\n').filter(line => line.trim() !== '');
              for (const line of lines) {
                try {
                  const jsonData = JSON.parse(line);
                  console.log("Parsed JSON chunk:", jsonData);
                  
                  // Extract the content to see what the assistant is saying
                  const content = jsonData.choices?.[0]?.delta?.content;
                  if (content) {
                    console.log("Content:", content);
                  }
                } catch (e) {
                  console.log("Could not parse as JSON:", line);
                  // Not valid JSON or empty line
                }
              }
            }
          }
        } catch (error) {
          console.error("Error reading stream:", error);
        }
      } else {
        console.error("No response body");
      }
      
      console.log("\nAll chunks received. Total chunks:", chunks.length);
    } else {
      // Handle regular JSON response
      const data = await chatResponse.json();
      console.log("\nAPI response:", JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Process command line arguments
const args = process.argv.slice(2);
const useStreaming = args[0] !== 'nostream';

console.log(`Running test with streaming ${useStreaming ? 'enabled' : 'disabled'}`);

// Run the test
testAPIResponse(useStreaming);
