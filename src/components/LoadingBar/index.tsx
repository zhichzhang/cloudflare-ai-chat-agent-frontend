import React from "react";
import styles from "./index.module.less";

const LoadingBar: React.FC = () => {
  return (
    <div className={styles.loadingBar}>
      <div className={styles.thinkingDots}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={styles.agentThinkingText}>Agent is thinking...</div>
    </div>
  );
};

export default LoadingBar;
