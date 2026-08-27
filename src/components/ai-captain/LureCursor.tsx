import Image from "next/image";
import { MutableRefObject, useEffect, useRef } from "react";
import type { LureConfig, LurePointer } from "@/lib/ai-captain/lures";

type LureCursorProps = {
  config: LureConfig;
  pointerRef: MutableRefObject<LurePointer>;
  reducedMotion: boolean;
  followEnabled: boolean;
  onToggleFollow: () => void;
};

const INTERACTIVE_SELECTOR =
  "input, textarea, select, a, [contenteditable='true'], .captain-chat-panel";

export function LureCursor({
  config,
  pointerRef,
  reducedMotion,
  followEnabled,
  onToggleFollow,
}: LureCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const particleLayerRef = useRef<HTMLDivElement>(null);
  const lastParticleAtRef = useRef(0);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    let cleanupDesktop: (() => void) | undefined;

    const setupDesktop = () => {
      cleanupDesktop?.();
      cleanupDesktop = undefined;
      if (!media.matches || window.innerWidth < 640) {
        cursorRef.current?.style.setProperty("opacity", "0");
        return;
      }

      document.body.classList.add("lure-cursor-active");

      const handlePointerMove = (event: PointerEvent) => {
        const previous = pointerRef.current;
        const dx = previous.active ? event.clientX - previous.x : 0;
        const dy = previous.active ? event.clientY - previous.y : 0;
        const speed = Math.hypot(dx, dy);
        pointerRef.current = { x: event.clientX, y: event.clientY, dx, dy, speed, active: true };

        const target = event.target instanceof Element ? event.target : null;
        const overInteractive = Boolean(
          target?.closest(INTERACTIVE_SELECTOR) ||
          (target?.closest("button") && !target.closest(".captain-character")),
        );
        const cursor = cursorRef.current;
        if (!cursor) return;
        cursor.style.opacity = overInteractive ? "0" : "1";

        const motionTilt = reducedMotion
          ? 0
          : Math.max(-8, Math.min(8, dx * (config.effect === "tilt" ? 0.7 : 0.22)));
        cursor.style.transform = `translate3d(${event.clientX - config.hotspotX}px, ${event.clientY - config.hotspotY}px, 0) rotate(${config.rotation + motionTilt}deg)`;
        if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
        if (!reducedMotion && config.effect === "tilt") {
          settleTimerRef.current = setTimeout(() => {
            cursor.style.transform = `translate3d(${event.clientX - config.hotspotX}px, ${event.clientY - config.hotspotY}px, 0) rotate(${config.rotation}deg)`;
          }, 90);
        }

        if (
          config.effect === "particles" &&
          !reducedMotion &&
          !overInteractive &&
          speed > 3 &&
          event.timeStamp - lastParticleAtRef.current > 55
        ) {
          lastParticleAtRef.current = event.timeStamp;
          const layer = particleLayerRef.current;
          if (!layer) return;
          while (layer.childElementCount >= 10) layer.firstElementChild?.remove();
          const particle = document.createElement("span");
          const size = 2 + Math.random() * 3;
          particle.className = "lure-chum-particle";
          particle.style.left = `${event.clientX - 5 + Math.random() * 10}px`;
          particle.style.top = `${event.clientY - 5 + Math.random() * 10}px`;
          particle.style.width = `${size}px`;
          particle.style.height = `${size}px`;
          particle.style.setProperty("--drift-x", `${-dx * 1.3 + (Math.random() - 0.5) * 20}px`);
          particle.style.setProperty("--drift-y", `${12 + Math.random() * 18}px`);
          particle.addEventListener("animationend", () => particle.remove(), { once: true });
          layer.appendChild(particle);
        }
      };

      const handlePointerLeave = () => {
        pointerRef.current.active = false;
        cursorRef.current?.style.setProperty("opacity", "0");
      };

      const handleContextMenu = (event: MouseEvent) => {
        const target = event.target instanceof Element ? event.target : null;
        const selection = window.getSelection();
        if (
          target?.closest(INTERACTIVE_SELECTOR) ||
          (target?.closest("button") && !target.closest(".captain-character")) ||
          (selection && !selection.isCollapsed)
        ) {
          return;
        }
        event.preventDefault();
        onToggleFollow();
      };

      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", handlePointerLeave);
      document.addEventListener("contextmenu", handleContextMenu);

      cleanupDesktop = () => {
        document.body.classList.remove("lure-cursor-active");
        window.removeEventListener("pointermove", handlePointerMove);
        document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
        document.removeEventListener("contextmenu", handleContextMenu);
        particleLayerRef.current?.replaceChildren();
        if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      };
    };

    setupDesktop();
    media.addEventListener("change", setupDesktop);
    window.addEventListener("resize", setupDesktop);
    return () => {
      media.removeEventListener("change", setupDesktop);
      window.removeEventListener("resize", setupDesktop);
      cleanupDesktop?.();
    };
  }, [config, onToggleFollow, pointerRef, reducedMotion]);

  return (
    <>
      <div
        ref={cursorRef}
        className={`lure-cursor effect-${config.effect}`}
        style={{ width: config.widthDesktop, height: config.widthDesktop }}
        data-character-id={config.characterId}
        data-effect={config.effect}
        data-follow-mode={followEnabled ? "on" : "off"}
        aria-hidden="true"
      >
        <span className="lure-image-wrap" style={{ position: "absolute", inset: 0 }}>
          <Image src={config.asset} alt="" fill sizes={`${config.widthDesktop}px`} priority />
          {config.effect === "shimmer" && (
            <span
              className="lure-shimmer"
              style={{
                maskImage: `url(${config.asset})`,
                WebkitMaskImage: `url(${config.asset})`,
              }}
            />
          )}
        </span>
      </div>
      <div ref={particleLayerRef} className="lure-particle-layer" aria-hidden="true" />
    </>
  );
}
