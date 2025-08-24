import { create } from 'zustand';
import { User, SpeedReadingExercise, ExerciseResult, AgeGroupConfig } from '../types/speedreading';
import { SPEED_READING_EXERCISES } from '../data/exercises';

interface SpeedReadingState {
  // User State
  currentUser: User | null;
  isOnboardingCompleted: boolean;
  
  // Exercise State
  exercises: SpeedReadingExercise[];
  currentExercise: SpeedReadingExercise | null;
  exerciseResults: ExerciseResult[];
  
  // Level System
  currentLevel: number;
  unlockedLevels: number[];
  maxUnlockedLevel: number;
  
  // Age Group Configuration
  ageGroupConfigs: AgeGroupConfig[];
  currentAgeGroup: AgeGroupConfig | null;
  
  // Actions
  setUser: (user: User) => void;
  completeOnboarding: (age: number) => void;
  setCurrentExercise: (exercise: SpeedReadingExercise | null) => void;
  completeExercise: (result: ExerciseResult) => void;
  unlockNextLevel: () => void;
  getExercisesForLevel: (level: number) => SpeedReadingExercise[];
  canAccessLevel: (level: number) => boolean;
  calculateProgress: () => number;
  resetProgress: () => void;
  loadExercises: () => void;
}

// Yaş grup konfigürasyonları
const AGE_GROUP_CONFIGS: AgeGroupConfig[] = [
  {
    ageGroup: 'child',
    ageRange: [6, 12],
    baseWPM: 50,
    targetWPM: 150,
    difficultyMultiplier: 0.7,
    exerciseTypes: ['eye_exercises', 'word_recognition', 'flashing_words', 'concentration', 'memory_building']
  },
  {
    ageGroup: 'teen',
    ageRange: [13, 17],
    baseWPM: 100,
    targetWPM: 300,
    difficultyMultiplier: 0.85,
    exerciseTypes: ['eye_exercises', 'peripheral_vision', 'word_recognition', 'flashing_words', 'chunking', 'timed_reading', 'concentration']
  },
  {
    ageGroup: 'adult',
    ageRange: [18, 100],
    baseWPM: 120,
    targetWPM: 500,
    difficultyMultiplier: 1.0,
    exerciseTypes: ['eye_exercises', 'peripheral_vision', 'word_recognition', 'flashing_words', 'chunking', 'timed_reading', 'comprehension_test', 'smooth_pursuit']
  }
];

export const useSpeedReadingStore = create<SpeedReadingState>((set, get) => ({
  // Initial State
  currentUser: null,
  isOnboardingCompleted: false,
  exercises: [],
  currentExercise: null,
  exerciseResults: [],
  currentLevel: 1,
  unlockedLevels: [1],
  maxUnlockedLevel: 1,
  ageGroupConfigs: AGE_GROUP_CONFIGS,
  currentAgeGroup: null,

  // Load exercises data
  loadExercises: () => {
    set({ exercises: SPEED_READING_EXERCISES });
  },

  // Actions
  setUser: (user: User) => {
    const ageGroup = AGE_GROUP_CONFIGS.find(config => 
      user.age >= config.ageRange[0] && user.age <= config.ageRange[1]
    );
    
    set({ 
      currentUser: user, 
      currentAgeGroup: ageGroup || null,
      currentLevel: user.currentLevel,
      unlockedLevels: user.completedLevels.concat([user.currentLevel]),
      maxUnlockedLevel: Math.max(...user.completedLevels.concat([user.currentLevel]))
    });

    // Load exercises if not already loaded
    const { exercises } = get();
    if (exercises.length === 0) {
      get().loadExercises();
    }
  },

  completeOnboarding: (age: number) => {
    const ageGroup = age <= 12 ? 'child' : age <= 17 ? 'teen' : 'adult';
    const ageGroupConfig = AGE_GROUP_CONFIGS.find(config => config.ageGroup === ageGroup);
    
    const newUser: User = {
      id: Date.now().toString(),
      age,
      ageGroup,
      currentLevel: 1,
      completedLevels: [],
      totalProgress: 0,
      createdAt: new Date()
    };
    
    set({ 
      currentUser: newUser, 
      isOnboardingCompleted: true,
      currentAgeGroup: ageGroupConfig || null,
      currentLevel: 1,
      unlockedLevels: [1],
      maxUnlockedLevel: 1
    });

    // Load exercises
    get().loadExercises();
  },

  setCurrentExercise: (exercise: SpeedReadingExercise | null) => {
    set({ currentExercise: exercise });
  },

  completeExercise: (result: ExerciseResult) => {
    const { currentUser, exerciseResults, currentLevel, unlockedLevels } = get();
    
    if (!currentUser) return;
    
    const newResults = [...exerciseResults, result];
    const levelResults = newResults.filter(r => r.level === result.level);
    const levelCompleted = levelResults.length >= 3 && // En az 3 egzersiz
                          levelResults.every(r => r.passed); // Hepsini geçmiş olmalı
    
    let newUnlockedLevels = [...unlockedLevels];
    let newCurrentLevel = currentLevel;
    let newCompletedLevels = [...currentUser.completedLevels];
    
    if (levelCompleted && !newCompletedLevels.includes(result.level)) {
      newCompletedLevels.push(result.level);
      if (result.level < 100) {
        const nextLevel = result.level + 1;
        if (!newUnlockedLevels.includes(nextLevel)) {
          newUnlockedLevels.push(nextLevel);
        }
        newCurrentLevel = nextLevel;
      }
    }
    
    const updatedUser: User = {
      ...currentUser,
      currentLevel: newCurrentLevel,
      completedLevels: newCompletedLevels,
      totalProgress: (newCompletedLevels.length / 100) * 100
    };
    
    set({ 
      exerciseResults: newResults,
      currentUser: updatedUser,
      currentLevel: newCurrentLevel,
      unlockedLevels: newUnlockedLevels,
      maxUnlockedLevel: Math.max(...newUnlockedLevels)
    });
  },

  unlockNextLevel: () => {
    const { currentLevel, unlockedLevels } = get();
    const nextLevel = currentLevel + 1;
    
    if (nextLevel <= 100 && !unlockedLevels.includes(nextLevel)) {
      set({ 
        unlockedLevels: [...unlockedLevels, nextLevel],
        maxUnlockedLevel: Math.max(...unlockedLevels, nextLevel)
      });
    }
  },

  getExercisesForLevel: (level: number) => {
    const { exercises, currentAgeGroup } = get();
    
    if (!currentAgeGroup) return [];
    
    return exercises.filter(exercise => 
      exercise.level === level && 
      exercise.ageGroup === currentAgeGroup.ageGroup
    );
  },

  canAccessLevel: (level: number) => {
    const { unlockedLevels } = get();
    return unlockedLevels.includes(level);
  },

  calculateProgress: () => {
    const { currentUser } = get();
    if (!currentUser) return 0;
    return currentUser.totalProgress;
  },

  resetProgress: () => {
    set({ 
      currentLevel: 1,
      unlockedLevels: [1],
      maxUnlockedLevel: 1,
      exerciseResults: [],
      currentExercise: null
    });
  }
}));