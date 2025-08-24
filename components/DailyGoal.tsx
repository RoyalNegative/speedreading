import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useProgressionStore } from '@/stores/useProgressionStore';

export function DailyGoal() {
  const hydrate = useProgressionStore((s) => s.hydrate);
  const isDone = useProgressionStore((s) => s.isDailyGoalDoneToday());

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <View style={styles.row}>
      <ThemedText>Günlük hedef: 1 puan</ThemedText>
      <ThemedText>{isDone ? 'Tamamlandı ✅' : 'Bekliyor ⏳'}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
});


