# AI Chat Bot on Cloudflare [🌐 Live](https://zhicheng-zhang-cloudflare-ai-chat-agent.pages.dev/)

This is a **Cloudflare Workers-based AI-powered chat application** built as part of an internship project. Users can interact with an LLM (Llama 3.3) in a chat interface with session memory.

## Features
- **Chat with AI**: Send messages and receive responses from an AI model (Llama 3.3).  
- **Session Memory**: Maintains conversation context for the current session using Workers KV.  
- **Automatic Session Management**: Creates a unique session ID for each user on first message and automatically deletes it when the user leaves.  
- **Dynamic Frontend**: Smooth UI with animated chat bubbles, loading indicators, and auto-scrolling.  
- **CORS Support**: API endpoints handle cross-origin requests for frontend integration.  

## How It Works
1. User sends a message via the chat input.  
2. Frontend checks for a session ID; if none exists, the backend generates one.  
3. Backend retrieves conversation history from KV and appends the new message.  
4. AI model generates a reply, which is saved back to KV.  
5. Frontend displays the AI response, maintaining chat history until the session ends.  
6. When the user leaves, the session ID is automatically deleted to free up resources.
