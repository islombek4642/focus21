import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme.ts';
import { VectorIcon } from './VectorIcon.tsx';
import { useSettingsStore } from '../../store/settingsStore.ts';

export interface ExecutiveHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  title,
  subtitle,
  badge,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.titleArea}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.actionsArea}>
        {badge}
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => useSettingsStore.getState().setSettingsOpen(true)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <VectorIcon name="settings" size={17} color={THEME.colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: THEME.spacing.sm,
    marginBottom: THEME.spacing.xs,
  },
  titleArea: {
    flex: 1,
    marginRight: THEME.spacing.sm,
  },
  title: {
    ...THEME.typography.headingLg,
    fontSize: 20,
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  actionsArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: THEME.radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
