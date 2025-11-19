import { useState, useRef, useEffect } from "react";
import styles from "./index.module.less";
import { ArrowUp } from "lucide-react";

type Props = {
  disable: boolean;
  onSubmit: (query: string) => void;
  placeholderTexts?: string[];
};

export default function UserInput({
  onSubmit,
  disable,
  placeholderTexts = [
    "Can you introduce Cloudflare's products to me?",
    "What is the weather in Los Angeles, CA?",
    "How do I optimize serverless workflows?",
    "What is the fastest way to query a database?",
    "Explain edge computing in simple terms.",
  ],
}: Props) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isShort, setIsShort] = useState(false);
  const [displayedText, setDisplayedText] = useState(placeholderTexts[0]);
  const [isVisible, setIsVisible] = useState(true);

  const showPlaceholder = !query && !isFocused;

  useEffect(() => {
    if (!inputRef.current) return;
    const span = document.createElement("span");
    span.style.visibility = "hidden";
    span.style.position = "absolute";
    span.style.fontSize = "0.9rem";
    span.innerText = displayedText;
    document.body.appendChild(span);
    setIsShort(span.offsetWidth < inputRef.current.offsetWidth);
    document.body.removeChild(span);
  }, [displayedText]);

  useEffect(() => {
    if (!showPlaceholder) return;

    const displayTime = 3000;
    const fadeTime = 100;

    let timeout1: number | undefined;
    let timeout2: number | undefined;

    const cycle = () => {
      timeout1 = setTimeout(() => {
        setIsVisible(false);

        timeout2 = setTimeout(() => {
          setDisplayedText((prev) => {
            const currentIndex = placeholderTexts.indexOf(prev);
            return placeholderTexts[(currentIndex + 1) % placeholderTexts.length];
          });
          setIsVisible(true);
          cycle();
        }, fadeTime);
      }, displayTime);
    };

    cycle();

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [showPlaceholder, placeholderTexts]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSubmit(query);
    setQuery("");
  };

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
                  <span
                    className={styles.placeholderText}
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transition: "opacity 0.5s ease-in-out",
                    }}
                  >
                    {displayedText}
                  </span>
                  {!isShort && (
                    <span
                      className={styles.placeholderText}
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transition: "opacity 0.5s ease-in-out",
                      }}
                    >
                      {displayedText}
                    </span>
                  )}
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
            style={{
              color: "#aaa",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-secondary)")
            }
          >
            Zhicheng Zhang
          </a>
        </p>
      </div>
    </div>
  );
}
