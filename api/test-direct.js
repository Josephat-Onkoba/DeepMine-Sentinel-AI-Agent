import dotenv from 'dotenv';
import { AzureKeyCredential } from "@azure/core-auth";
import ModelClient from "@azure-rest/ai-inference";

// Load environment variables
dotenv.config();

async function testAzureAI() {
  console.log("Starting direct Azure AI test...");
  
  try {
    // Initialize client
    const client = new ModelClient(
      process.env.AZURE_INFERENCE_SDK_ENDPOINT,
      new AzureKeyCredential(process.env.AZURE_INFERENCE_SDK_KEY)
    );
    
    console.log("Client initialized for endpoint:", process.env.AZURE_INFERENCE_SDK_ENDPOINT);
    console.log("Using model:", process.env.MODEL_NAME);
    
    // Send a simple request
    const response = await client.path("chat/completions").post({
      body: {
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Tell me a short joke" }
        ],
        max_tokens: 2048,
        temperature: 0.7,
        top_p: 0.95,
        model: process.env.MODEL_NAME,
        stream: false
      },
    });
    
    console.log("\nResponse status:", response.status);
    console.log("\nResponse headers:", response.headers);

    // Print the complete response body
    console.log("\nRaw Response body structure:", Object.keys(response.body));
    
    // Print detailed response
    console.log("\nDetailed response body:", JSON.stringify(response.body, null, 2));
    
    // Extract and print the actual content
    if (response.body && response.body.choices && response.body.choices[0]) {
      console.log("\n--- MESSAGE CONTENT ---");
      console.log(response.body.choices[0].message.content);
      console.log("\n--- END OF CONTENT ---");
    }
    
  } catch (error) {
    console.error("Error calling Azure AI:", error);
  }
}

// Run the test
testAzureAI();
