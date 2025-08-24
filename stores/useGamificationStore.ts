import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

type GamificationState = {
  xp: number;
  streak: number;
  lastStudyAt: string | null; // ISO string
};

type GamificationActions = {
  addXp: (amount: number) => void;
  tickStudy: () => void;
  reset: () => void;
  hydrate: () => Promise<void>;
};

const STORAGE_KEY = 'speedreading:gami:v1';

export const useGamificationStore = create<GamificationState & GamificationActions>((set, get) => ({
  xp: 0,
  streak: 0,
  lastStudyAt: null,
  addXp: (amount: number) => {
    set((state) => ({ xp: state.xp + amount }));
    persist();
  },
  tickStudy: () => {
    const now = new Date();
    const last = get().lastStudyAt ? new Date(get().lastStudyAt as string) : null;
    let nextStreak = get().streak;
    if (!last) {
      nextStreak = 1;
    } else {
      const daysDiff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 0) {
        // same day: keep
      } else if (daysDiff === 1) {
        nextStreak = get().streak + 1;
      } else if (daysDiff > 1) {
        nextStreak = 1; // reset
      }
    }
    set({ streak: nextStreak, lastStudyAt: now.toISOString() });
    persist();
  },
  reset: () => {
    set({ xp: 0, streak: 0, lastStudyAt: null });
    persist();
  },
  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GamificationState;
        set(parsed);
      }
    } catch (e) {
      // ignore
    }
  },
}));

async function persist() {
  try {
    const { xp, streak, lastStudyAt } = useGamificationStore.getState();
    const payload: GamificationState = { xp, streak, lastStudyAt };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    // ignore
  }
}


