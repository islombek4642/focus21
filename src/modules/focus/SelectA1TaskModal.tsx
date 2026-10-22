import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { THEME } from '../../constants/theme.ts';
import { useTranslation } from '../../services/i18n.ts';
import { VectorIcon } from '../../components/common/VectorIcon.tsx';
import { usePlannerStore, Task, PriorityType } from '../../store/plannerStore.ts';
import { useFocusStore } from '../../store/focusStore.ts';

export interface SelectA1TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTask: (task: { id: string; title: string }) => void;
  activeTaskId?: string;
}

export const SelectA1TaskModal: React.FC<SelectA1TaskModalProps> = ({
  visible,
  onClose,
  onSelectTask,
  activeTaskId,
}) => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>(() => usePlannerStore.getState().tasks);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (visible) {
      setTasks([...usePlannerStore.getState().tasks]);
      const unsubscribe = usePlannerStore.subscribe(() => {
        setTasks([...usePlannerStore.getState().tasks]);
      });
      return () => {
        unsubscribe();
      };
    }
  }, [visible]);

  // Priority sorting helper
  const priorityWeight: Record<PriorityType, number> = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
  };

  const pendingTasks = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => {
      const weightDiff = priorityWeight[a.priority] - priorityWeight[b.priority];
      if (weightDiff !== 0) return weightDiff;
      return (a.priorityRank || 99) - (b.priorityRank || 99);
    });

  const handleCreateAndSelect = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    const newTaskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newTask: Task = {
      id: newTaskId,
      title: trimmed,
      priority: 'A',
      priorityRank: 1,
      completed: false,
      createdAt: Date.now(),
    };

    usePlannerStore.getState().addTask(newTask);
    useFocusStore.getState().setA1Task({ id: newTaskId, title: trimmed });
    onSelectTask({ id: newTaskId, title: trimmed });

    setNewTitle('');
    onClose();
  };

  const handlePickTask = (task: Task) => {
    useFocusStore.getState().setA1Task({ id: task.id, title: task.title });
    onSelectTask({ id: task.id, title: task.title });
    onClose();
  };

  const getPriorityBadgeStyle = (priority: PriorityType) => {
    switch (priority) {
      case 'A':
        return styles.badgeA;
      case 'B':
        return styles.badgeB;
      default:
        return styles.badgeOther;
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <VectorIcon name="crosshair" size={18} color={THEME.colors.accent} />
              <Text style={styles.headerTitle}>
                {t('focus.selectA1ModalTitle', { defaultValue: 'Select [A-1] Task' })}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <VectorIcon name="x" size={20} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Quick Create [A-1] Task Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                {t('focus.createNewA1', { defaultValue: 'CREATE NEW [A-1] TASK' })}
              </Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder={t('focus.createNewA1Placeholder', {
                    defaultValue: 'Enter top priority task for today...',
                  })}
                  placeholderTextColor={THEME.colors.textTertiary}
                  value={newTitle}
                  onChangeText={setNewTitle}
                  returnKeyType="done"
                  onSubmitEditing={handleCreateAndSelect}
                />
                <TouchableOpacity
                  style={[styles.addBtn, !newTitle.trim() && styles.addBtnDisabled]}
                  onPress={handleCreateAndSelect}
                  disabled={!newTitle.trim()}
                  activeOpacity={0.8}
                >
                  <VectorIcon name="check" size={16} color="#000000" />
                  <Text style={styles.addBtnText}>
                    {t('focus.addAndSelect', { defaultValue: 'Set as A-1' })}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Existing Planner Tasks Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                {t('focus.plannerTasksTitle', { defaultValue: 'AVAILABLE TASKS FROM PLANNER' })}
              </Text>

              {pendingTasks.length === 0 ? (
                <View style={styles.emptyBox}>
                  <VectorIcon name="inbox" size={24} color={THEME.colors.textTertiary} />
                  <Text style={styles.emptyText}>
                    {t('focus.noPlannerTasks', {
                      defaultValue:
                        'No tasks in planner yet. Create your top priority task above.',
                    })}
                  </Text>
                </View>
              ) : (
                pendingTasks.map((task) => {
                  const isActive = task.id === activeTaskId;
                  return (
                    <TouchableOpacity
                      key={task.id}
                      style={[styles.taskRow, isActive && styles.taskRowActive]}
                      onPress={() => handlePickTask(task)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.taskLeft}>
                        <View style={[styles.priorityBadge, getPriorityBadgeStyle(task.priority)]}>
                          <Text style={styles.priorityText}>{task.priority}</Text>
                        </View>
                        <Text style={[styles.taskTitle, isActive && styles.taskTitleActive]}>
                          {task.title}
                        </Text>
                      </View>

                      {isActive ? (
                        <View style={styles.activeTag}>
                          <VectorIcon name="check" size={12} color={THEME.colors.accent} />
                          <Text style={styles.activeTagText}>
                            {t('focus.activeBadge', { defaultValue: 'ACTIVE [A-1]' })}
                          </Text>
                        </View>
                      ) : (
                        <VectorIcon
                          name="chevron-right"
                          size={16}
                          color={THEME.colors.textTertiary}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </ScrollView>
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
    borderTopLeftRadius: THEME.radii.lg,
    borderTopRightRadius: THEME.radii.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    ...THEME.typography.headingMd,
    fontSize: 16,
    letterSpacing: 0.8,
  },
  closeBtn: {
    padding: 6,
    borderRadius: THEME.radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  scrollArea: {
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
  },
  section: {
    marginBottom: THEME.spacing.lg,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: THEME.colors.canvas,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radii.md,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: 10,
    color: THEME.colors.textPrimary,
    fontSize: 14,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.accent,
    paddingHorizontal: 14,
    borderRadius: THEME.radii.md,
    gap: 6,
  },
  addBtnDisabled: {
    opacity: 0.4,
  },
  addBtnText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    backgroundColor: THEME.colors.canvas,
    borderRadius: THEME.radii.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.canvas,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radii.md,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  taskRowActive: {
    borderColor: THEME.colors.accent,
    backgroundColor: 'rgba(217, 119, 6, 0.08)',
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    gap: 10,
  },
  priorityBadge: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeA: {
    backgroundColor: 'rgba(217, 119, 6, 0.2)',
    borderWidth: 1,
    borderColor: THEME.colors.accent,
  },
  badgeB: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  badgeOther: {
    backgroundColor: 'rgba(156, 163, 175, 0.15)',
    borderWidth: 1,
    borderColor: THEME.colors.textTertiary,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  taskTitle: {
    fontSize: 14,
    color: THEME.colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  taskTitleActive: {
    color: THEME.colors.accent,
    fontWeight: '700',
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(217, 119, 6, 0.15)',
  },
  activeTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.accent,
    letterSpacing: 0.5,
  },
});
