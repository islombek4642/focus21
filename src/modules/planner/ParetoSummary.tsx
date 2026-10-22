import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { THEME } from '../../constants/theme.ts';
import { t } from '../../services/i18n.ts';
import { VectorIcon } from '../../components/common/VectorIcon.tsx';

export interface ParetoSummaryProps {
  totalTasks: number;
  paretoCount: number;
  paretoCompletedCount: number;
}

export const ParetoSummary: React.FC<ParetoSummaryProps> = ({
  totalTasks,
  paretoCount,
  paretoCompletedCount,
}) => {
  if (totalTasks === 0) return null;

  const completionPercent =
    paretoCount > 0 ? Math.round((paretoCompletedCount / paretoCount) * 100) : 0;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.tagGroup}>
          <VectorIcon name="pie-chart" size={14} color={THEME.colors.accent} />
          <Text style={styles.title}>
            {t('planner.paretoBannerTitle', { defaultValue: 'PARETO 80/20 PRINCIPLE (#3)' })}
          </Text>
        </View>
        <Text style={styles.ratioText}>
          {paretoCompletedCount}/{paretoCount} {t('common.done', { defaultValue: 'DONE' })}
        </Text>
      </View>

      <Text style={styles.description}>
        {t('planner.paretoDescription', {
          count: paretoCount.toString(),
          total: totalTasks.toString(),
          defaultValue: `Focus on the top ${paretoCount} tasks producing 80% of your total payoff.`,
        })}
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressBarTrack}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${Math.min(100, Math.max(0, completionPercent))}%` },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#181A22',
    borderRadius: THEME.radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.25)',
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...THEME.typography.label,
    color: THEME.colors.accent,
    fontSize: 10,
    marginLeft: 6,
  },
  ratioText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.success,
  },
  description: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginVertical: 4,
    lineHeight: 16,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: '#121418',
    borderRadius: THEME.radii.full,
    overflow: 'hidden',
    marginTop: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: THEME.radii.full,
  },
});
