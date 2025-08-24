import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSpeedReadingStore } from '@/stores/useSpeedReadingStore';
import FlashingWordsExercise from '@/components/exercises/FlashingWordsExercise';
import { getExercisesForLevel } from '@/data/exercises';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function TrainScreen() {
  const { 
    currentUser, 
    currentLevel, 
    unlockedLevels, 
    canAccessLevel, 
    currentExercise,
    setCurrentExercise,
    completeExercise,
    calculateProgress,
    isOnboardingCompleted
  } = useSpeedReadingStore();

  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [availableExercises, setAvailableExercises] = useState<any[]>([]);

  // Onboarding tamamlanmamışsa onboarding'e yönlendir
  useEffect(() => {
    if (!isOnboardingCompleted || !currentUser) {
      router.replace('/(auth)/onboarding');
      return;
    }
  }, [isOnboardingCompleted, currentUser]);

  // Mevcut seviye için egzersizleri yükle
  useEffect(() => {
    if (currentUser && selectedLevel) {
      const exercises = getExercisesForLevel(selectedLevel, currentUser.ageGroup);
      setAvailableExercises(exercises);
    }
  }, [currentUser, selectedLevel]);

  // Eğer egzersiz modundaysa egzersiz ekranını göster
  if (currentExercise) {
    return (
      <FlashingWordsExercise
        exercise={currentExercise}
        onComplete={(result) => {
          completeExercise(result);
          setCurrentExercise(null);
        }}
        onExit={() => setCurrentExercise(null)}
      />
    );
  }

  if (!currentUser) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Yükleniyor...</ThemedText>
      </ThemedView>
    );
  }

  const progress = calculateProgress();
  const ageGroupInfo = getAgeGroupDisplayInfo(currentUser.ageGroup);

  return (
    <LinearGradient colors={["#4F46E5", "#7C3AED"]} style={StyleSheet.absoluteFill}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Hızlı Okuma Eğitimi
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            {ageGroupInfo.title} • Seviye {currentLevel}
          </ThemedText>
          
          {/* Progress */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <ThemedText style={styles.progressText}>{Math.round(progress)}% Tamamlandı</ThemedText>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Seviye Seçimi */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Seviye Seçin
            </ThemedText>
            <View style={styles.levelGrid}>
              {Array.from({ length: 100 }, (_, i) => i + 1).map((level) => {
                const isUnlocked = canAccessLevel(level);
                const isCurrent = level === currentLevel;
                const isCompleted = currentUser.completedLevels.includes(level);
                
                return (
                  <Pressable
                    key={level}
                    style={[
                      styles.levelButton,
                      !isUnlocked && styles.levelButtonLocked,
                      isCurrent && styles.levelButtonCurrent,
                      isCompleted && styles.levelButtonCompleted,
                      selectedLevel === level && styles.levelButtonSelected
                    ]}
                    onPress={() => isUnlocked && setSelectedLevel(level)}
                    disabled={!isUnlocked}
                  >
                    <Text style={[
                      styles.levelButtonText,
                      !isUnlocked && styles.levelButtonTextLocked,
                      (isCurrent || isCompleted) && styles.levelButtonTextHighlight
                    ]}>
                      {level}
                    </Text>
                    {isCompleted && (
                      <Text style={styles.completedIcon}>✓</Text>
                    )}
                    {!isUnlocked && (
                      <Text style={styles.lockedIcon}>🔒</Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Seçili seviye için egzersizler */}
          {selectedLevel && availableExercises.length > 0 && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Seviye {selectedLevel} Egzersizleri
              </ThemedText>
              {availableExercises.map((exercise) => (
                <Pressable
                  key={exercise.id}
                  style={styles.exerciseCard}
                  onPress={() => setCurrentExercise(exercise)}
                >
                  <View style={styles.exerciseInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.exerciseTitle}>
                      {exercise.title}
                    </ThemedText>
                    <ThemedText style={styles.exerciseDescription}>
                      {exercise.description}
                    </ThemedText>
                    <View style={styles.exerciseStats}>
                      <View style={styles.exerciseStat}>
                        <ThemedText style={styles.exerciseStatLabel}>Süre:</ThemedText>
                        <ThemedText style={styles.exerciseStatValue}>{exercise.estimatedDuration}dk</ThemedText>
                      </View>
                      {exercise.targetWPM && (
                        <View style={styles.exerciseStat}>
                          <ThemedText style={styles.exerciseStatLabel}>Hedef:</ThemedText>
                          <ThemedText style={styles.exerciseStatValue}>{exercise.targetWPM} WPM</ThemedText>
                        </View>
                      )}
                      <View style={styles.exerciseStat}>
                        <ThemedText style={styles.exerciseStatLabel}>Zorluk:</ThemedText>
                        <ThemedText style={[
                          styles.exerciseStatValue,
                          exercise.difficulty === 'easy' && styles.difficultyEasy,
                          exercise.difficulty === 'medium' && styles.difficultyMedium,
                          exercise.difficulty === 'hard' && styles.difficultyHard
                        ]}>
                          {getDifficultyText(exercise.difficulty)}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                  <View style={styles.exerciseAction}>
                    <Text style={styles.exerciseActionText}>▶</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {/* Hızlı Başlangıç */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Hızlı Başlangıç
            </ThemedText>
            <Pressable
              style={styles.quickStartButton}
              onPress={() => {
                const currentLevelExercises = getExercisesForLevel(currentLevel, currentUser.ageGroup);
                if (currentLevelExercises.length > 0) {
                  setCurrentExercise(currentLevelExercises[0]);
                }
              }}
            >
              <Text style={styles.quickStartText}>
                Seviye {currentLevel} Egzersize Başla
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </ThemedView>
    </LinearGradient>
  );
}

const getAgeGroupDisplayInfo = (ageGroup: 'child' | 'teen' | 'adult') => {
  const info = {
    child: { title: 'Çocuk Grubu', icon: '🧒' },
    teen: { title: 'Genç Grubu', icon: '👦' },
    adult: { title: 'Yetişkin Grubu', icon: '👨' }
  };
  return info[ageGroup];
};

const getDifficultyText = (difficulty: 'easy' | 'medium' | 'hard') => {
  const texts = {
    easy: 'Kolay',
    medium: 'Orta',
    hard: 'Zor'
  };
  return texts[difficulty];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 4,
  },
  progressText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: 'white',
    marginBottom: 16,
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  levelButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  levelButtonLocked: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    opacity: 0.5,
  },
  levelButtonCurrent: {
    backgroundColor: '#3b82f6',
    borderColor: '#60a5fa',
  },
  levelButtonCompleted: {
    backgroundColor: '#22c55e',
    borderColor: '#4ade80',
  },
  levelButtonSelected: {
    borderColor: '#fbbf24',
    backgroundColor: 'rgba(251,191,36,0.2)',
  },
  levelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  levelButtonTextLocked: {
    color: 'rgba(255,255,255,0.4)',
  },
  levelButtonTextHighlight: {
    color: 'white',
  },
  completedIcon: {
    position: 'absolute',
    top: -2,
    right: -2,
    fontSize: 12,
    color: 'white',
  },
  lockedIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    fontSize: 10,
  },
  exerciseCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    color: 'white',
    marginBottom: 4,
  },
  exerciseDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  exerciseStats: {
    flexDirection: 'row',
    gap: 16,
  },
  exerciseStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exerciseStatLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  exerciseStatValue: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyEasy: {
    color: '#4ade80',
  },
  difficultyMedium: {
    color: '#fbbf24',
  },
  difficultyHard: {
    color: '#f87171',
  },
  exerciseAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickStartButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickStartText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


