import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import { useSpeedReadingStore } from '@/stores/useSpeedReadingStore';

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState('');
  const { completeOnboarding } = useSpeedReadingStore();

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      const ageNumber = parseInt(age);
      if (isNaN(ageNumber) || ageNumber < 6 || ageNumber > 100) {
        Alert.alert('Uyarı', 'Lütfen geçerli bir yaş giriniz (6-100 arası)');
        return;
      }
      completeOnboarding(ageNumber);
      router.replace('/(tabs)');
    }
  };

  const getAgeGroupInfo = () => {
    const ageNumber = parseInt(age);
    if (isNaN(ageNumber)) return null;
    
    if (ageNumber >= 6 && ageNumber <= 12) {
      return {
        group: 'Çocuk',
        description: 'Renkli ve eğlenceli egzersizlerle hızlı okuma maceranız başlıyor!',
        targetWPM: '50-150 kelime/dakika',
        exercises: 'Göz egzersizleri, kelime tanıma oyunları, hafıza güçlendirme'
      };
    } else if (ageNumber >= 13 && ageNumber <= 17) {
      return {
        group: 'Genç',
        description: 'Okul başarınızı artıracak hızlı okuma tekniklerini öğrenin!',
        targetWPM: '100-300 kelime/dakika',
        exercises: 'Çevre görüş genişletme, kelime grupları okuma, zamanlı testler'
      };
    } else if (ageNumber >= 18) {
      return {
        group: 'Yetişkin',
        description: 'Profesyonel hayatınızda size avantaj sağlayacak ileri teknikler!',
        targetWPM: '120-500 kelime/dakika',
        exercises: 'Anlayarak hızlı okuma, karmaşık metin analizi, smooth pursuit'
      };
    }
    return null;
  };

  const ageGroupInfo = getAgeGroupInfo();

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={["#22c1c3", "#fdbb2d"]} style={StyleSheet.absoluteFill} />
      
      {step === 1 && (
        <>
          <View style={styles.center}>
            <Image source={require('@/assets/images/icon.png')} style={{ width: 96, height: 96, marginBottom: 12 }} />
            <ThemedText type="title">SpeedReading</ThemedText>
            <ThemedText style={styles.subtitle}>
              Hızlı okuma becerini oyunlaştırılmış pratiklerle geliştir
            </ThemedText>
            <View style={styles.features}>
              <ThemedText style={styles.feature}>📚 100 aşamalı eğitim sistemi</ThemedText>
              <ThemedText style={styles.feature}>🎯 Yaşınıza özel zorluk seviyeleri</ThemedText>
              <ThemedText style={styles.feature}>🏆 Gamification ile motivasyon</ThemedText>
              <ThemedText style={styles.feature}>📊 Detaylı ilerleme takibi</ThemedText>
            </View>
          </View>
          <View style={styles.actions}>
            <Pressable style={styles.cta} onPress={handleNext}>
              <Text style={styles.ctaText}>Başlayalım</Text>
            </Pressable>
          </View>
        </>
      )}

      {step === 2 && (
        <>
          <View style={styles.center}>
            <ThemedText type="title" style={styles.stepTitle}>Yaşınızı Öğrenelim</ThemedText>
            <ThemedText style={styles.stepSubtitle}>
              Size en uygun egzersizleri ve zorluk seviyesini belirleyelim
            </ThemedText>
            
            <View style={styles.ageInput}>
              <ThemedText style={styles.ageLabel}>Yaşınız:</ThemedText>
              <TextInput
                style={styles.textInput}
                value={age}
                onChangeText={setAge}
                placeholder="Örn: 25"
                placeholderTextColor="#888"
                keyboardType="numeric"
                maxLength={3}
              />
            </View>

            {ageGroupInfo && (
              <View style={styles.ageGroupInfo}>
                <ThemedText style={styles.ageGroupTitle}>
                  {ageGroupInfo.group} Grubu
                </ThemedText>
                <ThemedText style={styles.ageGroupDesc}>
                  {ageGroupInfo.description}
                </ThemedText>
                <View style={styles.ageGroupDetails}>
                  <ThemedText style={styles.detailItem}>
                    🎯 Hedef: {ageGroupInfo.targetWPM}
                  </ThemedText>
                  <ThemedText style={styles.detailItem}>
                    💪 Egzersizler: {ageGroupInfo.exercises}
                  </ThemedText>
                </View>
              </View>
            )}
          </View>
          
          <View style={styles.actions}>
            <Pressable 
              style={[styles.cta, !ageGroupInfo && styles.ctaDisabled]} 
              onPress={handleNext}
              disabled={!ageGroupInfo}
            >
              <Text style={styles.ctaText}>Eğitime Başla</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 24, 
    gap: 8 
  },
  subtitle: {
    textAlign: 'center',
    marginHorizontal: 20,
    fontSize: 16,
    opacity: 0.9
  },
  features: {
    marginTop: 32,
    gap: 12,
    alignItems: 'flex-start'
  },
  feature: {
    fontSize: 16,
    fontWeight: '500'
  },
  stepTitle: {
    marginBottom: 8
  },
  stepSubtitle: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 32
  },
  ageInput: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 24
  },
  ageLabel: {
    fontSize: 18,
    fontWeight: '600'
  },
  textInput: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    width: 120,
    borderWidth: 2,
    borderColor: '#22c1c3'
  },
  ageGroupInfo: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 20,
    alignItems: 'center'
  },
  ageGroupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8
  },
  ageGroupDesc: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16
  },
  ageGroupDetails: {
    gap: 8,
    alignItems: 'flex-start'
  },
  detailItem: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500'
  },
  actions: { 
    padding: 24 
  },
  cta: { 
    backgroundColor: '#111827', 
    paddingVertical: 16, 
    borderRadius: 16, 
    alignItems: 'center' 
  },
  ctaDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6
  },
  ctaText: { 
    color: 'white', 
    fontWeight: '700', 
    fontSize: 18 
  },
});


