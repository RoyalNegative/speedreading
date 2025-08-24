import { SpeedReadingExercise, ExerciseType } from '@/types/speedreading';

// Her yaş grubu için temel egzersiz şablonları
const createExerciseData = (): SpeedReadingExercise[] => {
  const exercises: SpeedReadingExercise[] = [];

  // Egzersiz tipleri ve rotasyon için
  const exerciseRotation: ExerciseType[] = [
    'flashing_words', 'eye_exercises', 'peripheral_vision', 
    'word_recognition', 'concentration', 'memory_building',
    'chunking', 'timed_reading', 'smooth_pursuit', 'comprehension_test'
  ];

  // Her seviye için egzersizler oluştur (1-100)
  for (let level = 1; level <= 100; level++) {
    // Her yaş grubu için ayrı egzersizler
    ['child', 'teen', 'adult'].forEach((ageGroup) => {
      const ageGroupConfig = getAgeGroupConfig(ageGroup as any);
      
      // Bu seviye için egzersiz tipini belirle (rotasyon)
      const exerciseTypeIndex = (level - 1) % exerciseRotation.length;
      const exerciseType = exerciseRotation[exerciseTypeIndex];
      
      // Yaş grubuna göre egzersiz tiplerini filtrele
      if (!ageGroupConfig.exerciseTypes.includes(exerciseType)) {
        return; // Bu yaş grubu için uygun değilse geç
      }

      const exercise = createExercise(level, exerciseType, ageGroup as any, ageGroupConfig);
      exercises.push(exercise);
    });
  }

  return exercises;
};

const getAgeGroupConfig = (ageGroup: 'child' | 'teen' | 'adult') => {
  const configs = {
    child: {
      baseWPM: 50,
      targetWPM: 150,
      difficultyMultiplier: 0.7,
      exerciseTypes: ['eye_exercises', 'word_recognition', 'flashing_words', 'concentration', 'memory_building']
    },
    teen: {
      baseWPM: 100,
      targetWPM: 300,
      difficultyMultiplier: 0.85,
      exerciseTypes: ['eye_exercises', 'peripheral_vision', 'word_recognition', 'flashing_words', 'chunking', 'timed_reading', 'concentration']
    },
    adult: {
      baseWPM: 120,
      targetWPM: 500,
      difficultyMultiplier: 1.0,
      exerciseTypes: ['eye_exercises', 'peripheral_vision', 'word_recognition', 'flashing_words', 'chunking', 'timed_reading', 'comprehension_test', 'smooth_pursuit']
    }
  };
  
  return configs[ageGroup];
};

const createExercise = (
  level: number, 
  type: ExerciseType, 
  ageGroup: 'child' | 'teen' | 'adult',
  config: any
): SpeedReadingExercise => {
  const baseTargetWPM = config.baseWPM + ((config.targetWPM - config.baseWPM) * (level / 100));
  const targetWPM = Math.round(baseTargetWPM * config.difficultyMultiplier);
  
  const exercise: SpeedReadingExercise = {
    id: `${type}_${level}_${ageGroup}`,
    level,
    type,
    ageGroup,
    difficulty: level <= 33 ? 'easy' : level <= 66 ? 'medium' : 'hard',
    title: getExerciseTitle(type, ageGroup),
    description: getExerciseDescription(type, ageGroup),
    estimatedDuration: getEstimatedDuration(type, level),
    targetWPM,
    settings: getExerciseSettings(type, level, ageGroup)
  };

  return exercise;
};

const getExerciseTitle = (type: ExerciseType, ageGroup: 'child' | 'teen' | 'adult'): string => {
  const titles = {
    flashing_words: {
      child: '⚡ Kelime Şimşeği',
      teen: '🚀 Hızlı Kelime Tanıma',
      adult: '💫 Flashing Words'
    },
    eye_exercises: {
      child: '👁️ Göz Jimnastiği',
      teen: '💪 Göz Egzersizleri',
      adult: '🎯 Eye Training'
    },
    peripheral_vision: {
      child: '🔍 Geniş Görüş',
      teen: '📖 Çevre Görüş Geliştirme',
      adult: '👀 Peripheral Vision'
    },
    word_recognition: {
      child: '🎮 Kelime Oyunu',
      teen: '⚡ Kelime Tanıma Hızı',
      adult: '🔤 Word Recognition'
    },
    concentration: {
      child: '🧠 Odaklanma Oyunu',
      teen: '🎯 Konsantrasyon',
      adult: '🧘 Focus Training'
    },
    memory_building: {
      child: '🐘 Hafıza Güçlendirme',
      teen: '💭 Bellek Geliştirme',
      adult: '🧠 Memory Enhancement'
    },
    chunking: {
      child: '📦 Kelime Grupları',
      teen: '📚 Chunking Tekniği',
      adult: '🔗 Text Chunking'
    },
    timed_reading: {
      child: '⏱️ Zamanlı Okuma',
      teen: '🏃 Hızlı Okuma Testi',
      adult: '⚡ Speed Reading Test'
    },
    smooth_pursuit: {
      child: '👀 Göz Takibi',
      teen: '🎯 Smooth Pursuit',
      adult: '👁️ Eye Tracking'
    },
    comprehension_test: {
      child: '📖 Anlayarak Okuma',
      teen: '🧠 Kavrama Testi',
      adult: '📚 Comprehension Test'
    }
  };

  return titles[type][ageGroup];
};

const getExerciseDescription = (type: ExerciseType, ageGroup: 'child' | 'teen' | 'adult'): string => {
  const descriptions = {
    flashing_words: {
      child: 'Ekranda beliren kelimeleri hızlıca tanıyın ve tepki verin',
      teen: 'Hızla gösterilen kelimeleri tanıyarak okuma hızınızı artırın',
      adult: 'Advanced word recognition training for speed reading'
    },
    eye_exercises: {
      child: 'Gözlerinizi güçlendiren eğlenceli egzersizler yapın',
      teen: 'Göz kaslarını güçlendiren egzersizlerle okuma hızınızı artırın',
      adult: 'Strengthen eye muscles for efficient reading movements'
    },
    peripheral_vision: {
      child: 'Daha geniş alanı görebilme becerinizi geliştirin',
      teen: 'Çevre görüş alanınızı genişleterek daha hızlı okuyun',
      adult: 'Expand peripheral vision for faster text processing'
    },
    word_recognition: {
      child: 'Kelimeleri daha hızlı tanımayı öğrenin',
      teen: 'Kelime tanıma hızınızı geliştirin',
      adult: 'Improve rapid word recognition skills'
    },
    concentration: {
      child: 'Dikkatinizi toplama becerilerinizi güçlendirin',
      teen: 'Konsantrasyon ve odaklanma becerilerinizi geliştirin',
      adult: 'Enhance focus and concentration for reading'
    },
    memory_building: {
      child: 'Okuduklarınızı hatırlama becerinizi geliştirin',
      teen: 'Bellek kapasitesi ve hatırlama becerilerini güçlendirin',
      adult: 'Build memory capacity for better retention'
    },
    chunking: {
      child: 'Kelime gruplarını birlikte okumayı öğrenin',
      teen: 'Kelime grupları halinde okuma tekniğini öğrenin',
      adult: 'Master text chunking for efficient reading'
    },
    timed_reading: {
      child: 'Belirli süre içinde okuma becerilerinizi test edin',
      teen: 'Zamanlı okuma testleri ile hızınızı ölçün',
      adult: 'Timed reading exercises for speed assessment'
    },
    smooth_pursuit: {
      child: 'Gözlerinizle düzgün takip hareketleri yapın',
      teen: 'Smooth pursuit göz hareketlerini geliştirin',
      adult: 'Perfect smooth eye pursuit movements'
    },
    comprehension_test: {
      child: 'Okuduğunuzu ne kadar anladığınızı test edin',
      teen: 'Anlama ve kavrama becerilerinizi test edin',
      adult: 'Test reading comprehension and retention'
    }
  };

  return descriptions[type][ageGroup];
};

const getEstimatedDuration = (type: ExerciseType, level: number): number => {
  const baseDurations = {
    flashing_words: 3,
    eye_exercises: 5,
    peripheral_vision: 4,
    word_recognition: 3,
    concentration: 6,
    memory_building: 4,
    chunking: 5,
    timed_reading: 10,
    smooth_pursuit: 4,
    comprehension_test: 8
  };

  // Seviye arttıkça süre de artar
  const durationMultiplier = 1 + (level / 200); // %50'ye kadar artabilir
  return Math.round(baseDurations[type] * durationMultiplier);
};

const getExerciseSettings = (type: ExerciseType, level: number, ageGroup: 'child' | 'teen' | 'adult') => {
  const baseSettings = {
    fontSize: ageGroup === 'child' ? 28 : ageGroup === 'teen' ? 24 : 20,
    backgroundColor: '#000000',
    textColor: '#ffffff'
  };

  switch (type) {
    case 'flashing_words':
      return {
        ...baseSettings,
        flashDuration: Math.max(200, 1500 - (level * 10)), // Seviye arttıkça daha hızlı
        pauseDuration: Math.max(100, 800 - (level * 5)),
        repetitions: Math.min(20, 10 + level), // Seviye arttıkça daha fazla kelime
        wordCount: Math.min(50, 15 + level),
        fontSize: baseSettings.fontSize + (ageGroup === 'child' ? 8 : 4)
      };
    
    case 'eye_exercises':
      return {
        ...baseSettings,
        speed: Math.max(100, 500 - (level * 3)),
        repetitions: Math.min(15, 5 + Math.floor(level / 5))
      };

    case 'peripheral_vision':
      return {
        ...baseSettings,
        speed: Math.max(150, 600 - (level * 4)),
        wordCount: Math.min(30, 10 + Math.floor(level / 3))
      };

    default:
      return {
        ...baseSettings,
        speed: Math.max(200, 1000 - (level * 8)),
        repetitions: Math.min(20, 8 + Math.floor(level / 5))
      };
  }
};

// Export edilecek egzersiz verileri
export const SPEED_READING_EXERCISES = createExerciseData();

// Helper fonksiyonlar
export const getExercisesForLevel = (level: number, ageGroup: 'child' | 'teen' | 'adult') => {
  return SPEED_READING_EXERCISES.filter(ex => ex.level === level && ex.ageGroup === ageGroup);
};

export const getExerciseById = (id: string) => {
  return SPEED_READING_EXERCISES.find(ex => ex.id === id);
};