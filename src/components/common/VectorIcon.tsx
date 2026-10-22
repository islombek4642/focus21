import React from 'react';
import { Feather } from '@expo/vector-icons';
import { THEME } from '../../constants/theme.ts';

export interface VectorIconProps {
  name: string;
  size?: number;
  color?: string;
}

export const VectorIcon: React.FC<VectorIconProps> = ({
  name,
  size = 20,
  color = THEME.colors.textSecondary,
}) => {
  return <Feather name={name as any} size={size} color={color} />;
};
