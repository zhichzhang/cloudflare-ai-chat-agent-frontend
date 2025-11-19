# AI Chat Bot on Cloudflare

This is a Cloudflare Workers-based AI-powered chat application built as part of an internship assignment. The app allows users to interact with an LLM (Llama 3.3) in a chat interface with session memory.

# Features

- Chat with AI: Send messages and receive responses from an AI model (Llama 3.3).
- Session Memory: Maintains conversation context for the current session, storing recent messages in Workers KV.
- Dynamic Frontend: Smooth user interface with animated chat bubbles, loading indicators, and auto-scrolling.
- Session Management: Automatically creates a session ID on first message and cleans up when the user leaves.
- CORS Support: API endpoints handle cross-origin requests for front-end integration.

# How It Works

- User sends a message via the chat input.
- Frontend checks if a session ID exists; if not, backend generates one.
- Backend retrieves conversation history from KV and appends the new message.
- AI model generates a reply, which is saved back to KV.
- Frontend displays the AI response, maintaining chat history until session ends.