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
  const categoryOptions: { key: TimeLogCategory; label: string; icon: string }[] = [
    { key: 'focus', label: 'Focus', icon: 'zap' },
    { key: 'meeting', label: 'Meeting', icon: 'users' },
    { key: 'admin', label: 'Admin', icon: 'mail' },
    { key: 'rest', label: 'Rest', icon: 'coffee' },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <VectorIcon name="clock" size={16} color={THEME.colors.accent} />
          <View style={styles.titles}>
            <Text style={styles.title}>
              {t('audit.timeLogTitle', { defaultValue: 'Minute-by-Minute Time Log' })}
            </Text>
            <Text style={styles.subtitle}>
              {t('audit.timeLogSubtitle', { defaultValue: 'Principle #6: Track Your Time' })}
            </Text>
          </View>
        </View>
        <View style={styles.totalBadge}>
          <Text style={styles.totalText}>{totalHours}h logged</Text>
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

        {/* Row 1: Duration Selector */}
        <View style={styles.selectorRow}>
          <Text style={styles.selectorLabel}>Vaqt:</Text>
          <View style={styles.durationChips}>
            {durationOptions.map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.chip, duration === d && styles.chipActive]}
                onPress={() => setDuration(d)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, duration === d && styles.chipTextActive]}>
                  {d} daq
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Row 2: Category Selector + Add Button */}
        <View style={styles.categoryRow}>
          <View style={styles.categoryChips}>
            {categoryOptions.map((c) => (
              <TouchableOpacity
                key={c.key}
                style={[styles.catChip, category === c.key && styles.catChipActive]}
                onPress={() => setCategory(c.key)}
                activeOpacity={0.7}
              >
                <VectorIcon
                  name={c.icon}
                  size={11}
                  color={category === c.key ? THEME.colors.accent : THEME.colors.textSecondary}
                />
                <Text style={[styles.catChipText, category === c.key && styles.catChipTextActive]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.8}>
            <VectorIcon name="plus" size={16} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lombardi Time Banner (Principle #15) */}
      <View style={styles.lombardiBanner}>
        <VectorIcon name="bell" size={12} color={THEME.colors.accent} />
        <Text style={styles.lombardiText}>
          {t('audit.lombardiNotice', {
            defaultValue: 'Lombardi Time (Principle #15): 15 minutes early is on time. Plan buffer.',
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
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titles: {
    marginLeft: 8,
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
  totalBadge: {
    backgroundColor: '#1E222A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radii.full,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  totalText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.accent,
  },
  addSection: {
    backgroundColor: '#111317',
    borderRadius: THEME.radii.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: 8,
    marginBottom: 8,
  },
  textInput: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    height: 36,
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  selectorLabel: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: '700',
    width: 38,
  },
  durationChips: {
    flexDirection: 'row',
    flex: 1,
    gap: 6,
  },
  chip: {
    backgroundColor: '#1B1E26',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  chipActive: {
    backgroundColor: 'rgba(229, 169, 60, 0.15)',
    borderColor: THEME.colors.accent,
  },
  chipText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: '700',
  },
  chipTextActive: {
    color: THEME.colors.accent,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  categoryChips: {
    flexDirection: 'row',
    flex: 1,
    gap: 6,
    flexWrap: 'wrap',
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B1E26',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 4,
  },
  catChipActive: {
    backgroundColor: 'rgba(229, 169, 60, 0.15)',
    borderColor: THEME.colors.accent,
  },
  catChipText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: '700',
  },
  catChipTextActive: {
    color: THEME.colors.accent,
  },
  addBtn: {
    backgroundColor: THEME.colors.accent,
    width: 34,
    height: 34,
    borderRadius: THEME.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lombardiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171A21',
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
    backgroundColor: '#1A2333',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: THEME.radii.sm,
    marginRight: 8,
  },
  durationText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#60A5FA',
  },
  logActivity: {
    flex: 1,
    fontSize: 12,
    color: THEME.colors.textPrimary,
  },
  catTag: {
    backgroundColor: '#16181D',
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
