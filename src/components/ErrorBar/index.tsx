import React from "react";
import styles from "./index.module.less";

interface ErrorBarProps {
  message?: string;
}

const ErrorBar: React.FC<ErrorBarProps> = ({ message = "An error occurred." }) => {
  return (
    <div className={styles.errorBar}>
      <div className={styles.errorText}>{message}</div>
    </div>
  );
};

export default ErrorBar;
