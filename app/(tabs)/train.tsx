import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useGamificationStore } from '@/stores/useGamificationStore';
import { LESSONS, useProgressionStore } from '@/stores/useProgressionStore';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const SAMPLE_TEXT = `Hızlı okuma, belirli tekniklerle görsel ve bilişsel süreçleri optimize ederek birim zamanda daha fazla kelime işlemeyi hedefler. Düzenli antrenman, göz hareketlerini verimli hale getirir.`;

export default function TrainScreen() {
  const params = useLocalSearchParams<{ lessonId?: string }>();
  const selectedLesson = useMemo(() => LESSONS.find((l) => l.id === params.lessonId), [params.lessonId]);
  const text = selectedLesson?.text ?? SAMPLE_TEXT;
  const initialWpm = selectedLesson?.wpm ?? 300;
  const words = useMemo(() => text.split(/\s+/), [text]);
  const [isRunning, setIsRunning] = useState(false);
  const [wpm, setWpm] = useState(initialWpm);
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const addXp = useGamificationStore((s) => s.addXp);
  const tickStudy = useGamificationStore((s) => s.tickStudy);
  const completeLesson = useProgressionStore((s) => s.completeLesson);

  const opacity = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  useEffect(() => {
    if (!isRunning) return;
    const msPerWord = Math.max(50, Math.round(60000 / wpm));
    intervalRef.current = setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1;
        if (next >= words.length) {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          intervalRef.current = null;
          setIsRunning(false);
          addXp(10);
          tickStudy();
          if (params.lessonId) {
            completeLesson(String(params.lessonId));
          }
          return prev;
        }
        return next;
      });
      opacity.value = 0;
      opacity.value = withTiming(1, { duration: 80, easing: Easing.out(Easing.quad) });
    }, msPerWord);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, wpm, words.length]);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 80 });
  }, [index]);

  const current = words[index] ?? '';

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Antrenman</ThemedText>
      {selectedLesson && (
        <ThemedText type="subtitle">{selectedLesson.title} • {wpm} wpm</ThemedText>
      )}
      <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.Text style={[styles.word, animatedStyle]}>{current}</Animated.Text>
      </View>

      <View style={styles.controls}>
        <Pressable
          onPress={() => {
            if (index >= words.length - 1) setIndex(0);
            setIsRunning((s) => !s);
          }}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}>
          <Text style={styles.buttonText}>{isRunning ? 'Durdur' : 'Başlat'}</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setIsRunning(false);
            setIndex(0);
          }}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}>
          <Text style={styles.buttonText}>Sıfırla</Text>
        </Pressable>
      </View>

      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <ThemedText>Hız: {wpm} wpm</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  word: { fontSize: 40, fontWeight: '700' },
  controls: { flexDirection: 'row', gap: 12 },
  button: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: { color: 'white', fontWeight: '600' },
});


