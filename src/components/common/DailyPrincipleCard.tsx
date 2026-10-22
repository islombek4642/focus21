import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme.ts';
import { useTranslation } from '../../services/i18n.ts';
import { VectorIcon } from './VectorIcon.tsx';
import { getDailyPrinciple } from '../../constants/principles.ts';

export const DailyPrincipleCard: React.FC = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const principle = getDailyPrinciple();

  const title = t(`principles.${principle.id}.title`, { defaultValue: 'Daily Principle' });
  const summary = t(`principles.${principle.id}.summary`, {
    defaultValue: 'Focus continuously on your single most impactful task.',
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconCircle}>
            <VectorIcon name={principle.icon} size={15} color={THEME.colors.accent} />
          </View>
          <View style={styles.titles}>
            <View style={styles.badgeRow}>
              <View style={styles.dailyPill}>
                <Text style={styles.dailyPillText}>
                  {t('focus.dailyPrincipleTitle', { defaultValue: 'Daily Principle' })}
                </Text>
              </View>
              <Text style={styles.principleNum}>
                {t('focus.dailyPrincipleBadge', { number: principle.id, defaultValue: `#${principle.id}` })}
              </Text>
            </View>
            <Text style={styles.title} numberOfLines={expanded ? undefined : 1}>
              {title}
            </Text>
          </View>
        </View>

        <View style={styles.expandBtn}>
          <VectorIcon
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={THEME.colors.textTertiary}
          />
        </View>
      </View>

      <Text style={styles.summary} numberOfLines={expanded ? undefined : 2}>
        {summary}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#13161D',
    borderRadius: THEME.radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.2)',
    padding: 12,
    marginBottom: THEME.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(229, 169, 60, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.25)',
  },
  titles: {
    marginLeft: 10,
    flex: 1,
    minWidth: 0,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  dailyPill: {
    backgroundColor: 'rgba(229, 169, 60, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: THEME.radii.sm,
  },
  dailyPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  principleNum: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textTertiary,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  expandBtn: {
    padding: 4,
  },
  summary: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 17,
    fontStyle: 'italic',
  },
});
