import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { THEME } from '../../constants/theme.ts';
import { VectorIcon } from './VectorIcon.tsx';

export interface BadgeProps {
  label: string;
  variant?: 'pareto' | 'priority' | 'success' | 'warning' | 'danger' | 'neutral';
  icon?: string;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  icon,
  size = 'md',
  style,
  textStyle,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'pareto':
        return {
          bg: THEME.colors.accentMuted,
          border: THEME.colors.accent,
          text: THEME.colors.accent,
        };
      case 'priority':
        return {
          bg: THEME.colors.priorityC,
          border: THEME.colors.info,
          text: THEME.colors.badgeBlue,
        };
      case 'success':
        return {
          bg: THEME.colors.successTint,
          border: THEME.colors.success,
          text: THEME.colors.success,
        };
      case 'warning':
        return {
          bg: THEME.colors.priorityB,
          border: THEME.colors.warning,
          text: THEME.colors.warningText,
        };
      case 'danger':
        return {
          bg: THEME.colors.priorityA,
          border: THEME.colors.danger,
          text: THEME.colors.danger,
        };
      case 'neutral':
      default:
        return {
          bg: THEME.colors.cardElevated,
          border: THEME.colors.border,
          text: THEME.colors.textSecondary,
        };
    }
  };

  const colors = getColors();
  const iconSize = size === 'sm' ? 10 : 12;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
        styles[`size_${size}`],
        style,
      ]}
    >
      {icon && (
        <View style={styles.iconContainer}>
          <VectorIcon name={icon} size={iconSize} color={colors.text} />
        </View>
      )}
      <Text
        style={[
          styles.text,
          { color: colors.text },
          styles[`textSize_${size}`],
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: THEME.radii.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 4,
  },
  size_sm: {
    paddingVertical: 2,
    paddingHorizontal: THEME.spacing.xs,
  },
  size_md: {
    paddingVertical: 4,
    paddingHorizontal: THEME.spacing.sm,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  textSize_sm: {
    fontSize: 10,
  },
  textSize_md: {
    fontSize: 12,
  },
});
