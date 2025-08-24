<<<<<<< Current (Your changes)
import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      <ThemedText>This app includes example code to help you get started.</ThemedText>
      <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
          different screen densities
        </ThemedText>
        <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Custom fonts">
        <ThemedText>
          Open <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText> to see how to load{' '}
          <ThemedText style={{ fontFamily: 'SpaceMono' }}>
            custom fonts such as this one.
          </ThemedText>
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText>{' '}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
=======
import React from 'react';
import { ScrollView, StyleSheet, View, Image, Pressable, Text, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSpeedReadingStore } from '@/stores/useSpeedReadingStore';
import { LinearGradient } from 'expo-linear-gradient';
import { signOutUser } from '@/lib/firebase';
import { router } from 'expo-router';

export default function ExploreScreen() {
  const { 
    currentUser, 
    exerciseResults, 
    calculateProgress,
    signOut
  } = useSpeedReadingStore();

  if (!currentUser) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Kullanıcı bilgisi yükleniyor...</ThemedText>
      </ThemedView>
    );
  }

  const handleSignOut = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOutUser();
              signOut();
              router.replace('/(auth)/signin');
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu');
            }
          }
        }
      ]
    );
  };

  const progress = calculateProgress();
  const totalExercises = exerciseResults.length;
  const passedExercises = exerciseResults.filter(r => r.passed).length;
  const successRate = totalExercises > 0 ? Math.round((passedExercises / totalExercises) * 100) : 0;
  
  // WPM Statistics
  const allWPMs = exerciseResults.filter(r => r.wpm).map(r => r.wpm!);
  const avgWPM = allWPMs.length > 0 ? Math.round(allWPMs.reduce((a, b) => a + b, 0) / allWPMs.length) : 0;
  const maxWPM = allWPMs.length > 0 ? Math.max(...allWPMs) : 0;

  // Recent achievements
  const recentAchievements = exerciseResults
    .filter(r => r.passed)
    .slice(-10)
    .reverse();

  const ageGroupInfo = getAgeGroupDisplayInfo(currentUser.ageGroup);

  return (
    <LinearGradient colors={["#f093fb", "#f5576c"]} style={StyleSheet.absoluteFill}>
      <ThemedView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.profileInfo}>
              {currentUser.photoURL ? (
                <Image source={{ uri: currentUser.photoURL }} style={styles.profilePhoto} />
              ) : (
                <View style={styles.defaultPhoto}>
                  <Text style={styles.defaultPhotoText}>
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : '👤'}
                  </Text>
                </View>
              )}
              <View style={styles.profileDetails}>
                <ThemedText type="title" style={styles.profileName}>
                  {currentUser.displayName || 'Kullanıcı'}
                </ThemedText>
                {currentUser.email && (
                  <ThemedText style={styles.profileEmail}>
                    {currentUser.email}
                  </ThemedText>
                )}
                <ThemedText style={styles.profileAgeGroup}>
                  {ageGroupInfo.title} • {currentUser.age} yaş
                </ThemedText>
              </View>
            </View>
            
            <Pressable style={styles.signOutButton} onPress={handleSignOut}>
              <Text style={styles.signOutText}>Çıkış</Text>
            </Pressable>
          </View>

          {/* Overall Progress */}
          <View style={styles.card}>
            <ThemedText type="subtitle" style={styles.cardTitle}>
              📊 Genel İlerleme
            </ThemedText>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <ThemedText style={styles.progressText}>
                {Math.round(progress)}% Tamamlandı
              </ThemedText>
            </View>
            <View style={styles.progressStats}>
              <Text style={styles.progressStatText}>
                Seviye {currentUser.currentLevel} / 100
              </Text>
              <Text style={styles.progressStatText}>
                {currentUser.completedLevels.length} seviye tamamlandı
              </Text>
            </View>
          </View>

          {/* Statistics */}
          <View style={styles.card}>
            <ThemedText type="subtitle" style={styles.cardTitle}>
              📈 İstatistikler
            </ThemedText>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{totalExercises}</Text>
                <Text style={styles.statLabel}>Toplam Egzersiz</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{passedExercises}</Text>
                <Text style={styles.statLabel}>Başarılı</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{successRate}%</Text>
                <Text style={styles.statLabel}>Başarı Oranı</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{avgWPM}</Text>
                <Text style={styles.statLabel}>Ortalama WPM</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{maxWPM}</Text>
                <Text style={styles.statLabel}>En Yüksek WPM</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{currentUser.ageGroup === 'child' ? '🧒' : currentUser.ageGroup === 'teen' ? '👦' : '👨'}</Text>
                <Text style={styles.statLabel}>{ageGroupInfo.title}</Text>
              </View>
            </View>
          </View>

          {/* Recent Achievements */}
          {recentAchievements.length > 0 && (
            <View style={styles.card}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                🏆 Son Başarılar
              </ThemedText>
              {recentAchievements.map((achievement, index) => (
                <View key={`${achievement.exerciseId}-${index}`} style={styles.achievementItem}>
                  <View style={styles.achievementIcon}>
                    <Text style={styles.achievementIconText}>🏆</Text>
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>
                      Seviye {achievement.level} Başarıyla Tamamlandı
                    </Text>
                    <Text style={styles.achievementDetails}>
                      {achievement.wpm ? `${achievement.wpm} WPM` : ''} • {achievement.score} puan • {achievement.accuracy}% doğruluk
                    </Text>
                  </View>
                  <Text style={styles.achievementDate}>
                    {new Date(achievement.completedAt).toLocaleDateString('tr-TR')}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Age Group Info */}
          <View style={styles.card}>
            <ThemedText type="subtitle" style={styles.cardTitle}>
              🎯 Yaş Grup Detayları
            </ThemedText>
            <View style={styles.ageGroupCard}>
              <Text style={styles.ageGroupIcon}>{ageGroupInfo.icon}</Text>
              <View style={styles.ageGroupInfo}>
                <Text style={styles.ageGroupTitle}>{ageGroupInfo.title}</Text>
                <Text style={styles.ageGroupDescription}>
                  {ageGroupInfo.description}
                </Text>
                <View style={styles.ageGroupStats}>
                  <Text style={styles.ageGroupStat}>
                    🎯 Hedef: {ageGroupInfo.targetWPM} WPM
                  </Text>
                  <Text style={styles.ageGroupStat}>
                    ⚡ Zorluk: {ageGroupInfo.difficulty}
                  </Text>
                </View>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'white',
  },
  defaultPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  defaultPhotoText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileDetails: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    color: 'white',
    fontSize: 20,
    marginBottom: 2,
  },
  profileEmail: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 2,
  },
  profileAgeGroup: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  signOutText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  progressStats: {
    marginTop: 12,
    gap: 4,
  },
  progressStatText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: 100,
  },
  statNumber: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    textAlign: 'center',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,215,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementIconText: {
    fontSize: 20,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    color: 'white',
    fontWeight: '600',
    marginBottom: 2,
  },
  achievementDetails: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  achievementDate: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
  },
  ageGroupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
  },
  ageGroupIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  ageGroupInfo: {
    flex: 1,
  },
  ageGroupTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ageGroupDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  ageGroupStats: {
    gap: 4,
  },
  ageGroupStat: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
  },
>>>>>>> Incoming (Background Agent changes)
});
