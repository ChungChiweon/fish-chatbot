import { QUICK_ACTIONS } from "@/lib/ai-captain/mock-data";
import type { CaptainAction } from "@/lib/ai-captain/types";

type QuickActionsProps = {
  onSelect: (label: string, action: CaptainAction) => void;
};

export function QuickActions({ onSelect }: QuickActionsProps) {
  return (
    <div className="captain-quick-actions" aria-label="빠른 질문">
      {QUICK_ACTIONS.map((item) => (
        <button key={item.action} type="button" onClick={() => onSelect(item.label, item.action)}>
          {item.label}
        </button>
      ))}
    </div>
  );
}
