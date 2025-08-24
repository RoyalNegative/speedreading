# SpeedReading - Hızlı Okuma Uygulaması 📚⚡

Yaş gruplarına özel, 100 seviyeli, gamification destekli hızlı okuma eğitim uygulaması.

## 🚀 Özellikler

### 🎯 **Yaş Gruplarına Özel Eğitim**
- **Çocuk Grubu (6-12 yaş)**: 50-150 WPM hedefi, eğlenceli egzersizler
- **Genç Grubu (13-17 yaş)**: 100-300 WPM hedefi, okul odaklı teknikler  
- **Yetişkin Grubu (18+ yaş)**: 120-500 WPM hedefi, profesyonel içerik

### 📈 **100 Seviyeli Progression Sistemi**
- ✅ Bir seviyeyi bitirmeden diğerine geçilemez
- 🔒 Otomatik seviye kilitleme/açma sistemi
- 📊 Detaylı progress tracking

### 🎮 **10 Farklı Egzersiz Tipi**
1. **⚡ Flashing Words** - Kelime hızı egzersizleri
2. **👁️ Eye Exercises** - Göz kasları güçlendirme
3. **🔍 Peripheral Vision** - Çevre görüş geliştirme  
4. **🎮 Word Recognition** - Kelime tanıma hızı
5. **🧠 Concentration** - Odaklanma egzersizleri
6. **🐘 Memory Building** - Hafıza güçlendirme
7. **📦 Chunking** - Kelime grupları okuma
8. **⏱️ Timed Reading** - Zamanlı okuma testleri
9. **👀 Smooth Pursuit** - Göz takip hareketleri
10. **📖 Comprehension Test** - Anlayarak okuma

### 🔐 **Authentication Sistemi**
- 🌟 **Google ile Giriş** - Gmail hesabınızla hızlı giriş
- 👤 **Anonim Giriş** - Hesap oluşturmadan deneme
- 📱 **Cross-platform** - Mobil ve web destekli
- 🔄 **Progress Sync** - Verileriniz güvende

### 🏆 **Gamification**
- 🎯 Puan sistemi ve başarı oranları
- 🏅 Seviye tamamlama rozetleri
- 📈 İstatistik dashboard'u
- 🎊 Motivasyonel feedback

## 🛠️ Kurulum

### Gereksinimler
- Node.js 18+
- Expo CLI
- Firebase projesi (Authentication için)

### 1. Projeyi İndirin
```bash
git clone [repo-url]
cd speedreading
npm install
```

### 2. Firebase Kurulumu

#### Firebase Console'da Proje Oluşturun:
1. [Firebase Console](https://console.firebase.google.com)'a gidin
2. "Add project" ile yeni proje oluşturun
3. Authentication > Sign-in method > Google'ı etkinleştirin

#### Environment Variables Ayarlayın:
```bash
# .env.example dosyasını .env olarak kopyalayın
cp .env.example .env

# .env dosyasını düzenleyip Firebase credentials'larınızı ekleyin
```

#### .env Dosyası Örneği:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=speedreading-app.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=speedreading-app
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=speedreading-app.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef...
EXPO_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
```

### 3. Uygulamayı Başlatın
```bash
npx expo start
```

## 📱 Nasıl Çalışır

### 🔐 **Giriş**
1. **Google ile Giriş**: Gmail hesabınızla hızlı giriş
2. **Anonim Giriş**: Hesap oluşturmadan deneme yapın

### 📋 **Onboarding**
1. Yaşınızı girin (6-100 arası)
2. Otomatik yaş grubu ataması
3. Size özel hedefler ve egzersiz tiplerini görün

### 🎯 **Eğitim**
1. **Seviye Seçimi**: 1-100 arası seviyeler
2. **Egzersiz Yapma**: Her seviyede 3+ egzersiz
3. **İlerleme**: Başarılı egzersizlerle yeni seviyeleri açın

### 📊 **Takip**
- Ana sayfa: Genel istatistikler ve hızlı erişim
- Eğitim: Seviye haritası ve egzersiz seçimi
- Profil: Detaylı istatistikler ve başarılar

## 🛡️ Güvenlik ve Gizlilik

- 🔒 **Firebase Authentication** ile güvenli giriş
- 📱 **Local Data Storage** - veriler cihazınızda
- 🔐 **No Personal Data Collection** - sadece eğitim verileri
- 🌍 **GDPR Compliant** - veri koruma uyumlu

## 🎨 Teknik Detaylar

### Tech Stack:
- **React Native** + **Expo** - Cross-platform mobil geliştirme
- **TypeScript** - Type-safe kod
- **Zustand** - State management
- **Firebase Auth** - Authentication
- **Expo Router** - Navigation

### Architecture:
- 📁 **Component-based** - Modüler yapı
- 🔄 **State Management** - Zustand store'lar
- 🎯 **Type Safety** - Full TypeScript coverage
- 📱 **Responsive Design** - Tüm ekran boyutları

### Performance:
- ⚡ **60fps Animations** - Smooth UX
- 🚀 **Fast Loading** - Optimized bundles
- 💾 **Offline Capable** - Local data storage
- 📱 **Native Performance** - Expo optimizations

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 Destek

Herhangi bir sorun veya öneri için issue açabilirsiniz.

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

<<<<<<< Current (Your changes)
- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
=======
**SpeedReading** ile hızlı okuma becerilerinizi geliştirin! 🚀📚
>>>>>>> Incoming (Background Agent changes)
