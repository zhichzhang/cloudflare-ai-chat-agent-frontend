import styles from "./index.module.less";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { motion } from "framer-motion";

export interface Message {
  content: string | string[];
  role: "user" | "agent";
  time?: number;
  streaming?: boolean;
}

type MessageBubbleProps = Message

export default function MessageBubble({
  content = "Default message",
  role = "user",
  time,
  streaming = false,
}: MessageBubbleProps) {
  const formattedTime = time ? new Date(time).toLocaleTimeString() : "";
  const lines = Array.isArray(content) ? content : [content];

  return (
    <motion.div
      className={`${styles.messageRow} ${role === "user" ? styles.userRow : styles.agentRow}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.bubble}>
        {lines.map((line, idx) => (
          <div key={idx} className={styles.text}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {line}
            </ReactMarkdown>
          </div>
        ))}
        {streaming && <div className={styles.streamingIndicator}>...</div>}
        {time && (
          <div
            className={styles.time}
            style={{
              color: role !== "user" ? "var(--text-primary)" : "var(--text-on-accent)",
            }}
          >
            {formattedTime}
          </div>
        )}
      </div>
    </motion.div>
  );
}
