import { useState, useRef, useEffect } from "react";
import styles from "./index.module.less";
import { ArrowUp } from "lucide-react";

type Props = {
  disable: boolean;
  onSubmit: (query: string) => void;
};

export default function UserInput({ onSubmit, disable }: Props) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const placeholderText = "Type your message..."; // 英文占位符

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSubmit(query);
    setQuery("");
  };

  const showPlaceholder = !query && !isFocused;

  return (
    <div className={styles.userInput}>
      <form onSubmit={handleSubmit} className={styles.inputWrapper}>
        <div className={`input-group ${styles.inputContainer}`}>
          <div className={styles.inputWrapperInner}>
            <input
              ref={inputRef}
              type="text"
              className={`form-control ${styles.inputField}`}
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder=""
            />
            {showPlaceholder && (
              <div className={styles.scrollingPlaceholder}>
                <div className={styles.placeholderWrapper}>
                  <span className={styles.placeholderText}>{placeholderText}</span>
                  <span className={styles.placeholderText}>{placeholderText}</span>
                </div>
              </div>
            )}
          </div>
          <button className="btn bg-white" type="submit" disabled={disable}>
            <ArrowUp style={{ color: "white" }} />
          </button>
        </div>
      </form>
    </div>
  );
}
