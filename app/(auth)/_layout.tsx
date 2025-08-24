import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="onboarding">
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="signin" />
    </Stack>
  );
}


