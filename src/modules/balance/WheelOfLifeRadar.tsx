import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme.ts';
import { useTranslation } from '../../services/i18n.ts';
import { VectorIcon } from '../../components/common/VectorIcon.tsx';
import { PillarScores } from '../../store/balanceStore.ts';

export interface WheelOfLifeRadarProps {
  scores: PillarScores;
  averageScore: number;
  onUpdateScore: (pillar: string, score: number) => void;
}

export const WheelOfLifeRadar: React.FC<WheelOfLifeRadarProps> = ({
  scores,
  averageScore,
  onUpdateScore,
}) => {
  const { t } = useTranslation();
  const pillars: { key: string; label: string; icon: string }[] = [
    { key: 'family', label: 'Family', icon: 'heart' },
    { key: 'career', label: 'Career', icon: 'briefcase' },
    { key: 'health', label: 'Health', icon: 'activity' },
    { key: 'finance', label: 'Finance', icon: 'dollar-sign' },
    { key: 'growth', label: 'Growth', icon: 'book' },
    { key: 'rest', label: 'Rest', icon: 'moon' },
  ];

  const handleAdjust = (pillar: string, delta: number) => {
    const current = scores[pillar] ?? 8;
    const next = Math.min(10, Math.max(1, current + delta));
    onUpdateScore(pillar, next);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <VectorIcon name="compass" size={16} color={THEME.colors.accent} />
          <View style={styles.titles}>
            <Text style={styles.title}>
              {t('balance.wheelTitle', { defaultValue: 'Wheel of Life (Principle #21)' })}
            </Text>
            <Text style={styles.subtitle}>
              {t('balance.wheelSubtitle', { defaultValue: 'Score your balance from 1 to 10 across 6 pillars' })}
            </Text>
          </View>
        </View>

        <View style={styles.scoreBadge}>
          <Text style={styles.scoreBadgeLabel}>INDEX</Text>
          <Text style={styles.scoreBadgeValue}>{averageScore}</Text>
        </View>
      </View>

      {/* 6 Pillars Grid */}
      <View style={styles.grid}>
        {pillars.map((p) => {
          const val = scores[p.key] ?? 8;
          return (
            <View key={p.key} style={styles.pillarCard}>
              <View style={styles.pillarTop}>
                <VectorIcon name={p.icon} size={14} color={THEME.colors.accent} />
                <Text style={styles.pillarLabel}>
                  {t(`balance.pillar_${p.key}`, { defaultValue: p.label })}
                </Text>
              </View>

              {/* Score Adjuster */}
              <View style={styles.adjusterRow}>
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => handleAdjust(p.key, -1)}
                  activeOpacity={0.7}
                >
                  <VectorIcon name="minus" size={12} color={THEME.colors.textSecondary} />
                </TouchableOpacity>

                <Text style={styles.scoreText}>{val}/10</Text>

                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => handleAdjust(p.key, 1)}
                  activeOpacity={0.7}
                >
                  <VectorIcon name="plus" size={12} color={THEME.colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Progress bar */}
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${val * 10}%` }]} />
              </View>
            </View>
          );
        })}
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
    marginBottom: THEME.spacing.md,
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
  scoreBadge: {
    backgroundColor: THEME.colors.accentMuted,
    borderWidth: 1,
    borderColor: THEME.colors.accent,
    borderRadius: THEME.radii.md,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  scoreBadgeLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: THEME.colors.accent,
  },
  scoreBadgeValue: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.accent,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pillarCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.radii.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: 10,
  },
  pillarTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  pillarLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginLeft: 6,
  },
  adjusterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  adjustBtn: {
    backgroundColor: THEME.colors.cardElevated,
    width: 24,
    height: 24,
    borderRadius: THEME.radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.accent,
  },
  barTrack: {
    height: 3,
    backgroundColor: THEME.colors.cardElevated,
    borderRadius: THEME.radii.full,
    overflow: 'hidden',
    marginTop: 4,
  },
  barFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: THEME.radii.full,
  },
});
