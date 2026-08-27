import { useEffect, useRef, useState } from "react";

export function CaptainVoiceButton() {
  const [isListening, setIsListening] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const toggleListening = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    timeoutRef.current = setTimeout(() => setIsListening(false), 3_000);
  };

  return (
    <div className="captain-voice-wrap">
      <button
        type="button"
        className={`captain-voice-button${isListening ? " is-listening" : ""}`}
        onClick={toggleListening}
        aria-label={isListening ? "음성 듣기 중지" : "음성으로 질문하기"}
        aria-pressed={isListening}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 14.5a3.5 3.5 0 0 0 3.5-3.5V5a3.5 3.5 0 1 0-7 0v6a3.5 3.5 0 0 0 3.5 3.5Z" />
          <path d="M5.8 10.5V11a6.2 6.2 0 0 0 12.4 0v-.5M12 17.2V21M8.5 21h7" />
        </svg>
      </button>
      <span aria-live="polite">{isListening ? "듣고 있어요…" : "음성으로 물어보기"}</span>
    </div>
  );
}
