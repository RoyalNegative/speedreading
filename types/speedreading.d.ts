export interface User {
  id: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  age: number;
  ageGroup: 'child' | 'teen' | 'adult';
  currentLevel: number;
  completedLevels: number[];
  totalProgress: number;
  createdAt: Date;
  provider?: 'google' | 'anonymous';
}

export interface SpeedReadingExercise {
  id: string;
  level: number;
  type: ExerciseType;
  title: string;
  description: string;
  ageGroup: 'child' | 'teen' | 'adult';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedDuration: number; // dakika
  targetWPM?: number; // Words Per Minute
  content?: string;
  words?: string[];
  settings: ExerciseSettings;
}

export type ExerciseType = 
  | 'eye_exercises'
  | 'peripheral_vision'
  | 'concentration'
  | 'memory_building'
  | 'word_recognition'
  | 'comprehension_test'
  | 'timed_reading'
  | 'flashing_words'
  | 'chunking'
  | 'smooth_pursuit';

export interface ExerciseSettings {
  speed?: number; // ms için gösterim süresi
  wordCount?: number;
  fontSize?: number;
  backgroundColor?: string;
  textColor?: string;
  flashDuration?: number;
  pauseDuration?: number;
  repetitions?: number;
}

export interface ExerciseResult {
  exerciseId: string;
  level: number;
  userId: string;
  wpm?: number;
  accuracy?: number;
  completionTime: number;
  score: number;
  passed: boolean;
  completedAt: Date;
}

export interface LevelRequirements {
  level: number;
  minScore: number;
  minWPM?: number;
  minAccuracy?: number;
  prerequisiteLevel?: number;
}

export interface AgeGroupConfig {
  ageGroup: 'child' | 'teen' | 'adult';
  ageRange: [number, number];
  baseWPM: number;
  targetWPM: number;
  difficultyMultiplier: number;
  exerciseTypes: ExerciseType[];
}