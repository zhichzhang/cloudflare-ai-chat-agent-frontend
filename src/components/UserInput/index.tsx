import { useState, useRef, useEffect } from "react";
import styles from "./index.module.less";
import { ArrowUp } from "lucide-react";

type Props = {
  disable: boolean;
  onSubmit: (query: string) => void;
  placeholderText?: string;
};

export default function UserInput({ onSubmit, disable, placeholderText = "Type your message..." }: Props) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isShort, setIsShort] = useState(false);

  useEffect(() => {
    if (!inputRef.current) return;
    const span = document.createElement("span");
    span.style.visibility = "hidden";
    span.style.position = "absolute";
    span.style.fontSize = "0.9rem";
    span.innerText = placeholderText;
    document.body.appendChild(span);
    setIsShort(span.offsetWidth < inputRef.current.offsetWidth);
    document.body.removeChild(span);
  }, [placeholderText]);


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
                <div className={styles.placeholderWrapper} data-short={isShort}>
                  <span className={styles.placeholderText}>{placeholderText}</span>
                  {!isShort && <span className={styles.placeholderText}>{placeholderText}</span>}
                </div>
              </div>
            )}
          </div>
          <button className="btn bg-white" type="submit" disabled={disable}>
            <ArrowUp style={{ color: "white" }} />
          </button>
        </div>
      </form>
      <div style={{ textAlign: "center", marginTop: 5 }}>
        <p style={{ margin: 0, fontSize: "0.8rem", color: "#aaa" }}>
          Developed by{" "}
          <a
            href="https://github.com/zhichzhang"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#aaa", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            Zhicheng Zhang
          </a>
        </p>
      </div>
    </div>
  );
}
