import Image from "next/image";
import type { CaptainCharacter, Point } from "@/lib/ai-captain/types";

type FloatingCaptainProps = {
  position: Point;
  size: number;
  direction: "left" | "right";
  isOpen: boolean;
  isHovered: boolean;
  isSwapping: boolean;
  character: CaptainCharacter;
  onClick: () => void;
  onHoverChange: (hovered: boolean) => void;
};

export function FloatingCaptain({
  position,
  size,
  direction,
  isOpen,
  isHovered,
  isSwapping,
  character,
  onClick,
  onHoverChange,
}: FloatingCaptainProps) {
  return (
    <div
      className="captain-floater"
      style={{ width: size, height: size, transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
    >
      <button
        type="button"
        className={`captain-character${isOpen ? " is-open" : ""}${isHovered ? " is-hovered" : ""}`}
        onClick={onClick}
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        onFocus={() => onHoverChange(true)}
        onBlur={() => onHoverChange(false)}
        aria-label={`${character.name} AI Captain과 대화하기`}
        aria-expanded={isOpen}
      >
        <span
          className={`captain-image-shell faces-${direction}${isSwapping ? " is-swapping" : ""}`}
          key={character.id}
        >
          <Image
            src={character.asset}
            alt={`제복을 입은 ${character.name} AI Captain`}
            fill
            sizes="(max-width: 639px) 118px, 168px"
            priority
          />
        </span>
        {!isOpen && <span className="captain-hover-hint">무엇을 도와드릴까요?</span>}
      </button>
    </div>
  );
}
