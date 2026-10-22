import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer.tsx';
import { THEME } from '../../constants/theme.ts';
import { t } from '../../services/i18n.ts';

export const BalanceScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>{t('tabs.balance')}</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: THEME.spacing.md,
  },
  title: {
    fontSize: THEME.typography.headingLg.fontSize,
    fontWeight: THEME.typography.headingLg.fontWeight,
    color: THEME.typography.headingLg.color,
  },
});
