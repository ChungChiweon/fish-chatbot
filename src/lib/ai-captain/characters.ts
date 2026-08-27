import type { CaptainCharacter, CaptainCharacterId } from "./types";

export const CAPTAIN_STORAGE_KEY = "blue-marina-ai-captain-character";
export const DEFAULT_CAPTAIN_ID: CaptainCharacterId = "red-seabream";

export const CAPTAIN_CHARACTERS: CaptainCharacter[] = [
  {
    id: "red-seabream",
    name: "참돔",
    role: "신뢰의 선장",
    description: "차분하고 정중한 프리미엄 캡틴",
    asset: "/characters/red-seabream-captain.webp",
    greeting: "안녕하세요. 오늘 바다에서 무엇을 도와드릴까요?",
    renderSize: { desktop: 148, mobile: 104 },
  },
  {
    id: "black-seabream",
    name: "감성돔",
    role: "실전의 가이드",
    description: "현실적이고 노련한 낚시 가이드",
    asset: "/characters/black-seabream-captain.webp",
    greeting: "반갑습니다. 오늘 출조 준비부터 함께 살펴볼까요?",
    renderSize: { desktop: 148, mobile: 104 },
  },
  {
    id: "bigfin-reef-squid",
    name: "무늬오징어",
    role: "지식의 인포메이트",
    description: "빠르고 영리한 바다 정보 안내자",
    asset: "/characters/bigfin-reef-squid-captain.webp",
    greeting: "궁금한 바다 정보가 있나요? 빠르게 찾아드릴게요.",
    renderSize: { desktop: 160, mobile: 112 },
  },
  {
    id: "octopus",
    name: "문어",
    role: "만능의 서포터",
    description: "친근하고 유쾌한 만능 도우미",
    asset: "/characters/octopus-captain.webp",
    greeting: "필요한 게 많아도 괜찮아요. 하나씩 같이 해결해볼까요?",
    renderSize: { desktop: 156, mobile: 110 },
  },
  {
    id: "hairtail",
    name: "갈치",
    role: "야해의 스페셜리스트",
    description: "날렵하고 세련된 야간 출조 전문가",
    asset: "/characters/hairtail-captain.webp",
    greeting: "오늘 밤바다와 출조 정보가 궁금하신가요?",
    renderSize: { desktop: 168, mobile: 118 },
  },
];

export function isCaptainCharacterId(value: string | null): value is CaptainCharacterId {
  return CAPTAIN_CHARACTERS.some((character) => character.id === value);
}

export function getCaptainCharacter(id: CaptainCharacterId) {
  return CAPTAIN_CHARACTERS.find((character) => character.id === id) ?? CAPTAIN_CHARACTERS[0];
}
