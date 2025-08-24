import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, Pressable, Text } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LESSONS, useProgressionStore } from '@/stores/useProgressionStore';
import { useRouter } from 'expo-router';

export default function MapScreen() {
  const hydrate = useProgressionStore((s) => s.hydrate);
  const isUnlocked = useProgressionStore((s) => s.isLessonUnlocked);
  const isCompleted = useProgressionStore((s) => s.isLessonCompleted);
  const router = useRouter();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedText type="title">Yol Haritası</ThemedText>
        {LESSONS.map((lesson, idx) => {
          const unlocked = isUnlocked(lesson.id);
          const completed = isCompleted(lesson.id);
          const sideStyle = idx % 2 === 0 ? styles.left : styles.right;
          return (
            <View key={lesson.id} style={[styles.nodeRow, sideStyle]}>
              {/* Bağlantı çizgisi */}
              {idx > 0 && <View style={styles.connector} />}
              <Pressable
                disabled={!unlocked}
                onPress={() => router.push({ pathname: '/(tabs)/train', params: { lessonId: lesson.id } })}
                style={[styles.node, !unlocked && styles.nodeLocked, completed && styles.nodeCompleted]}
              >
                <Text style={styles.nodeText}>{idx + 1}</Text>
              </Pressable>
              <View style={{ marginTop: 8 }}>
                <ThemedText type="defaultSemiBold">{lesson.title}</ThemedText>
                <ThemedText>{lesson.wpm} wpm</ThemedText>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
}

const NODE_SIZE = 56;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 24,
  },
  nodeRow: {
    alignItems: 'center',
  },
  left: {
    alignSelf: 'flex-start',
  },
  right: {
    alignSelf: 'flex-end',
  },
  connector: {
    width: 2,
    height: 32,
    backgroundColor: '#d1d5db',
    alignSelf: 'center',
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  nodeLocked: {
    backgroundColor: '#9ca3af',
  },
  nodeCompleted: {
    backgroundColor: '#10b981',
  },
  nodeText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
});


