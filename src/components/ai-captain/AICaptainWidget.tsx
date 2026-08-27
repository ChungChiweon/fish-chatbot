"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CAPTAIN_STORAGE_KEY,
  DEFAULT_CAPTAIN_ID,
  getCaptainCharacter,
  isCaptainCharacterId,
} from "@/lib/ai-captain/characters";
import {
  chooseTarget,
  clampPoint,
  easeInOutSine,
  getCaptainSize,
  movementDuration,
} from "@/lib/ai-captain/movement";
import { INITIAL_MESSAGES } from "@/lib/ai-captain/mock-data";
import { getLureConfig } from "@/lib/ai-captain/lures";
import type { LurePointer } from "@/lib/ai-captain/lures";
import type {
  CaptainAction,
  CaptainCharacterId,
  CaptainMessage,
  Point,
} from "@/lib/ai-captain/types";
import { CaptainChatPanel } from "./CaptainChatPanel";
import { FloatingCaptain } from "./FloatingCaptain";
import { FollowToast } from "./FollowToast";
import { LureCursor } from "./LureCursor";

type AICaptainWidgetProps = {
  onAction?: (action: CaptainAction) => void;
};

export function AICaptainWidget({ onAction }: AICaptainWidgetProps) {
  const [position, setPosition] = useState<Point>({ x: 28, y: 104 });
  const [captainSize, setCaptainSize] = useState(148);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<CaptainCharacterId>(DEFAULT_CAPTAIN_ID);
  const [isCharacterSwapping, setIsCharacterSwapping] = useState(false);
  const [isFollowMode, setIsFollowMode] = useState(false);
  const [followToast, setFollowToast] = useState<{ id: number; message: string } | null>(null);
  const [messages, setMessages] = useState<CaptainMessage[]>(INITIAL_MESSAGES);
  const positionRef = useRef(position);
  const animationRef = useRef<number | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerRef = useRef<LurePointer>({ x: 0, y: 0, dx: 0, dy: 0, speed: 0, active: false });
  const currentCharacter = getCaptainCharacter(selectedCharacterId);
  const currentLure = getLureConfig(selectedCharacterId);
  const paused = isHovered || isOpen || (reducedMotion && !isFollowMode);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const storedId = window.localStorage.getItem(CAPTAIN_STORAGE_KEY);
    const safeId = isCaptainCharacterId(storedId) ? storedId : DEFAULT_CAPTAIN_ID;
    const storedCharacter = getCaptainCharacter(safeId);
    if (storedId !== safeId) window.localStorage.setItem(CAPTAIN_STORAGE_KEY, safeId);
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setSelectedCharacterId(safeId);
      setMessages([{ id: `welcome-${safeId}`, role: "captain", text: storedCharacter.greeting }]);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const size = getCaptainSize(
        window.innerWidth,
        currentCharacter.renderSize.desktop,
        currentCharacter.renderSize.mobile,
      );
      setCaptainSize(size);
      setPosition((current) => clampPoint(current, window.innerWidth, window.innerHeight, size));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentCharacter.renderSize.desktop, currentCharacter.renderSize.mobile]);

  useEffect(() => {
    if (paused) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      return;
    }

    let disposed = false;

    if (isFollowMode) {
      const followFrame = () => {
        if (disposed) return;
        const pointer = pointerRef.current;
        if (pointer.active) {
          const current = positionRef.current;
          const centerX = current.x + captainSize / 2;
          const centerY = current.y + captainSize / 2;
          let vectorX = pointer.speed > 0.5 ? pointer.dx : pointer.x - centerX;
          let vectorY = pointer.speed > 0.5 ? pointer.dy : pointer.y - centerY;
          const vectorLength = Math.hypot(vectorX, vectorY) || 1;
          vectorX /= vectorLength;
          vectorY /= vectorLength;
          const trailingDistance = Math.min(160, Math.max(80, 104 + captainSize * 0.15));
          const target = clampPoint(
            {
              x: pointer.x - vectorX * trailingDistance - captainSize / 2,
              y: pointer.y - vectorY * trailingDistance - captainSize / 2,
            },
            window.innerWidth,
            window.innerHeight,
            captainSize,
          );
          const followEase = reducedMotion ? 0.035 : 0.072;
          const next = {
            x: current.x + (target.x - current.x) * followEase,
            y: current.y + (target.y - current.y) * followEase,
          };
          if (Math.abs(target.x - current.x) > 0.3) {
            setDirection(target.x >= current.x ? "right" : "left");
          }
          positionRef.current = next;
          setPosition(next);
        }
        animationRef.current = requestAnimationFrame(followFrame);
      };
      animationRef.current = requestAnimationFrame(followFrame);
      return () => {
        disposed = true;
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }

    const swim = () => {
      if (disposed) return;
      const from = positionRef.current;
      const to = chooseTarget(window.innerWidth, window.innerHeight, captainSize);
      setDirection(to.x >= from.x ? "right" : "left");
      const duration = movementDuration(from, to);
      const startedAt = performance.now();

      const frame = (now: number) => {
        if (disposed) return;
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = easeInOutSine(progress);
        const next = {
          x: from.x + (to.x - from.x) * eased,
          y: from.y + (to.y - from.y) * eased,
        };
        positionRef.current = next;
        setPosition(next);
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(frame);
        } else {
          pauseTimerRef.current = setTimeout(swim, 350 + Math.random() * 650);
        }
      };
      animationRef.current = requestAnimationFrame(frame);
    };

    pauseTimerRef.current = setTimeout(swim, 500);
    return () => {
      disposed = true;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, [captainSize, isFollowMode, paused, reducedMotion]);

  const closeChat = useCallback(() => setIsOpen(false), []);

  useEffect(() => () => {
    if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  const handleToggleFollow = useCallback(() => {
    const next = !isFollowMode;
    const message = next
      ? `${currentCharacter.name} 선장이 미끼를 따라갑니다`
      : "자유 유영으로 돌아갑니다";
    setIsFollowMode(next);
    setFollowToast({ id: Date.now(), message });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setFollowToast(null), 1_400);
  }, [currentCharacter.name, isFollowMode]);

  const commitCharacter = useCallback((id: CaptainCharacterId) => {
    const nextCharacter = getCaptainCharacter(id);
    setSelectedCharacterId(id);
    setMessages([{ id: `welcome-${id}`, role: "captain", text: nextCharacter.greeting }]);
    window.localStorage.setItem(CAPTAIN_STORAGE_KEY, id);
  }, []);

  const handleCharacterSelect = useCallback((id: CaptainCharacterId) => {
    if (id === selectedCharacterId) return;
    if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    if (reducedMotion) {
      commitCharacter(id);
      return;
    }
    setIsCharacterSwapping(true);
    swapTimerRef.current = setTimeout(() => {
      commitCharacter(id);
      revealTimerRef.current = setTimeout(() => setIsCharacterSwapping(false), 30);
    }, 180);
  }, [commitCharacter, reducedMotion, selectedCharacterId]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeChat, isOpen]);

  const handleOpen = () => {
    setPosition((current) => {
      const safePosition = clampPoint(current, window.innerWidth, window.innerHeight, captainSize);
      if (window.innerWidth < 640) {
        return {
          ...safePosition,
          y: Math.min(safePosition.y, Math.max(24, window.innerHeight * 0.22 - captainSize / 2)),
        };
      }
      return safePosition;
    });
    setIsOpen(true);
  };

  return (
    <div
      className="captain-overlay"
      data-chat-open={isOpen || undefined}
      data-follow-mode={isFollowMode ? "on" : "off"}
      data-reduced-motion={reducedMotion || undefined}
    >
      <LureCursor
        config={currentLure}
        pointerRef={pointerRef}
        reducedMotion={reducedMotion}
        followEnabled={isFollowMode}
        onToggleFollow={handleToggleFollow}
      />
      <FloatingCaptain
        position={position}
        size={captainSize}
        direction={direction}
        isOpen={isOpen}
        isHovered={isHovered}
        isSwapping={isCharacterSwapping}
        character={currentCharacter}
        onClick={handleOpen}
        onHoverChange={setIsHovered}
      />
      {isOpen && (
        <CaptainChatPanel
          position={position}
          captainSize={captainSize}
          messages={messages}
          character={currentCharacter}
          onMessagesChange={setMessages}
          onCharacterSelect={handleCharacterSelect}
          onAction={onAction}
          onClose={closeChat}
        />
      )}
      <FollowToast key={followToast?.id} message={followToast?.message ?? null} />
    </div>
  );
}
