import { ThemedText } from '@/components/ThemedText';
import { auth } from '@/lib/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function SignInScreen() {
  const router = useRouter();

  async function signInWithGoogleWeb() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.replace('/(tabs)');
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={["#4facfe", "#00f2fe"]} style={StyleSheet.absoluteFill} />
      <View style={styles.center}>
        <ThemedText type="title">Giriş Yap</ThemedText>
        <ThemedText>Google ile devam edebilir, iOS/Android’de Apple/Game Center ekleyebiliriz.</ThemedText>
      </View>
      <View style={styles.actions}>
        <Pressable onPress={signInWithGoogleWeb} style={[styles.cta, { backgroundColor: '#DB4437' }]}>
          <Image source={{ uri: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg' }} style={{ width: 18, height: 18, marginRight: 8 }} />
          <Text style={styles.ctaText}>Google ile Giriş Yap</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 8 },
  actions: { padding: 24, gap: 12 },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16 },
  ctaText: { color: 'white', fontWeight: '700', fontSize: 16 },
});


