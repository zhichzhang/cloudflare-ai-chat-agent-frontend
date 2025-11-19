import React from "react";

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
  const style: React.CSSProperties = {
    padding: "12px 18px",
    borderRadius: "12px",
    maxWidth: "80%",
    backgroundColor: role === "user" ? "var(--text-primary)" : "var(--border-color)",
    color: role === "user" ? "var(--text-on-accent)" : "var(--text-primary)",
    marginLeft: role === "user" ? "auto" : undefined,
    marginRight: role === "agent" ? "auto" : undefined,
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    textAlign: "left",
    position: "relative",
  };

  const formattedTime = timeStamp ? new Date(timeStamp).toLocaleString() : "";

  return (
    <div style={{ display: "flex", justifyContent: role === "user" ? "flex-end" : "flex-start", margin: "0.5rem 0" }}>
      <div style={style}>
        <div>{text}</div>
        {timeStamp && (
          <div style={{ marginTop: 3, fontSize: 10, color: "var(--text-on-accent)", textAlign: "right" }}>
            {formattedTime}
          </div>
        )}
      </div>
    </div>
  );
}
