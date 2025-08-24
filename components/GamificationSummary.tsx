import { ThemedText } from '@/components/ThemedText';
import { useGamificationStore } from '@/stores/useGamificationStore';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

export function GamificationSummary() {
  const xp = useGamificationStore((s) => s.xp);
  const streak = useGamificationStore((s) => s.streak);
  const hydrate = useGamificationStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <View style={styles.row}>
      <ThemedText>XP: {xp}</ThemedText>
      <ThemedText>Streak: {streak}🔥</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 16, alignItems: 'center' },
});


