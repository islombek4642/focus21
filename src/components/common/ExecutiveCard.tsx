import React from 'react';
import { StyleSheet, View, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { THEME } from '../../constants/theme.ts';

export interface ExecutiveCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'default' | 'accent' | 'outlined' | 'subtle';
  activeOpacity?: number;
}

export const ExecutiveCard: React.FC<ExecutiveCardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  activeOpacity = 0.85,
}) => {
  const cardStyle = [
    styles.card,
    variant === 'accent' && styles.cardAccent,
    variant === 'outlined' && styles.cardOutlined,
    variant === 'subtle' && styles.cardSubtle,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={activeOpacity}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radii.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  cardAccent: {
    borderColor: THEME.colors.accent,
    borderWidth: 1.5,
  },
  cardOutlined: {
    backgroundColor: 'transparent',
    borderColor: THEME.colors.border,
  },
  cardSubtle: {
    backgroundColor: '#1C1F26',
    borderColor: 'transparent',
  },
});
