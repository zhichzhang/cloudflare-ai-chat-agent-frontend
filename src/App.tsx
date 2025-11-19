import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import UserInput from "./components/UserInput";
import MessageBubble, { type Message } from "./components/MessageBubble";
import LoadingBar from "./components/LoadingBar";
import ErrorBar from "./components/ErrorBar";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isLoadingBarVisible, setIsLoadingBarVisible] = useState(false);

  const handleSend = async (query: string) => {
    setErrorMessage(null);
    if (!hasSearched) setHasSearched(true);

    setMessages(prev => [
      ...prev,
      { content: query, role: "user", time: Date.now() }
    ]);
    setLoading(true);
    setIsLoadingBarVisible(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, userId: sessionIdRef.current }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantMessage = "";
      let firstChunk = true;

      setMessages(prev => [
        ...prev,
        { content: "", role: "agent", time: Date.now(), streaming: true }
      ]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.replace(/^data: /, "").trim();
          if (!jsonStr || jsonStr === "[DONE]") continue;

          try {
            const data = JSON.parse(jsonStr);

            if (data.response) {
              if (firstChunk) {
                setIsLoadingBarVisible(false);
                firstChunk = false;
              }

              assistantMessage += data.response;
              setMessages(prev => {
                const newMsgs = [...prev];
                const lastMsg = newMsgs[newMsgs.length - 1];
                if (lastMsg.role === "agent") {
                  lastMsg.content = assistantMessage;
                  lastMsg.streaming = true;
                }
                return newMsgs;
              });
            }

            if (data.sessionId && !sessionIdRef.current) {
              sessionIdRef.current = data.sessionId;
            }

          } catch (err) {
            console.error("SSE parse error", err);
          }
        }
      }

      if (buffer) {
        assistantMessage += buffer;
        setMessages(prev => {
          const newMsgs = [...prev];
          const lastMsg = newMsgs[newMsgs.length - 1];
          if (lastMsg.role === "agent") lastMsg.content = assistantMessage;
          return newMsgs;
        });
      }

      setMessages(prev => {
        const newMsgs = [...prev];
        const lastMsg = newMsgs[newMsgs.length - 1];
        if (lastMsg.role === "agent") lastMsg.streaming = false;
        return newMsgs;
      });

    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to get response from server.");
    } finally {
      setLoading(false);
      setIsLoadingBarVisible(false);
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
  }, [messages, errorMessage]);

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
          {loading && isLoadingBarVisible && <LoadingBar />}
          {errorMessage && <ErrorBar message={errorMessage || undefined} />}
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
