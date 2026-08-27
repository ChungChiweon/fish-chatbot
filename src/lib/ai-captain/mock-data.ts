import type { CaptainMessage, QuickAction } from "./types";
import { DEFAULT_CAPTAIN_ID, getCaptainCharacter } from "./characters";

export const INITIAL_MESSAGES: CaptainMessage[] = [
  {
    id: "welcome",
    role: "captain",
    text: getCaptainCharacter(DEFAULT_CAPTAIN_ID).greeting,
  },
];

export const QUICK_ACTIONS: QuickAction[] = [
  { label: "오늘 바다", action: "OPEN_SEA" },
  { label: "낚시 포인트", action: "OPEN_FISHING_SPOTS" },
  { label: "어종 찾기", action: "OPEN_FISH" },
  { label: "출조 준비", action: "OPEN_LICENSE_GUIDE" },
];

export const PROTOTYPE_REPLY =
  "현재는 UI 프로토타입 단계입니다. Blue Marina 연결 후 실제 바다 정보를 안내할 예정입니다.";
