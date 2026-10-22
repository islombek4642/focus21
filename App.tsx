import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { THEME } from './src/constants/theme.ts';
import { RootNavigator } from './src/navigation/RootNavigator.tsx';
import { SettingsModal } from './src/components/SettingsModal.tsx';
import { useTranslation } from './src/services/i18n.ts';
import { useSettingsStore } from './src/store/settingsStore.ts';

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: THEME.colors.canvas,
    card: THEME.colors.canvas,
    border: THEME.colors.border,
    text: THEME.colors.textPrimary,
    primary: THEME.colors.accent,
  },
};

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(() => useSettingsStore.getState().isSettingsOpen);
  const { language } = useTranslation();

  useEffect(() => {
    const unsub = useSettingsStore.subscribe(() => {
      setSettingsOpen(useSettingsStore.getState().isSettingsOpen);
    });
    return () => {
      unsub();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar style="light" />

        <NavigationContainer theme={navTheme}>
          <RootNavigator key={language} />
        </NavigationContainer>

        <SettingsModal
          visible={settingsOpen}
          onClose={() => useSettingsStore.getState().setSettingsOpen(false)}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.canvas,
  },
});
