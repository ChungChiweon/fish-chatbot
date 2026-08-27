import type { Point } from "./types";

export const SAFE_MARGIN = 24;
export const DESKTOP_CAPTAIN_SIZE = 148;
export const MOBILE_CAPTAIN_SIZE = 104;

export function getCaptainSize(
  viewportWidth: number,
  desktopSize = DESKTOP_CAPTAIN_SIZE,
  mobileSize = MOBILE_CAPTAIN_SIZE,
) {
  return viewportWidth < 640 ? mobileSize : desktopSize;
}

export function getMovementBounds(width: number, height: number, size: number) {
  return {
    minX: SAFE_MARGIN,
    maxX: Math.max(SAFE_MARGIN, width - size - SAFE_MARGIN),
    minY: SAFE_MARGIN,
    maxY: Math.max(SAFE_MARGIN, height - size - SAFE_MARGIN),
  };
}

export function clampPoint(point: Point, width: number, height: number, size: number): Point {
  const bounds = getMovementBounds(width, height, size);
  return {
    x: Math.min(bounds.maxX, Math.max(bounds.minX, point.x)),
    y: Math.min(bounds.maxY, Math.max(bounds.minY, point.y)),
  };
}

export function chooseTarget(width: number, height: number, size: number): Point {
  const bounds = getMovementBounds(width, height, size);
  return {
    x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
    y: bounds.minY + Math.random() * (bounds.maxY - bounds.minY),
  };
}

export function easeInOutSine(progress: number) {
  return -(Math.cos(Math.PI * progress) - 1) / 2;
}

export function movementDuration(from: Point, to: Point) {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  return Math.min(10_000, Math.max(5_000, 4_600 + distance * 8));
}
