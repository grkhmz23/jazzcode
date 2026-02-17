import { Achievement } from "@/lib/playground/progress/achievements";

export interface QuestCompleteEvent {
  questId: string;
  timeMs: number | null;
  achievements: Achievement[];
  snapshotUrl: string;
}

type QuestCompleteListener = (event: QuestCompleteEvent) => void;

class QuestEventEmitter {
  private listeners = new Set<QuestCompleteListener>();

  subscribe(listener: QuestCompleteListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  emitQuestComplete(event: QuestCompleteEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }
}

export const questEventEmitter = new QuestEventEmitter();
