import { DailyGoal } from '@/components/DailyGoal';
import { GamificationSummary } from '@/components/GamificationSummary';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSpeedReadingStore } from '@/stores/useSpeedReadingStore';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const { 
    currentUser, 
    currentLevel, 
    calculateProgress, 
    isOnboardingCompleted,
    exerciseResults 
  } = useSpeedReadingStore();

  useEffect(() => {
    if (!isOnboardingCompleted || !currentUser) {
      router.replace('/(auth)/onboarding');
    }
  }, [isOnboardingCompleted, currentUser]);

  if (!currentUser) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Yükleniyor...</ThemedText>
      </ThemedView>
    );
  }

  const progress = calculateProgress();
  const ageGroupInfo = getAgeGroupDisplayInfo(currentUser.ageGroup);
  const recentResults = exerciseResults.slice(-5).reverse();
  const totalExercises = exerciseResults.length;
  const passedExercises = exerciseResults.filter(r => r.passed).length;
  const successRate = totalExercises > 0 ? Math.round((passedExercises / totalExercises) * 100) : 0;

  return (
    <LinearGradient colors={["#6366f1", "#8b5cf6"]} style={StyleSheet.absoluteFill}>
      <ThemedView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.headerTitle}>
              Hoş geldiniz!
            </ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              {ageGroupInfo.title} • Seviye {currentLevel}
            </ThemedText>
          </View>

          {/* Progress Card */}
          <View style={styles.card}>
            <ThemedText type="subtitle" style={styles.cardTitle}>
              📊 İlerleme Durumunuz
            </ThemedText>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <ThemedText style={styles.progressText}>
                {Math.round(progress)}% Tamamlandı
              </ThemedText>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>{currentUser.completedLevels.length}</ThemedText>
                <ThemedText style={styles.statLabel}>Tamamlanan Seviye</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>{totalExercises}</ThemedText>
                <ThemedText style={styles.statLabel}>Toplam Egzersiz</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>{successRate}%</ThemedText>
                <ThemedText style={styles.statLabel}>Başarı Oranı</ThemedText>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.card}>
            <ThemedText type="subtitle" style={styles.cardTitle}>
              🚀 Hızlı İşlemler
            </ThemedText>
            <View style={styles.quickActions}>
              <Pressable
                style={styles.actionButton}
                onPress={() => router.push('/(tabs)/train')}
              >
                <Text style={styles.actionButtonIcon}>⚡</Text>
                <Text style={styles.actionButtonText}>Eğitime Başla</Text>
              </Pressable>
              
              <Pressable
                style={[styles.actionButton, styles.actionButtonSecondary]}
                onPress={() => router.push('/(tabs)/explore')}
              >
                <Text style={styles.actionButtonIcon}>📈</Text>
                <Text style={styles.actionButtonText}>İstatistikler</Text>
              </Pressable>
            </View>
          </View>

          {/* Recent Activity */}
          {recentResults.length > 0 && (
            <View style={styles.card}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                📋 Son Aktiviteler
              </ThemedText>
              {recentResults.map((result, index) => (
                <View key={`${result.exerciseId}-${index}`} style={styles.activityItem}>
                  <View style={styles.activityInfo}>
                    <ThemedText style={styles.activityTitle}>
                      Seviye {result.level} Egzersizi
                    </ThemedText>
                    <ThemedText style={styles.activityDetails}>
                      {result.wpm ? `${result.wpm} WPM` : ''} • {result.score} puan
                    </ThemedText>
                  </View>
                  <View style={[
                    styles.activityStatus,
                    result.passed ? styles.activityPassed : styles.activityFailed
                  ]}>
                    <Text style={styles.activityStatusText}>
                      {result.passed ? '✓' : '✗'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Age Group Info */}
          <View style={styles.card}>
            <ThemedText type="subtitle" style={styles.cardTitle}>
              🎯 Yaş Grup Bilgileri
            </ThemedText>
            <ThemedText style={styles.ageGroupText}>
              {ageGroupInfo.description}
            </ThemedText>
            <View style={styles.ageGroupStats}>
              <View style={styles.ageGroupStat}>
                <ThemedText style={styles.ageGroupStatLabel}>Hedef WPM:</ThemedText>
                <ThemedText style={styles.ageGroupStatValue}>{ageGroupInfo.targetWPM}</ThemedText>
              </View>
              <View style={styles.ageGroupStat}>
                <ThemedText style={styles.ageGroupStatLabel}>Zorluk:</ThemedText>
                <ThemedText style={styles.ageGroupStatValue}>{ageGroupInfo.difficulty}</ThemedText>
              </View>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </ThemedView>
    </LinearGradient>
  );
}

const getAgeGroupDisplayInfo = (ageGroup: 'child' | 'teen' | 'adult') => {
  const info = {
    child: { 
      title: 'Çocuk Grubu', 
      icon: '🧒',
      description: 'Eğlenceli ve renkli egzersizlerle hızlı okuma becerilerinizi geliştirin!',
      targetWPM: '50-150',
      difficulty: 'Başlangıç'
    },
    teen: { 
      title: 'Genç Grubu', 
      icon: '👦',
      description: 'Okul başarınızı artıracak hızlı okuma tekniklerini öğrenin!',
      targetWPM: '100-300',
      difficulty: 'Orta'
    },
    adult: { 
      title: 'Yetişkin Grubu', 
      icon: '👨',
      description: 'Profesyonel hayatınızda avantaj sağlayacak ileri teknikleri öğrenin!',
      targetWPM: '120-500',
      difficulty: 'İleri'
    }
  };
  return info[ageGroup];
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
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
  },
  cardTitle: {
    color: 'white',
    marginBottom: 16,
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
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
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionButtonSecondary: {
    backgroundColor: '#3b82f6',
  },
  actionButtonIcon: {
    fontSize: 24,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    color: 'white',
    fontWeight: '600',
    marginBottom: 2,
  },
  activityDetails: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  activityStatus: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityPassed: {
    backgroundColor: '#22c55e',
  },
  activityFailed: {
    backgroundColor: '#ef4444',
  },
  activityStatusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  ageGroupText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  ageGroupStats: {
    flexDirection: 'row',
    gap: 20,
  },
  ageGroupStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ageGroupStatLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  ageGroupStatValue: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
