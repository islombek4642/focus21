import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer.tsx';
import { ExecutiveHeader } from '../../components/common/ExecutiveHeader.tsx';
import { THEME } from '../../constants/theme.ts';
import { useTranslation } from '../../services/i18n.ts';
import { VectorIcon } from '../../components/common/VectorIcon.tsx';
import { ABCDETaskItem } from './ABCDETaskItem.tsx';
import { ParetoSummary } from './ParetoSummary.tsx';
import { EveningRitualModal } from './EveningRitualModal.tsx';
import { usePlannerStore, PriorityType, Task } from '../../store/plannerStore.ts';

export const PlannerScreen: React.FC = () => {
  const { t } = useTranslation();
  const [plannerState, setPlannerState] = useState(() => usePlannerStore.getState());
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newPriority, setNewPriority] = useState<PriorityType>('A');
  const [ritualModalVisible, setRitualModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = usePlannerStore.subscribe(() => {
      setPlannerState({ ...usePlannerStore.getState() });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const existingInPriority = plannerState.tasks.filter((t) => t.priority === newPriority);
      usePlannerStore.getState().addTask({
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: newTaskTitle.trim(),
        priority: newPriority,
        priorityRank: existingInPriority.length + 1,
      });
      setNewTaskTitle('');
    }
  };

  const handleToggle = (id: string) => {
    usePlannerStore.getState().toggleTask(id);
  };

  const handleDelete = (id: string) => {
    usePlannerStore.getState().deleteTask(id);
  };

  const handleAddSubtask = (taskId: string, subtaskTitle: string) => {
    const task = plannerState.tasks.find((t) => t.id === taskId);
    if (!task) return;
    const nextSubtasks = [
      ...(task.subtasks || []),
      { id: `sub-${Date.now()}`, title: subtaskTitle, completed: false },
    ];
    usePlannerStore.getState().updateTask(taskId, { subtasks: nextSubtasks });
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const task = plannerState.tasks.find((t) => t.id === taskId);
    if (!task || !task.subtasks) return;
    const nextSubtasks = task.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    usePlannerStore.getState().updateTask(taskId, { subtasks: nextSubtasks });
  };

  const paretoTasks = usePlannerStore.getState().getParetoTasks();
  const paretoIds = new Set(paretoTasks.map((t) => t.id));
  const paretoCompletedCount = paretoTasks.filter((t) => t.completed).length;

  const filteredTasks = plannerState.tasks.filter((task) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'PARETO') return paretoIds.has(task.id);
    return task.priority === selectedFilter;
  });

  const priorityOptions: PriorityType[] = ['A', 'B', 'C', 'D', 'E'];

  return (
    <ScreenContainer>
      {/* Top Header */}
      <ExecutiveHeader
        title={t('tabs.planner', { defaultValue: 'ABCDE PLANNER' })}
        subtitle={t('planner.principleNote', { defaultValue: 'Principles #2, #3, #4 & #13' })}
        badge={
          <TouchableOpacity
            style={styles.ritualBtn}
            onPress={() => setRitualModalVisible(true)}
            activeOpacity={0.8}
          >
            <VectorIcon name="moon" size={13} color={THEME.colors.accent} />
            <Text style={styles.ritualBtnText}>
              {t('planner.eveningRitualBtn', { defaultValue: 'Evening Ritual' })}
            </Text>
          </TouchableOpacity>
        }
      />

      {/* 80/20 Pareto Summary */}
      <ParetoSummary
        totalTasks={plannerState.tasks.length}
        paretoCount={paretoTasks.length}
        paretoCompletedCount={paretoCompletedCount}
      />

      {/* Quick Add Task Row */}
      <View style={styles.addCard}>
        <View style={styles.addInputRow}>
          <TouchableOpacity
            style={styles.prioritySelector}
            onPress={() => {
              const nextIndex = (priorityOptions.indexOf(newPriority) + 1) % priorityOptions.length;
              setNewPriority(priorityOptions[nextIndex]);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.prioritySelectorText}>[{newPriority}]</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.addInput}
            placeholder={t('planner.addTaskPlaceholder', { defaultValue: 'Add task for today...' })}
            placeholderTextColor={THEME.colors.textTertiary}
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            onSubmitEditing={handleAddTask}
          />

          <TouchableOpacity
            style={styles.addBtn}
            onPress={handleAddTask}
            activeOpacity={0.8}
          >
            <VectorIcon name="plus" size={16} color={THEME.colors.canvas} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters Row */}
      <View style={styles.filterRow}>
        {['ALL', 'A', 'B', 'C', 'D', 'E', 'PARETO'].map((filterKey) => (
          <TouchableOpacity
            key={filterKey}
            style={[
              styles.filterPill,
              selectedFilter === filterKey && styles.filterPillActive,
            ]}
            onPress={() => setSelectedFilter(filterKey)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterPillText,
                selectedFilter === filterKey && styles.filterPillTextActive,
              ]}
            >
              {filterKey}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tasks List */}
      <View style={styles.tasksList}>
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <VectorIcon name="check-square" size={32} color={THEME.colors.textTertiary} />
            <Text style={styles.emptyTitle}>
              {t('planner.noTasksTitle', { defaultValue: 'No tasks in this category' })}
            </Text>
            <Text style={styles.emptySubtitle}>
              {t('planner.noTasksSubtitle', { defaultValue: 'Organize priorities using the ABCDE method.' })}
            </Text>
          </View>
        ) : (
          filteredTasks.map((task) => (
            <ABCDETaskItem
              key={task.id}
              task={task}
              isPareto={paretoIds.has(task.id)}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onAddSubtask={handleAddSubtask}
              onToggleSubtask={handleToggleSubtask}
            />
          ))
        )}
      </View>

      {/* Evening Ritual Wizard Modal */}
      <EveningRitualModal
        visible={ritualModalVisible}
        onClose={() => setRitualModalVisible(false)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: THEME.spacing.sm,
    paddingBottom: THEME.spacing.sm,
  },
  brandTitle: {
    ...THEME.typography.headingLg,
    fontSize: 22,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  ritualBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.accentMuted,
    borderWidth: 1,
    borderColor: THEME.colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radii.full,
  },
  ritualBtnText: {
    color: THEME.colors.accent,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  addCard: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radii.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: 8,
    marginBottom: THEME.spacing.sm,
  },
  addInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prioritySelector: {
    backgroundColor: THEME.colors.accentMuted,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    borderColor: THEME.colors.accent,
    marginRight: 8,
  },
  prioritySelectorText: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.accent,
  },
  addInput: {
    flex: 1,
    height: 40,
    color: THEME.colors.textPrimary,
    fontSize: 13,
  },
  addBtn: {
    backgroundColor: THEME.colors.accent,
    width: 32,
    height: 32,
    borderRadius: THEME.radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: THEME.spacing.md,
  },
  filterPill: {
    backgroundColor: THEME.colors.card,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radii.full,
  },
  filterPillActive: {
    backgroundColor: THEME.colors.accentMuted,
    borderColor: THEME.colors.accent,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
  },
  filterPillTextActive: {
    color: THEME.colors.accent,
  },
  tasksList: {
    paddingBottom: THEME.spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: THEME.spacing.xl,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});
