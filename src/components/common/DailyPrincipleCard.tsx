import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../../constants/theme.ts';
import { useTranslation } from '../../services/i18n.ts';
import { VectorIcon } from './VectorIcon.tsx';
import { getDailyPrinciple } from '../../constants/principles.ts';

export const DailyPrincipleCard: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [expanded, setExpanded] = useState(false);
  const principle = getDailyPrinciple();

  const title = t(`principles.${principle.id}.title`, { defaultValue: 'Daily Principle' });
  const summary = t(`principles.${principle.id}.summary`, {
    defaultValue: 'Focus continuously on your single most impactful task.',
  });

  const tabKey = principle.tab.toLowerCase();
  const tabLabel = t(`tabs.${tabKey}`, { defaultValue: principle.tab });

  const handleOpenModule = () => {
    if (principle.tab === 'Focus') {
      // Already on focus screen
      setExpanded(false);
    } else {
      navigation.navigate(principle.tab);
    }
  };

  return (
    <View style={styles.card}>
      {/* Clickable Header Area */}
      <TouchableOpacity
        style={styles.headerPressable}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
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
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>
        </View>

        <View style={styles.toggleBtn}>
          <Text style={styles.toggleText}>
            {expanded
              ? t('focus.tapToCollapse', { defaultValue: 'Collapse' })
              : t('focus.tapToExpand', { defaultValue: 'Details' })}
          </Text>
          <VectorIcon
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={13}
            color={THEME.colors.accent}
          />
        </View>
      </TouchableOpacity>

      {/* Quote / Summary */}
      <Text style={styles.summary}>{summary}</Text>

      {/* Expanded Interactive Action Section */}
      {expanded && (
        <View style={styles.expandedSection}>
          <View style={styles.divider} />

          <View style={styles.moduleRow}>
            <View style={styles.moduleTag}>
              <VectorIcon name="layers" size={11} color={THEME.colors.accent} />
              <Text style={styles.moduleTagText}>{tabLabel}</Text>
            </View>
            <Text style={styles.moduleHelpText}>
              {t('common.tracyPrinciples', { defaultValue: 'Brian Tracy 21 Principles' })}
            </Text>
          </View>

          {principle.tab !== 'Focus' && (
            <TouchableOpacity
              style={styles.navigateBtn}
              onPress={handleOpenModule}
              activeOpacity={0.8}
            >
              <Text style={styles.navigateBtnText}>
                {t('focus.openModule', { tab: tabLabel, defaultValue: `Open ${tabLabel}` })}
              </Text>
              <VectorIcon name="arrow-right" size={14} color={THEME.colors.canvas} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.22)',
    padding: 14,
    marginTop: 8,
    marginBottom: 24,
  },
  headerPressable: {
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
    width: 34,
    height: 34,
    borderRadius: 17,
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
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(229, 169, 60, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radii.full,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.2)',
  },
  toggleText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.accent,
  },
  summary: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  expandedSection: {
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 10,
  },
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  moduleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: THEME.colors.cardElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  moduleTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.accent,
  },
  moduleHelpText: {
    fontSize: 10,
    color: THEME.colors.textTertiary,
  },
  navigateBtn: {
    backgroundColor: THEME.colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: THEME.radii.sm,
    gap: 6,
  },
  navigateBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.canvas,
    letterSpacing: 0.3,
  },
});
