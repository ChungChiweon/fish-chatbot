import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CAPTAIN_CHARACTERS } from "@/lib/ai-captain/characters";
import { PROTOTYPE_REPLY } from "@/lib/ai-captain/mock-data";
import type {
  CaptainAction,
  CaptainCharacter,
  CaptainCharacterId,
  CaptainMessage,
  Point,
} from "@/lib/ai-captain/types";
import { CaptainVoiceButton } from "./CaptainVoiceButton";
import { QuickActions } from "./QuickActions";

type CaptainChatPanelProps = {
  position: Point;
  captainSize: number;
  messages: CaptainMessage[];
  character: CaptainCharacter;
  onMessagesChange: (messages: CaptainMessage[]) => void;
  onCharacterSelect: (id: CaptainCharacterId) => void;
  onAction?: (action: CaptainAction) => void;
  onClose: () => void;
};

export function CaptainChatPanel({
  position,
  captainSize,
  messages,
  character,
  onMessagesChange,
  onCharacterSelect,
  onAction,
  onClose,
}: CaptainChatPanelProps) {
  const [input, setInput] = useState("");
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const viewportWidth = typeof window === "undefined" ? 1024 : window.innerWidth;
  const panelWidth = 356;
  const placeRight = position.x + captainSize / 2 < viewportWidth / 2;
  const panelLeft = placeRight
    ? Math.min(viewportWidth - panelWidth - 20, position.x + captainSize + 20)
    : Math.max(20, position.x - panelWidth - 20);
  const panelTop = typeof window === "undefined"
    ? 40
    : Math.min(window.innerHeight - 560, Math.max(20, position.y - 140));

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const ask = (question: string, action?: CaptainAction) => {
    const stamp = Date.now();
    onMessagesChange([
      ...messages,
      { id: `user-${stamp}`, role: "user", text: question },
      { id: `captain-${stamp}`, role: "captain", text: PROTOTYPE_REPLY },
    ]);
    if (action) onAction?.(action);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = input.trim();
    if (!question) return;
    ask(question);
    setInput("");
  };

  return (
    <section
      className="captain-chat-panel"
      style={{ "--panel-left": `${panelLeft}px`, "--panel-top": `${Math.max(20, panelTop)}px` } as React.CSSProperties}
      role="dialog"
      aria-modal="false"
      aria-label="AI Captain 채팅"
    >
      <header className="captain-chat-header">
        <div className="captain-header-avatar">
          <Image src={character.asset} alt="" fill sizes="38px" />
        </div>
        <div className="captain-header-identity">
          <strong>{character.name}</strong>
          <span>{character.role}</span>
        </div>
        <button
          type="button"
          className="captain-selector-toggle"
          onClick={() => setIsSelectorOpen((current) => !current)}
          aria-expanded={isSelectorOpen}
          aria-controls="captain-character-selector"
        >
          {isSelectorOpen ? "선택 닫기" : "캐릭터 변경"}
        </button>
        <button ref={closeRef} className="captain-close-button" type="button" onClick={onClose} aria-label="채팅 닫기">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </header>

      {isSelectorOpen && (
        <div id="captain-character-selector" className="captain-character-selector" aria-label="AI Captain 캐릭터 선택">
          {CAPTAIN_CHARACTERS.map((option) => {
            const selected = option.id === character.id;
            return (
              <button
                key={option.id}
                type="button"
                className={selected ? "is-selected" : undefined}
                onClick={() => {
                  onCharacterSelect(option.id);
                  setIsSelectorOpen(false);
                }}
                aria-pressed={selected}
              >
                <span className="captain-selector-thumb">
                  <Image src={option.asset} alt="" fill sizes="42px" />
                </span>
                <span>
                  <strong>{option.name}</strong>
                  <small>{option.role}</small>
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="captain-message-list" ref={listRef} aria-live="polite">
        {messages.map((message) => (
          <div key={message.id} className={`captain-message ${message.role}`}>
            {message.text}
          </div>
        ))}
      </div>

      <QuickActions onSelect={(label, action) => ask(label, action)} />
      <CaptainVoiceButton />

      <form className="captain-chat-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="captain-input">AI Captain에게 질문</label>
        <input
          id="captain-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="무엇이 궁금하세요?"
          autoComplete="off"
        />
        <button type="submit" aria-label="질문 전송">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 12 16-8-5.2 16-3.3-6.5L4 12Zm7.5 1.5L20 4" /></svg>
        </button>
      </form>
    </section>
  );
}
