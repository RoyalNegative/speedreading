import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { ThemedText } from '../ThemedText';
import ExerciseWrapper from './ExerciseWrapper';
import { SpeedReadingExercise, ExerciseResult } from '@/types/speedreading';

interface FlashingWordsExerciseProps {
  exercise: SpeedReadingExercise;
  onComplete: (result: ExerciseResult) => void;
  onExit: () => void;
}

export default function FlashingWordsExercise({ 
  exercise, 
  onComplete, 
  onExit 
}: FlashingWordsExerciseProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWord, setShowWord] = useState(true);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [exerciseStartTime, setExerciseStartTime] = useState<number>(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Yaş grubuna göre ayarlanmış kelimeler
  const getWords = () => {
    if (exercise.words && exercise.words.length > 0) {
      return exercise.words;
    }

    // Yaş grubuna göre varsayılan kelimeler
    const childWords = [
      'ev', 'okul', 'kitap', 'kalem', 'masa', 'su', 'güneş', 'ay', 
      'çiçek', 'kedı', 'köpek', 'araba', 'top', 'oyun', 'yemek', 'anne'
    ];

    const teenWords = [
      'bilgisayar', 'telefon', 'müzik', 'spor', 'arkadaş', 'ders', 
      'tatil', 'sinema', 'oyun', 'resim', 'şarkı', 'film', 'roman', 
      'matematik', 'tarih', 'coğrafya', 'fen', 'edebiyat'
    ];

    const adultWords = [
      'teknoloji', 'girişimcilik', 'yatırım', 'strategi', 'pazarlama', 
      'liderlik', 'inovasyon', 'sürdürülebilirlik', 'optimizasyon', 
      'verimlilik', 'analiz', 'sentez', 'karmaşıklık', 'çözüm'
    ];

    switch (exercise.ageGroup) {
      case 'child':
        return childWords;
      case 'teen':
        return teenWords;
      case 'adult':
        return adultWords;
      default:
        return teenWords;
    }
  };

  const words = getWords();
  const flashDuration = exercise.settings.flashDuration || 1000;
  const pauseDuration = exercise.settings.pauseDuration || 500;
  const totalWords = Math.min(words.length, exercise.settings.repetitions || 15);

  const currentWord = words[currentWordIndex % words.length];
  const progress = (currentWordIndex / totalWords) * 100;

  useEffect(() => {
    if (isPlaying && !sessionCompleted) {
      const timer = setTimeout(() => {
        setShowWord(!showWord);
        
        if (!showWord) {
          // Kelime gizlendiğinde, bir sonraki kelimeye geç
          if (currentWordIndex < totalWords - 1) {
            setCurrentWordIndex(prev => prev + 1);
          } else {
            // Egzersiz tamamlandı
            setSessionCompleted(true);
            setIsPlaying(false);
          }
        }
      }, showWord ? flashDuration : pauseDuration);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, showWord, currentWordIndex, totalWords, sessionCompleted]);

  const startExercise = useCallback(() => {
    setIsPlaying(true);
    setExerciseStartTime(Date.now());
    setCurrentWordIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setSessionCompleted(false);
    setShowWord(true);
  }, []);

  const pauseExercise = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleComplete = useCallback(() => {
    const completionTime = Date.now() - exerciseStartTime;
    const wpm = Math.round((totalWords / (completionTime / 60000)));
    const accuracy = Math.round((correctAnswers / totalWords) * 100);
    const finalScore = Math.round((wpm * accuracy) / 100);
    const passed = finalScore >= (exercise.targetWPM || 50) * 0.8;

    const result: ExerciseResult = {
      exerciseId: exercise.id,
      level: exercise.level,
      userId: 'current-user', // Bu gerçek uygulamada user ID'den gelecek
      wpm,
      accuracy,
      completionTime: completionTime / 1000, // saniye cinsinden
      score: finalScore,
      passed,
      completedAt: new Date()
    };

    onComplete(result);
  }, [exercise, totalWords, correctAnswers, exerciseStartTime, onComplete]);

  // Kullanıcı kelimeyi gördüğünü onayladığında
  const handleWordSeen = useCallback(() => {
    setCorrectAnswers(prev => prev + 1);
    setScore(prev => prev + 10);
  }, []);

  return (
    <ExerciseWrapper
      title={exercise.title}
      description={exercise.description}
      duration={exercise.estimatedDuration}
      targetWPM={exercise.targetWPM}
      level={exercise.level}
      progress={progress}
      isCompleted={sessionCompleted}
      onComplete={handleComplete}
      onExit={onExit}
    >
      <View style={styles.container}>
        {/* Egzersiz Alanı */}
        <View style={styles.exerciseArea}>
          <View style={styles.wordContainer}>
            {showWord && isPlaying ? (
              <ThemedText 
                style={[
                  styles.flashingWord,
                  { fontSize: exercise.settings.fontSize || 32 }
                ]}
              >
                {currentWord}
              </ThemedText>
            ) : (
              <View style={styles.emptySpace} />
            )}
          </View>

          {/* Kontrol Butonları */}
          <View style={styles.controls}>
            {!isPlaying && !sessionCompleted && (
              <Pressable style={styles.startButton} onPress={startExercise}>
                <Text style={styles.buttonText}>
                  {currentWordIndex === 0 ? 'Başla' : 'Devam Et'}
                </Text>
              </Pressable>
            )}

            {isPlaying && (
              <>
                <Pressable style={styles.pauseButton} onPress={pauseExercise}>
                  <Text style={styles.buttonText}>Duraklat</Text>
                </Pressable>

                <Pressable style={styles.seenButton} onPress={handleWordSeen}>
                  <Text style={styles.buttonText}>Gördüm ✓</Text>
                </Pressable>
              </>
            )}
          </View>

          {/* İstatistikler */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Kelime</ThemedText>
              <ThemedText style={styles.statValue}>
                {currentWordIndex + 1}/{totalWords}
              </ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Skor</ThemedText>
              <ThemedText style={styles.statValue}>{score}</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Doğru</ThemedText>
              <ThemedText style={styles.statValue}>{correctAnswers}</ThemedText>
            </View>
          </View>

          {/* Talimatlar */}
          {!isPlaying && (
            <View style={styles.instructions}>
              <ThemedText style={styles.instructionText}>
                💡 Ekranda beliren kelimeleri odaklanarak takip edin
              </ThemedText>
              <ThemedText style={styles.instructionText}>
                ⚡ Kelimeyi gördüğünüzde "Gördüm" butonuna basın
              </ThemedText>
              <ThemedText style={styles.instructionText}>
                🎯 Hızlı kelime tanıma becerilerinizi geliştirin
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </ExerciseWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  exerciseArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  flashingWord: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 200,
  },
  emptySpace: {
    height: 60,
  },
  controls: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  pauseButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  seenButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stats: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  statValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructions: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 12,
    gap: 8,
  },
  instructionText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    textAlign: 'center',
  },
});