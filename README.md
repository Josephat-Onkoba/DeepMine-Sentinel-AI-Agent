# DeepMine Sentinel AI Agent

This project is a chat interface that connects to an AI model through an API.

## Setup Instructions

### Backend Setup

1. Create a `.env` file in the `api` directory with the following content:
```env
GITHUB_TOKEN=your_github_token_here
```

2. Install dependencies:
```bash
cd api
npm install
```

3. Start the API server:
```bash
node server.js
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

## Usage

1. Ensure both the backend API server and frontend development server are running.
2. Open your browser and navigate to `http://localhost:3000`.
3. Type your message in the chat interface and press Enter or click Send.
4. The message will be sent to the backend API, which will process it through the AI model and return a response.
