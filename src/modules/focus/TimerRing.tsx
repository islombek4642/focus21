import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { THEME } from '../../constants/theme.ts';
import { t } from '../../services/i18n.ts';
import { VectorIcon } from '../../components/common/VectorIcon.tsx';

export interface TimerRingProps {
  formattedTime: string;
  isRunning: boolean;
  completedChunks: number;
}

export const TimerRing: React.FC<TimerRingProps> = ({
  formattedTime,
  isRunning,
  completedChunks,
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.outerRing, isRunning && styles.outerRingRunning]}>
        <View style={styles.innerRing}>
          <View style={styles.headerRow}>
            <VectorIcon
              name="zap"
              size={12}
              color={isRunning ? THEME.colors.accent : THEME.colors.textSecondary}
            />
            <Text style={styles.labelText}>
              {t('focus.chunksLabel', { defaultValue: 'CHUNKS OF TIME (90 MIN)' })}
            </Text>
          </View>

          <Text style={styles.timerDisplay}>{formattedTime}</Text>

          <View style={styles.footerRow}>
            <Text style={[styles.statusText, isRunning && styles.statusRunning]}>
              {isRunning
                ? t('focus.runningStatus', { defaultValue: 'SINGLE HANDLING IN PROGRESS' })
                : t('focus.idleStatus', { defaultValue: 'READY FOR 90-MIN BLOCK' })}
            </Text>
            {completedChunks > 0 && (
              <View style={styles.completedBadge}>
                <VectorIcon name="check-circle" size={10} color={THEME.colors.success} />
                <Text style={styles.completedText}>{completedChunks}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const RING_SIZE = 260;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: THEME.spacing.lg,
  },
  outerRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 3,
    borderColor: 'rgba(229, 169, 60, 0.35)',
    backgroundColor: THEME.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  outerRingRunning: {
    borderColor: THEME.colors.accent,
  },
  innerRing: {
    width: RING_SIZE - 18,
    height: RING_SIZE - 18,
    borderRadius: (RING_SIZE - 18) / 2,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: '#111317',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.xs,
  },
  labelText: {
    ...THEME.typography.label,
    marginLeft: 6,
    color: THEME.colors.textSecondary,
    fontSize: 10,
  },
  timerDisplay: {
    ...THEME.typography.timerDisplay,
    marginVertical: THEME.spacing.xs,
    fontVariant: ['tabular-nums'],
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: THEME.spacing.xs,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: THEME.colors.textTertiary,
    textTransform: 'uppercase',
  },
  statusRunning: {
    color: THEME.colors.accent,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: THEME.colors.successTint,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radii.full,
  },
  completedText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.success,
    marginLeft: 3,
  },
});
