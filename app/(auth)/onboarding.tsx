import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function OnboardingScreen() {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={["#22c1c3", "#fdbb2d"]} style={StyleSheet.absoluteFill} />
      <View style={styles.center}>
        <Image source={require('@/assets/images/icon.png')} style={{ width: 96, height: 96, marginBottom: 12 }} />
        <ThemedText type="title">SpeedReading</ThemedText>
        <ThemedText>Hızlı okuma becerini oyunlaştırılmış pratiklerle geliştir.</ThemedText>
      </View>
      <View style={styles.actions}>
        <Link href="/(auth)/signin" asChild>
          <Pressable style={styles.cta}><Text style={styles.ctaText}>Başlayalım</Text></Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 8 },
  actions: { padding: 24 },
  cta: { backgroundColor: '#111827', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  ctaText: { color: 'white', fontWeight: '700', fontSize: 18 },
});


