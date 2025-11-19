import styles from "./index.module.less";

interface MessageBubbleProps {
  text?: string;
  role?: "user" | "agent";
  timeStamp?: number;
}

export default function MessageBubble({
  text = "Default message",
  role = "user",
  timeStamp,
}: MessageBubbleProps) {

  const formattedTime = timeStamp ? new Date(timeStamp).toLocaleString() : "";

  return (
    <div
      className={`${styles.messageRow} ${
        role === "user" ? styles.userRow : styles.agentRow
      }`}
    >
      <div className={styles.bubble}>
        <div className={styles.text}>{text}</div>
        {timeStamp && (
          <div className={styles.time}>{formattedTime}</div>
        )}
      </div>
    </div>
  );
}
