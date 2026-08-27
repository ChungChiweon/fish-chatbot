import type { CaptainCharacterId } from "./types";

export type LureEffect = "flutter" | "particles" | "tilt" | "sway" | "shimmer";

export type LureConfig = {
  characterId: CaptainCharacterId;
  asset: string;
  label: string;
  widthDesktop: number;
  hotspotX: number;
  hotspotY: number;
  rotation: number;
  effect: LureEffect;
};

export type LurePointer = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  speed: number;
  active: boolean;
};

export const LURE_CONFIGS: Record<CaptainCharacterId, LureConfig> = {
  "red-seabream": {
    characterId: "red-seabream",
    asset: "/lures/tai-rubber.webp",
    label: "타이라바",
    widthDesktop: 68,
    hotspotX: 16,
    hotspotY: 15,
    rotation: -18,
    effect: "flutter",
  },
  "black-seabream": {
    characterId: "black-seabream",
    asset: "/lures/krill-chum.webp",
    label: "크릴 밑밥",
    widthDesktop: 54,
    hotspotX: 26,
    hotspotY: 25,
    rotation: 0,
    effect: "particles",
  },
  "bigfin-reef-squid": {
    characterId: "bigfin-reef-squid",
    asset: "/lures/egi.webp",
    label: "에기",
    widthDesktop: 70,
    hotspotX: 17,
    hotspotY: 16,
    rotation: -18,
    effect: "tilt",
  },
  octopus: {
    characterId: "octopus",
    asset: "/lures/octopus-lure.webp",
    label: "문어 전용 루어",
    widthDesktop: 64,
    hotspotX: 18,
    hotspotY: 16,
    rotation: -10,
    effect: "sway",
  },
  hairtail: {
    characterId: "hairtail",
    asset: "/lures/metal-jig.webp",
    label: "메탈지그",
    widthDesktop: 72,
    hotspotX: 18,
    hotspotY: 17,
    rotation: -16,
    effect: "shimmer",
  },
};

export function getLureConfig(characterId: CaptainCharacterId) {
  return LURE_CONFIGS[characterId];
}
