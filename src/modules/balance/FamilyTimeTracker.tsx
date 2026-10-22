import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme.ts';
import { useTranslation } from '../../services/i18n.ts';
import { VectorIcon } from '../../components/common/VectorIcon.tsx';

export interface FamilyTimeTrackerProps {
  minutesToday: number;
  onAddMinutes: (minutes: number) => void;
}

export const FamilyTimeTracker: React.FC<FamilyTimeTrackerProps> = ({
  minutesToday,
  onAddMinutes,
}) => {
  const { t } = useTranslation();
  const targetMinutes = 90; // 90 min daily family block
  const percent = Math.min(100, Math.round((minutesToday / targetMinutes) * 100));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <VectorIcon name="heart" size={16} color="#F43F5E" />
          <View style={styles.titles}>
            <Text style={styles.title}>
              {t('balance.familyTitle', { defaultValue: 'Undivided Attention (Principle #20)' })}
            </Text>
            <Text style={styles.subtitle}>
              {t('balance.familySubtitle', {
                defaultValue: '100% distraction-free presence with family and loved ones',
              })}
            </Text>
          </View>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeValue}>{minutesToday}m</Text>
        </View>
      </View>

      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
      </View>

      <Text style={styles.progressLabel}>
        {minutesToday >= targetMinutes
          ? t('balance.familyTargetAchieved', { defaultValue: 'Daily target achieved! Deep connection preserved.' })
          : t('balance.familyTargetPending', {
              remaining: (targetMinutes - minutesToday).toString(),
              defaultValue: `${targetMinutes - minutesToday}m remaining to reach the 90-min daily target.`,
            })}
      </Text>

      {/* Quick Add Buttons */}
      <View style={styles.buttonsRow}>
        {[15, 30, 45, 60].map((mins) => (
          <TouchableOpacity
            key={mins}
            style={styles.addBtn}
            onPress={() => onAddMinutes(mins)}
            activeOpacity={0.7}
          >
            <VectorIcon name="plus" size={12} color={THEME.colors.accent} />
            <Text style={styles.addBtnText}>+{mins}m</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titles: {
    marginLeft: 8,
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 1,
  },
  badge: {
    backgroundColor: '#2A1018',
    borderWidth: 1,
    borderColor: '#F43F5E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radii.full,
  },
  badgeValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F43F5E',
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: '#16181D',
    borderRadius: THEME.radii.full,
    overflow: 'hidden',
    marginTop: 6,
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F43F5E',
    borderRadius: THEME.radii.full,
  },
  progressLabel: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginBottom: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  addBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#181A22',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingVertical: 6,
    borderRadius: THEME.radii.sm,
  },
  addBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginLeft: 3,
  },
});
