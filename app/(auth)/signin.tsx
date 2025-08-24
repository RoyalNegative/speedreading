import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text, Alert, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSpeedReadingStore } from '@/stores/useSpeedReadingStore';
import { signInWithGoogleMobile } from '@/lib/googleAuth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function SignInScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { setFirebaseUser, isAuthenticated } = useSpeedReadingStore();

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
        router.replace('/(auth)/onboarding');
      }
    });

    return () => unsubscribe();
  }, [setFirebaseUser]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogleMobile();
      
      if (result.success && result.user) {
        // Firebase auth state change will handle the rest
        console.log('Google sign in successful');
      } else {
        Alert.alert('Giriş Başarısız', result.error || 'Google ile giriş yapılamadı');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      Alert.alert('Hata', 'Giriş yapılırken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousSignIn = () => {
    // Directly go to onboarding for anonymous users
    router.push('/(auth)/onboarding');
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={StyleSheet.absoluteFill}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.logo} 
          />
          <ThemedText type="title" style={styles.title}>
            SpeedReading
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Hızlı okuma becerilerinizi geliştirin
          </ThemedText>
        </View>

        {/* Sign In Options */}
        <View style={styles.signInOptions}>
          <ThemedText type="subtitle" style={styles.optionsTitle}>
            Başlamak için giriş yapın
          </ThemedText>

          {/* Google Sign In */}
          <Pressable
            style={[styles.signInButton, styles.googleButton]}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.googleIcon}>🔍</Text>
              <Text style={styles.googleButtonText}>
                {isLoading ? 'Giriş yapılıyor...' : 'Google ile Giriş Yap'}
              </Text>
            </View>
          </Pressable>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <ThemedText style={styles.dividerText}>veya</ThemedText>
            <View style={styles.dividerLine} />
          </View>

          {/* Anonymous Sign In */}
          <Pressable
            style={[styles.signInButton, styles.anonymousButton]}
            onPress={handleAnonymousSignIn}
            disabled={isLoading}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.anonymousIcon}>👤</Text>
              <Text style={styles.anonymousButtonText}>
                Hesap Oluşturmadan Devam Et
              </Text>
            </View>
          </Pressable>

          {/* Features */}
          <View style={styles.features}>
            <ThemedText style={styles.featureText}>
              ✨ 100 seviye hızlı okuma eğitimi
            </ThemedText>
            <ThemedText style={styles.featureText}>
              🎯 Yaşınıza özel zorlu egzersizler
            </ThemedText>
            <ThemedText style={styles.featureText}>
              📊 Detaylı ilerleme takibi
            </ThemedText>
            <ThemedText style={styles.featureText}>
              🏆 Başarı rozetleri ve motivasyon
            </ThemedText>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Giriş yaparak kullanım şartlarını kabul etmiş olursunuz
          </ThemedText>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
    borderRadius: 20,
  },
  title: {
    color: 'white',
    marginBottom: 8,
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    textAlign: 'center',
  },
  signInOptions: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  optionsTitle: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  signInButton: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleButton: {
    backgroundColor: 'white',
  },
  anonymousButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  googleIcon: {
    fontSize: 20,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  anonymousIcon: {
    fontSize: 20,
  },
  anonymousButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 15,
    fontSize: 14,
  },
  features: {
    marginTop: 20,
    gap: 8,
  },
  featureText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: 20,
  },
  footerText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});


