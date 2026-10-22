import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { THEME } from '../../constants/theme.ts';
import { useTranslation } from '../../services/i18n.ts';
import { VectorIcon } from '../../components/common/VectorIcon.tsx';
import { ExecutiveButton } from '../../components/common/ExecutiveButton.tsx';
import { usePlannerStore } from '../../store/plannerStore.ts';

export interface EveningRitualModalProps {
  visible: boolean;
  onClose: () => void;
}

export const EveningRitualModal: React.FC<EveningRitualModalProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation();
  const [a1Title, setA1Title] = useState('');
  const [a2Title, setA2Title] = useState('');
  const [a3Title, setA3Title] = useState('');

  const completedToday = usePlannerStore
    .getState()
    .tasks.filter((task) => task.completed);

  const handleCommit = () => {
    const store = usePlannerStore.getState();
    if (a1Title.trim()) {
      store.addTask({
        id: `task-tomorrow-${Date.now()}-1`,
        title: a1Title.trim(),
        priority: 'A',
        priorityRank: 1,
      });
    }
    if (a2Title.trim()) {
      store.addTask({
        id: `task-tomorrow-${Date.now()}-2`,
        title: a2Title.trim(),
        priority: 'A',
        priorityRank: 2,
      });
    }
    if (a3Title.trim()) {
      store.addTask({
        id: `task-tomorrow-${Date.now()}-3`,
        title: a3Title.trim(),
        priority: 'A',
        priorityRank: 3,
      });
    }

    setA1Title('');
    setA2Title('');
    setA3Title('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <VectorIcon name="moon" size={18} color={THEME.colors.accent} />
              <Text style={styles.headerTitle}>
                {t('planner.eveningRitualTitle', { defaultValue: 'Evening Planning Ritual' })}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <VectorIcon name="x" size={20} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.principleQuote}>
            {t('planner.eveningQuote', {
              defaultValue: 'Principle #1: Always think on paper the night before so your subconscious works while you sleep.',
            })}
          </Text>

          <ScrollView
            style={styles.scrollArea}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Today's Accomplishments */}
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <VectorIcon name="check-circle" size={14} color={THEME.colors.success} />
                <Text style={styles.sectionTitle}>
                  {t('planner.todayCompleted', { defaultValue: 'Completed Today' })} ({completedToday.length})
                </Text>
              </View>
              {completedToday.length === 0 ? (
                <Text style={styles.emptyNotice}>
                  {t('planner.noCompletedToday', { defaultValue: 'No tasks marked completed today yet.' })}
                </Text>
              ) : (
                completedToday.slice(0, 4).map((task) => (
                  <View key={task.id} style={styles.completedItem}>
                    <VectorIcon name="check" size={12} color={THEME.colors.success} />
                    <Text style={styles.completedText}>{task.title}</Text>
                  </View>
                ))
              )}
            </View>

            {/* Tomorrow's Top A-Priority Tasks */}
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <VectorIcon name="sun" size={14} color={THEME.colors.accent} />
                <Text style={styles.sectionTitle}>
                  {t('planner.planTomorrowTitle', { defaultValue: "Tomorrow's Top [A] Priority Tasks" })}
                </Text>
              </View>

              {/* A-1 Input */}
              <View style={styles.taskInputBlock}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankBadgeText}>A-1</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder={t('planner.a1Placeholder', { defaultValue: 'Your single most vital priority...' })}
                  placeholderTextColor={THEME.colors.textTertiary}
                  value={a1Title}
                  onChangeText={setA1Title}
                />
              </View>

              {/* A-2 Input */}
              <View style={styles.taskInputBlock}>
                <View style={[styles.rankBadge, styles.rankBadgeSecondary]}>
                  <Text style={styles.rankBadgeText}>A-2</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder={t('planner.a2Placeholder', { defaultValue: 'Second critical task...' })}
                  placeholderTextColor={THEME.colors.textTertiary}
                  value={a2Title}
                  onChangeText={setA2Title}
                />
              </View>

              {/* A-3 Input */}
              <View style={styles.taskInputBlock}>
                <View style={[styles.rankBadge, styles.rankBadgeSecondary]}>
                  <Text style={styles.rankBadgeText}>A-3</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder={t('planner.a3Placeholder', { defaultValue: 'Third critical task...' })}
                  placeholderTextColor={THEME.colors.textTertiary}
                  value={a3Title}
                  onChangeText={setA3Title}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <ExecutiveButton
              title={t('planner.commitTomorrow', { defaultValue: 'Lock In Tomorrow & Rest' })}
              variant="primary"
              size="md"
              onPress={handleCommit}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: THEME.colors.card,
    borderTopLeftRadius: THEME.radii.lg + 4,
    borderTopRightRadius: THEME.radii.lg + 4,
    borderTopWidth: 1,
    borderColor: THEME.colors.border,
    padding: THEME.spacing.md,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginLeft: 8,
  },
  closeBtn: {
    padding: 4,
  },
  principleQuote: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.md,
    lineHeight: 16,
  },
  scrollArea: {
    marginBottom: THEME.spacing.md,
  },
  section: {
    marginBottom: THEME.spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginLeft: 6,
  },
  emptyNotice: {
    fontSize: 12,
    color: THEME.colors.textTertiary,
    fontStyle: 'italic',
  },
  completedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  completedText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginLeft: 6,
    textDecorationLine: 'line-through',
  },
  taskInputBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111317',
    borderRadius: THEME.radii.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  rankBadge: {
    backgroundColor: '#261F10',
    borderWidth: 1,
    borderColor: THEME.colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radii.sm,
    marginRight: 8,
  },
  rankBadgeSecondary: {
    backgroundColor: '#1A2333',
    borderColor: '#3B82F6',
  },
  rankBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.accent,
  },
  input: {
    flex: 1,
    height: 38,
    color: THEME.colors.textPrimary,
    fontSize: 13,
  },
  footer: {
    paddingTop: THEME.spacing.xs,
  },
});
