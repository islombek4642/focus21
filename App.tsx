import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { THEME } from './src/constants/theme.ts';
import { RootNavigator } from './src/navigation/RootNavigator.tsx';
import { SettingsModal } from './src/components/SettingsModal.tsx';
import { VectorIcon } from './src/components/common/VectorIcon.tsx';
import { useTranslation } from './src/services/i18n.ts';

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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { language } = useTranslation();

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />

      {/* Floating Settings Gear Trigger */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setSettingsOpen(true)}
          activeOpacity={0.7}
        >
          <VectorIcon name="settings" size={18} color={THEME.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <NavigationContainer theme={navTheme}>
        <RootNavigator key={language} />
      </NavigationContainer>

      <SettingsModal
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.colors.canvas,
  },
  topBar: {
    position: 'absolute',
    top: 40,
    right: 16,
    zIndex: 99,
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: THEME.radii.full,
    backgroundColor: 'rgba(22, 24, 29, 0.85)',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
