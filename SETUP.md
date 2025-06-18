# DeepMine Sentinel AI Chat - Setup Instructions

## Step 1: Update your Azure AI Foundry Credentials

1. Open the API `.env` file:
   ```
   /DeepMine-Sentinel-AI-Agent/api/.env
   ```

2. Replace the placeholder values with your actual Azure AI Foundry credentials:
   ```
   AZURE_INFERENCE_SDK_ENDPOINT=https://your-actual-model-name.services.ai.azure.com/models/
   AZURE_INFERENCE_SDK_KEY=your-actual-api-key
   MODEL_NAME=your-actual-model-deployment-name
   ```

## Step 2: Install Dependencies

1. Install frontend dependencies:
   ```bash
   cd /home/jose/Desktop/devjose-azure-learning/DeepMine-Sentinel-AI-Agent
   npm install
   ```

2. Install backend API dependencies:
   ```bash
   cd /home/jose/Desktop/devjose-azure-learning/DeepMine-Sentinel-AI-Agent/api
   npm install
   ```

## Step 3: Run the Application Locally

1. Start the backend API server:
   ```bash
   cd /home/jose/Desktop/devjose-azure-learning/DeepMine-Sentinel-AI-Agent/api
   npm start
   ```

2. In a separate terminal window, start the frontend:
   ```bash
   cd /home/jose/Desktop/devjose-azure-learning/DeepMine-Sentinel-AI-Agent
   npm start
   ```

3. Access the chat interface in your browser at: http://localhost:8000

## Step 4: Test the Chat Interface

1. Open the provided URL in your browser
2. Type a question in the chat interface
3. The question will be sent to your backend API
4. Your backend will call your Azure AI Foundry model
5. The response will be streamed back to the chat interface

## Step 5: Deploy to Azure (Optional)

1. Set your Azure environment variables:
   ```bash
   cd /home/jose/Desktop/devjose-azure-learning/DeepMine-Sentinel-AI-Agent
   azd env set AZURE_INFERENCE_SDK_ENDPOINT https://your-actual-model-name.services.ai.azure.com/models/
   azd env set AZURE_INFERENCE_SDK_KEY your-actual-api-key
   azd env set MODEL_NAME your-actual-model-deployment-name
   ```

2. Deploy both frontend and backend to Azure:
   ```bash
   azd up
   ```

3. Once deployed, azd will provide the URLs for your frontend and backend services

## Troubleshooting

If you encounter issues:

1. Check the backend API logs for any errors:
   ```bash
   cd /home/jose/Desktop/devjose-azure-learning/DeepMine-Sentinel-AI-Agent/api
   npm run dev
   ```

2. Ensure your Azure AI Foundry model is accessible and your API key is correct

3. Check the browser developer console for any frontend errors
