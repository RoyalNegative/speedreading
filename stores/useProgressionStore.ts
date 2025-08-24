import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Lesson = {
  id: string;
  title: string;
  wpm: number;
  text: string;
  prerequisiteId?: string;
};

export const LESSONS: Lesson[] = [
  {
    id: 'l1',
    title: 'Başlangıç 1: Tek Kelime',
    wpm: 250,
    text: 'Hızlı okuma temelleri ile başlıyoruz. Bu ilk derste tek kelime sunumlarına alışıyoruz.',
  },
  {
    id: 'l2',
    title: 'Başlangıç 2: Akıcılık',
    wpm: 300,
    text: 'Göz hareketlerini yormadan akıcı okumayı hedefliyoruz. Odak noktasını koru.',
    prerequisiteId: 'l1',
  },
  {
    id: 'l3',
    title: 'Orta 1: Hız Artışı',
    wpm: 350,
    text: 'Hız artışı ile birlikte anlam bütünlüğünü korumaya çalış. Nefesi ve ritmi sabit tut.',
    prerequisiteId: 'l2',
  },
  {
    id: 'l4',
    title: 'Orta 2: Bloklar',
    wpm: 380,
    text: 'Kelime blokları halinde işlem yapma fikrine hazırlan. Satır gözlemine dikkat.',
    prerequisiteId: 'l3',
  },
  {
    id: 'l5',
    title: 'İleri 1: Odak Derinliği',
    wpm: 420,
    text: 'Odakını genişlet ve kelimeleri daha hızlı ayrıştır. Regresyonları azalt.',
    prerequisiteId: 'l4',
  },
  {
    id: 'l6',
    title: 'İleri 2: Akış',
    wpm: 450,
    text: 'Ritmi koru, göz zıplamalarını minimize et. Düzenli tekrar ile kalıcılık hedeflenir.',
    prerequisiteId: 'l5',
  },
];

type ProgressionState = {
  // tamamlanan ders id'leri
  completedLessonIds: string[];
  // günlük hedef (1 puan) tamamlandı işareti için tarih (YYYY-MM-DD)
  dailyGoalDate: string | null;
};

type ProgressionActions = {
  completeLesson: (lessonId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  isLessonUnlocked: (lessonId: string) => boolean;
  isDailyGoalDoneToday: () => boolean;
  hydrate: () => Promise<void>;
};

const STORAGE_KEY = 'speedreading:progression:v1';

export const useProgressionStore = create<ProgressionState & ProgressionActions>((set, get) => ({
  completedLessonIds: [],
  dailyGoalDate: null,
  completeLesson: (lessonId: string) => {
    const completed = new Set(get().completedLessonIds);
    if (!completed.has(lessonId)) {
      completed.add(lessonId);
    }
    const today = new Date().toISOString().slice(0, 10);
    set({ completedLessonIds: Array.from(completed), dailyGoalDate: today });
    persist();
  },
  isLessonCompleted: (lessonId: string) => {
    return get().completedLessonIds.includes(lessonId);
  },
  isLessonUnlocked: (lessonId: string) => {
    const lesson = LESSONS.find((l) => l.id === lessonId);
    if (!lesson) return false;
    if (!lesson.prerequisiteId) return true;
    return get().completedLessonIds.includes(lesson.prerequisiteId);
  },
  isDailyGoalDoneToday: () => {
    const today = new Date().toISOString().slice(0, 10);
    return get().dailyGoalDate === today;
  },
  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as ProgressionState;
        set({ completedLessonIds: data.completedLessonIds ?? [], dailyGoalDate: data.dailyGoalDate ?? null });
      }
    } catch {}
  },
}));

async function persist() {
  try {
    const { completedLessonIds, dailyGoalDate } = useProgressionStore.getState();
    const payload: ProgressionState = { completedLessonIds, dailyGoalDate };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {}
}


