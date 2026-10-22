import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme.ts';
import { t } from '../../services/i18n.ts';
import { VectorIcon } from '../../components/common/VectorIcon.tsx';
import { TimeLogEntry, TimeLogCategory } from '../../store/auditStore.ts';

export interface TimeLogListProps {
  logs: TimeLogEntry[];
  onAddLog: (activity: string, durationMinutes: number, category: TimeLogCategory) => void;
  onDeleteLog: (id: string) => void;
}

export const TimeLogList: React.FC<TimeLogListProps> = ({ logs, onAddLog, onDeleteLog }) => {
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

        {/* Options */}
        <View style={styles.optionsRow}>
          {/* Duration Chips */}
          <View style={styles.chipGroup}>
            {durationOptions.map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.chip, duration === d && styles.chipActive]}
                onPress={() => setDuration(d)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, duration === d && styles.chipTextActive]}>
                  {d}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Category Chips */}
          <View style={styles.chipGroup}>
            {categoryOptions.map((c) => (
              <TouchableOpacity
                key={c.key}
                style={[styles.chip, category === c.key && styles.chipActive]}
                onPress={() => setCategory(c.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, category === c.key && styles.chipTextActive]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.8}>
            <VectorIcon name="plus" size={16} color={THEME.colors.canvas} />
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
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    flexWrap: 'wrap',
    gap: 4,
  },
  chipGroup: {
    flexDirection: 'row',
    gap: 4,
  },
  chip: {
    backgroundColor: '#1B1E26',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  chipActive: {
    backgroundColor: '#261F10',
    borderColor: THEME.colors.accent,
  },
  chipText: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: THEME.colors.accent,
  },
  addBtn: {
    backgroundColor: THEME.colors.accent,
    width: 26,
    height: 26,
    borderRadius: THEME.radii.full,
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
