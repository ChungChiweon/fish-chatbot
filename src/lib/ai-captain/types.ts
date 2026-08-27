export type CaptainAction =
  | "OPEN_SEA"
  | "OPEN_FISH"
  | "OPEN_FISHING_SPOTS"
  | "OPEN_LICENSE_GUIDE";

export type CaptainMessage = {
  id: string;
  role: "captain" | "user";
  text: string;
};

export type QuickAction = {
  label: string;
  action: CaptainAction;
};

export type Point = { x: number; y: number };

export type CaptainCharacterId =
  | "red-seabream"
  | "black-seabream"
  | "bigfin-reef-squid"
  | "octopus"
  | "hairtail";

export type CaptainCharacter = {
  id: CaptainCharacterId;
  name: string;
  role: string;
  description: string;
  asset: string;
  greeting: string;
  renderSize: {
    desktop: number;
    mobile: number;
  };
};
