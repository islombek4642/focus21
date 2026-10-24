import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme.ts';
import { useTranslation } from '../../services/i18n.ts';
import { VectorIcon } from '../../components/common/VectorIcon.tsx';
import { TimeLogEntry, TimeLogCategory } from '../../store/auditStore.ts';

export interface TimeLogListProps {
  logs: TimeLogEntry[];
  onAddLog: (activity: string, durationMinutes: number, category: TimeLogCategory) => void;
  onDeleteLog: (id: string) => void;
}

export const TimeLogList: React.FC<TimeLogListProps> = ({ logs, onAddLog, onDeleteLog }) => {
  const { t } = useTranslation();
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [category, setCategory] = useState<TimeLogCategory>('focus');

  const handleAdd = () => {
    if (activity.trim()) {
      onAddLog(activity.trim(), duration, category);
      setActivity('');
    }
  };

  const totalMinutes = logs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const durationOptions = [15, 30, 60, 90];
  const categoryOptions: { key: TimeLogCategory; labelKey: string; defaultLabel: string; icon: string }[] = [
    { key: 'focus', labelKey: 'audit.catFocus', defaultLabel: 'Focus', icon: 'zap' },
    { key: 'meeting', labelKey: 'audit.catMeeting', defaultLabel: 'Meeting', icon: 'users' },
    { key: 'admin', labelKey: 'audit.catAdmin', defaultLabel: 'Admin', icon: 'mail' },
    { key: 'rest', labelKey: 'audit.catRest', defaultLabel: 'Rest', icon: 'coffee' },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <VectorIcon name="clock" size={16} color={THEME.colors.accent} />
          <View style={styles.titles}>
            <Text style={styles.title} numberOfLines={1}>
              {t('audit.timeLogTitle', { defaultValue: 'Minute-by-Minute Time Log' })}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {t('audit.timeLogSubtitle', { defaultValue: 'Principle #7: Track Your Time' })}
            </Text>
          </View>
        </View>
        <View style={styles.totalBadge}>
          <VectorIcon name="check-circle" size={11} color={THEME.colors.accent} />
          <Text style={styles.totalText}>
            {totalHours}h {t('audit.loggedBadge', { defaultValue: 'logged' })}
          </Text>
        </View>
      </View>

      {/* Quick Add Form */}
      <View style={styles.addSection}>
        <TextInput
          style={styles.textInput}
          placeholder={t('audit.activityPlaceholder', { defaultValue: 'What did you just work on?' })}
          placeholderTextColor={THEME.colors.textTertiary}
          value={activity}
          onChangeText={setActivity}
        />

        {/* Duration Segmented Row */}
        <View style={styles.segmentGroup}>
          <Text style={styles.fieldLabel}>
            {t('audit.durationLabel', { defaultValue: 'Duration' })}
          </Text>
          <View style={styles.segmentRow}>
            {durationOptions.map((d) => {
              const isSelected = duration === d;
              return (
                <TouchableOpacity
                  key={d}
                  style={[styles.segmentBtn, isSelected && styles.segmentBtnActive]}
                  onPress={() => setDuration(d)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.segmentBtnText, isSelected && styles.segmentBtnTextActive]}>
                    {d} {t('audit.minutesShort', { defaultValue: 'min' })}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Category Segmented Row */}
        <View style={styles.segmentGroup}>
          <Text style={styles.fieldLabel}>
            {t('audit.categoryLabel', { defaultValue: 'Category' })}
          </Text>
          <View style={styles.segmentRow}>
            {categoryOptions.map((c) => {
              const isSelected = category === c.key;
              return (
                <TouchableOpacity
                  key={c.key}
                  style={[styles.catSegmentBtn, isSelected && styles.catSegmentBtnActive]}
                  onPress={() => setCategory(c.key)}
                  activeOpacity={0.7}
                >
                  <VectorIcon
                    name={c.icon}
                    size={11}
                    color={isSelected ? THEME.colors.accent : THEME.colors.textSecondary}
                  />
                  <Text
                    style={[styles.catSegmentText, isSelected && styles.catSegmentTextActive]}
                    numberOfLines={1}
                  >
                    {t(c.labelKey, { defaultValue: c.defaultLabel })}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleAdd} activeOpacity={0.8}>
          <VectorIcon name="plus" size={14} color="#000000" />
          <Text style={styles.submitBtnText}>
            {t('audit.addEntry', { defaultValue: 'Log Activity' })}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lombardi Time Banner (Principle #18) */}
      <View style={styles.lombardiBanner}>
        <VectorIcon name="bell" size={12} color={THEME.colors.accent} />
        <Text style={styles.lombardiText}>
          {t('audit.lombardiNotice', {
            defaultValue: 'Lombardi Time (Principle #18): 15 minutes early is on time. Plan buffer.',
          })}
        </Text>
      </View>

      {/* Logs List */}
      <View style={styles.list}>
        {logs.length === 0 ? (
          <Text style={styles.emptyText}>
            {t('audit.emptyLog', { defaultValue: 'No activities logged today. Audit your day minute by minute.' })}
          </Text>
        ) : (
          logs.slice(0, 5).map((log) => (
            <View key={log.id} style={styles.logItem}>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{log.durationMinutes}m</Text>
              </View>
              <Text style={styles.logActivity}>{log.activity}</Text>
              <View style={styles.catTag}>
                <Text style={styles.catTagText}>{log.category}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => onDeleteLog(log.id)}
                activeOpacity={0.7}
              >
                <VectorIcon name="trash-2" size={12} color={THEME.colors.textTertiary} />
              </TouchableOpacity>
            </View>
          ))
        )}
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
    marginBottom: THEME.spacing.sm,
    gap: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    marginRight: 6,
  },
  titles: {
    marginLeft: 8,
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 1,
  },
  totalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.cardElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radii.full,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    flexShrink: 0,
  },
  totalText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.accent,
  },
  addSection: {
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.radii.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: 10,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 12,
    height: 40,
    color: THEME.colors.textPrimary,
    fontSize: 13,
    marginBottom: 8,
  },
  segmentGroup: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 6,
  },
  segmentBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    backgroundColor: THEME.colors.priorityD,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  segmentBtnActive: {
    backgroundColor: 'rgba(229, 169, 60, 0.15)',
    borderColor: THEME.colors.accent,
  },
  segmentBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  segmentBtnTextActive: {
    color: THEME.colors.accent,
    fontWeight: '700',
  },
  catSegmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 4,
    backgroundColor: THEME.colors.priorityD,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  catSegmentBtnActive: {
    backgroundColor: 'rgba(229, 169, 60, 0.15)',
    borderColor: THEME.colors.accent,
  },
  catSegmentText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  catSegmentTextActive: {
    color: THEME.colors.accent,
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: THEME.colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: THEME.radii.sm,
    gap: 6,
    marginTop: 2,
  },
  submitBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.canvas,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  lombardiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.radii.sm,
    padding: 6,
    marginBottom: 8,
  },
  lombardiText: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  list: {
    marginTop: 2,
  },
  emptyText: {
    fontSize: 12,
    color: THEME.colors.textTertiary,
    fontStyle: 'italic',
    paddingVertical: 4,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  durationBadge: {
    backgroundColor: THEME.colors.priorityC,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: THEME.radii.sm,
    marginRight: 8,
  },
  durationText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.badgeBlue,
  },
  logActivity: {
    flex: 1,
    fontSize: 12,
    color: THEME.colors.textPrimary,
  },
  catTag: {
    backgroundColor: THEME.colors.card,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: THEME.radii.sm,
    marginRight: 6,
  },
  catTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.colors.textTertiary,
    textTransform: 'uppercase',
  },
  deleteBtn: {
    padding: 4,
  },
});
