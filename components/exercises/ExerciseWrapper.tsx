import React, { ReactNode } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { LinearGradient } from 'expo-linear-gradient';

interface ExerciseWrapperProps {
  title: string;
  description: string;
  duration: number;
  targetWPM?: number;
  level: number;
  children: ReactNode;
  onComplete: () => void;
  onExit: () => void;
  isCompleted?: boolean;
  progress?: number;
}

export default function ExerciseWrapper({
  title,
  description,
  duration,
  targetWPM,
  level,
  children,
  onComplete,
  onExit,
  isCompleted = false,
  progress = 0
}: ExerciseWrapperProps) {
  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={StyleSheet.absoluteFill}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onExit} style={styles.exitButton}>
            <Text style={styles.exitText}>✕</Text>
          </Pressable>
          
          <View style={styles.headerInfo}>
            <ThemedText type="subtitle" style={styles.level}>
              Seviye {level}
            </ThemedText>
            <ThemedText type="title" style={styles.title}>
              {title}
            </ThemedText>
            <ThemedText style={styles.description}>
              {description}
            </ThemedText>
          </View>
          
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Süre</ThemedText>
              <ThemedText style={styles.statValue}>{duration}dk</ThemedText>
            </View>
            {targetWPM && (
              <View style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Hedef</ThemedText>
                <ThemedText style={styles.statValue}>{targetWPM} WPM</ThemedText>
              </View>
            )}
          </View>
        </View>

        {/* Progress Bar */}
        {progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <ThemedText style={styles.progressText}>{Math.round(progress)}%</ThemedText>
          </View>
        )}

        {/* Exercise Content */}
        <View style={styles.exerciseArea}>
          {children}
        </View>

        {/* Complete Button */}
        {isCompleted && (
          <View style={styles.completeContainer}>
            <Pressable style={styles.completeButton} onPress={onComplete}>
              <Text style={styles.completeText}>Tamamla</Text>
            </Pressable>
          </View>
        )}
      </ThemedView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  exitButton: {
    position: 'absolute',
    right: 20,
    top: 50,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  exitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  level: {
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  title: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontSize: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ade80',
    borderRadius: 4,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    minWidth: 40,
  },
  exerciseArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  completeContainer: {
    padding: 20,
  },
  completeButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});