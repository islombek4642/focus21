import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme.ts';
import { useTranslation } from '../../services/i18n.ts';
import { Badge } from '../../components/common/Badge.tsx';
import { VectorIcon } from '../../components/common/VectorIcon.tsx';

export interface HeroTaskCardProps {
  task: {
    id: string;
    title: string;
    priority?: string;
    priorityRank?: number;
    subtasks?: { id: string; title: string; completed: boolean }[];
  } | null;
  onSelectTask?: () => void;
  onCompleteTask?: () => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
}

export const HeroTaskCard: React.FC<HeroTaskCardProps> = ({
  task,
  onSelectTask,
  onCompleteTask,
  onToggleSubtask,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.tagGroup}>
          <VectorIcon name="crosshair" size={13} color={THEME.colors.accent} />
          <Text style={styles.principleTag}>
            {t('focus.singleHandlingTag', { defaultValue: 'SINGLE HANDLING (#5)' })}
          </Text>
        </View>
        <Badge
          label={t('common.paretoBadge', { defaultValue: 'PARETO 80/20' })}
          variant="pareto"
          size="sm"
        />
      </View>

      {task ? (
        <View style={styles.content}>
          <Text style={styles.taskTitle}>
            {task.priority ? `[${task.priority}${task.priorityRank ? `-${task.priorityRank}` : ''}] ` : '[A-1] '}
            {task.title}
          </Text>
          <Text style={styles.taskRule}>
            {t('focus.singleHandlingRule', {
              defaultValue: 'Work on this single task with 100% dedication until completed.',
            })}
          </Text>

          {/* Salami Slicing Subtasks Section */}
          {task.subtasks && task.subtasks.length > 0 && (
            <View style={styles.salamiBox}>
              <View style={styles.salamiHeaderRow}>
                <View style={styles.salamiTitleGroup}>
                  <VectorIcon name="layers" size={12} color={THEME.colors.accent} />
                  <Text style={styles.salamiHeaderText}>
                    {t('planner.salamiTitle', { defaultValue: 'SALAMI SLICING (PRINCIPLE #18)' })}
                  </Text>
                </View>
                <Text style={styles.salamiCountText}>
                  {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
                </Text>
              </View>

              {task.subtasks.map((sub) => (
                <TouchableOpacity
                  key={sub.id}
                  style={styles.subtaskItem}
                  onPress={() => onToggleSubtask && onToggleSubtask(task.id, sub.id)}
                  activeOpacity={0.7}
                >
                  <VectorIcon
                    name={sub.completed ? 'check-square' : 'square'}
                    size={14}
                    color={sub.completed ? THEME.colors.success : THEME.colors.textTertiary}
                  />
                  <Text
                    style={[
                      styles.subtaskTitle,
                      sub.completed && styles.subtaskCompleted,
                    ]}
                  >
                    {sub.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.actionRow}>
            {onCompleteTask && (
              <TouchableOpacity
                style={styles.completeBtn}
                onPress={onCompleteTask}
                activeOpacity={0.8}
              >
                <VectorIcon name="check" size={14} color={THEME.colors.success} />
                <Text style={styles.completeBtnText}>
                  {t('focus.markComplete', { defaultValue: 'Mark Finished' })}
                </Text>
              </TouchableOpacity>
            )}
            {onSelectTask && (
              <TouchableOpacity
                style={styles.switchBtn}
                onPress={onSelectTask}
                activeOpacity={0.8}
              >
                <VectorIcon name="refresh-cw" size={13} color={THEME.colors.textSecondary} />
                <Text style={styles.switchBtnText}>
                  {t('focus.switchTask', { defaultValue: 'Change A-1' })}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.emptyContainer}
          onPress={onSelectTask}
          activeOpacity={0.7}
        >
          <VectorIcon name="plus-circle" size={24} color={THEME.colors.accent} />
          <Text style={styles.emptyTitle}>
            {t('focus.noTaskTitle', { defaultValue: 'No [A-1] Task Selected' })}
          </Text>
          <Text style={styles.emptySubtitle}>
            {t('focus.noTaskSubtitle', {
              defaultValue: 'Pick your most critical high-payoff task to apply single handling.',
            })}
          </Text>
        </TouchableOpacity>
      )}
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
    marginTop: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.sm,
  },
  tagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  principleTag: {
    ...THEME.typography.label,
    marginLeft: 6,
    color: THEME.colors.accent,
    fontSize: 10,
  },
  content: {
    marginTop: THEME.spacing.xs,
  },
  taskTitle: {
    ...THEME.typography.headingMd,
    fontSize: 18,
    marginBottom: 4,
  },
  taskRule: {
    ...THEME.typography.body,
    color: THEME.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: THEME.spacing.md,
    paddingTop: THEME.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.successTint,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radii.full,
    marginRight: 10,
  },
  completeBtnText: {
    color: THEME.colors.success,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  switchBtnText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  salamiBox: {
    marginTop: THEME.spacing.sm,
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.radii.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: 10,
  },
  salamiHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  salamiTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salamiHeaderText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.accent,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  salamiCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  subtaskTitle: {
    fontSize: 13,
    color: THEME.colors.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  subtaskCompleted: {
    color: THEME.colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: THEME.spacing.lg,
  },
  emptyTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
  },
  emptySubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: THEME.spacing.md,
  },
});
