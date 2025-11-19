import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import UserInput from "./components/UserInput";
import MessageBubble from "./components/MessageBubble";
import LoadingBar from "./components/LoadingBar";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [messages, setMessages] = useState<{ text: string; role: "user" | "agent"; time?: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const sessionIdRef = useRef<string | null>(null);


  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async (query: string) => {
  if (!hasSearched) setHasSearched(true);

  setMessages(prev => [...prev, { text: query, role: "user", time: Date.now() }]);
  setLoading(true);

  try {
    const res = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: query,
        userId: sessionIdRef.current,
      }),
    });

    const data = await res.json();

    if (!sessionIdRef.current && data.sessionId) {
      sessionIdRef.current = data.sessionId;
    }

    const reply = data.reply ?? "No response";
    setMessages(prev => [...prev, { text: reply, role: "agent", time: Date.now() }]);
  } catch (err) {
    console.error(err);
    setMessages(prev => [...prev, { text: "Error: failed to get response", role: "agent", time: Date.now() }]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!sessionIdRef.current) return;
      const url = `${API_URL}/api/end-session`;
      const data = JSON.stringify({ userId: sessionIdRef.current });
      const blob = new Blob([data], { type: "application/json" });
      navigator.sendBeacon(url, blob);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-page-container">
      <motion.div
        className="chat-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: hasSearched ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      >
        <div
          style={{
            width: "80%",
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "9px",
            paddingTop: "1rem",
            paddingBottom: "120px",
          }}
        >
          {messages.map((msg, i) => (
            <MessageBubble key={i} {...msg} />
          ))}
          {loading && <LoadingBar />}
          <div ref={bottomRef}></div>
        </div>
      </motion.div>

      <motion.div
        className="floating-input"
        style={{
          position: "fixed",
          left: "50%",
          bottom: hasSearched ? 20 : "50%",
          transform: hasSearched ? "translateX(-50%)" : "translate(-50%, -50%)",
          width: "min(90%, 700px)",
          padding: "0 8px",
          zIndex: 20,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
          {!hasSearched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: "center", marginBottom: 14 }}
            >
              <h1 style={{ margin: 0, fontSize: "3rem" }}>Welcome to Chat Bot!</h1>
              <p style={{ margin: 0, fontSize: "1rem", color: "var(--text-secondary)" }}>
                Powered by Llama 3.3
              </p>
            </motion.div>
          )}
          <UserInput disable={loading} onSubmit={handleSend} />
      </motion.div>
    </div>
  );
}
