import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { THEME } from '../../constants/theme.ts';
import { t } from '../../services/i18n.ts';
import { VectorIcon } from '../../components/common/VectorIcon.tsx';
import { Task, PriorityType } from '../../store/plannerStore.ts';

export interface ABCDETaskItemProps {
  task: Task;
  isPareto?: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAddSubtask?: (taskId: string, subtaskTitle: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
}

export const ABCDETaskItem: React.FC<ABCDETaskItemProps> = ({
  task,
  isPareto = false,
  onToggle,
  onDelete,
  onAddSubtask,
  onToggleSubtask,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');

  const getPriorityStyle = (priority: PriorityType) => {
    switch (priority) {
      case 'A':
        return {
          bg: '#2B1A0A',
          border: THEME.colors.accent,
          text: THEME.colors.accent,
          label: 'A - MUST',
        };
      case 'B':
        return {
          bg: '#14223A',
          border: '#3B82F6',
          text: '#60A5FA',
          label: 'B - SHOULD',
        };
      case 'C':
        return {
          bg: '#1A1D24',
          border: THEME.colors.border,
          text: THEME.colors.textSecondary,
          label: 'C - NICE',
        };
      case 'D':
        return {
          bg: '#2D1B10',
          border: '#F97316',
          text: '#FB923C',
          label: 'D - DELEGATE',
        };
      case 'E':
      default:
        return {
          bg: '#2A1010',
          border: THEME.colors.danger,
          text: THEME.colors.danger,
          label: 'E - ELIMINATE',
        };
    }
  };

  const pStyle = getPriorityStyle(task.priority);
  const rankLabel = task.priorityRank ? `${task.priority}-${task.priorityRank}` : task.priority;

  const handleSubtaskAdd = () => {
    if (newSubtask.trim() && onAddSubtask) {
      onAddSubtask(task.id, newSubtask.trim());
      setNewSubtask('');
    }
  };

  const completedSubtasks = (task.subtasks || []).filter((s) => s.completed).length;
  const totalSubtasks = (task.subtasks || []).length;

  return (
    <View style={[styles.container, isPareto && styles.paretoHighlight]}>
      <View style={styles.mainRow}>
        {/* Toggle Complete Checkbox */}
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => onToggle(task.id)}
          activeOpacity={0.7}
        >
          <VectorIcon
            name={task.completed ? 'check-circle' : 'circle'}
            size={20}
            color={task.completed ? THEME.colors.success : THEME.colors.textTertiary}
          />
        </TouchableOpacity>

        {/* Priority Badge */}
        <View style={[styles.priorityBadge, { backgroundColor: pStyle.bg, borderColor: pStyle.border }]}>
          <Text style={[styles.priorityText, { color: pStyle.text }]}>{rankLabel}</Text>
        </View>

        {/* Title & Info */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, task.completed && styles.titleCompleted]}>
            {task.title}
          </Text>
          <View style={styles.metaRow}>
            {isPareto && (
              <View style={styles.paretoTag}>
                <VectorIcon name="star" size={10} color={THEME.colors.accent} />
                <Text style={styles.paretoTagText}>
                  {t('planner.paretoTag', { defaultValue: 'PARETO 80/20' })}
                </Text>
              </View>
            )}
            {totalSubtasks > 0 && (
              <TouchableOpacity
                style={styles.salamiIndicator}
                onPress={() => setExpanded(!expanded)}
              >
                <VectorIcon name="layers" size={10} color={THEME.colors.textSecondary} />
                <Text style={styles.salamiText}>
                  {completedSubtasks}/{totalSubtasks} {t('planner.slices', { defaultValue: 'slices' })}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
        >
          <VectorIcon
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={THEME.colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onDelete(task.id)}
          activeOpacity={0.7}
        >
          <VectorIcon name="trash-2" size={14} color={THEME.colors.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* Salami Slicing Expandable Section (Principle #18) */}
      {expanded && (
        <View style={styles.salamiSection}>
          <View style={styles.salamiHeader}>
            <VectorIcon name="scissors" size={12} color={THEME.colors.accent} />
            <Text style={styles.salamiHeaderTitle}>
              {t('planner.salamiTitle', { defaultValue: 'SALAMI SLICING (PRINCIPLE #18)' })}
            </Text>
          </View>

          {/* Subtasks List */}
          {(task.subtasks || []).map((sub) => (
            <TouchableOpacity
              key={sub.id}
              style={styles.subtaskRow}
              onPress={() => onToggleSubtask && onToggleSubtask(task.id, sub.id)}
              activeOpacity={0.7}
            >
              <VectorIcon
                name={sub.completed ? 'check-square' : 'square'}
                size={14}
                color={sub.completed ? THEME.colors.success : THEME.colors.textTertiary}
              />
              <Text style={[styles.subtaskTitle, sub.completed && styles.subtaskCompleted]}>
                {sub.title}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Add Subtask Input */}
          {onAddSubtask && (
            <View style={styles.subtaskInputRow}>
              <TextInput
                style={styles.subtaskInput}
                placeholder={t('planner.slicePlaceholder', { defaultValue: 'Slice off a bite-sized piece...' })}
                placeholderTextColor={THEME.colors.textTertiary}
                value={newSubtask}
                onChangeText={setNewSubtask}
                onSubmitEditing={handleSubtaskAdd}
              />
              <TouchableOpacity style={styles.subtaskAddBtn} onPress={handleSubtaskAdd}>
                <VectorIcon name="plus" size={14} color={THEME.colors.canvas} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radii.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: THEME.spacing.md - 2,
    marginBottom: THEME.spacing.sm,
  },
  paretoHighlight: {
    borderColor: 'rgba(229, 169, 60, 0.4)',
    backgroundColor: '#191A20',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 10,
    padding: 2,
  },
  priorityBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    marginRight: 10,
    minWidth: 32,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: THEME.colors.textTertiary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  paretoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#261F10',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radii.full,
    marginRight: 8,
  },
  paretoTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.accent,
    marginLeft: 3,
    letterSpacing: 0.4,
  },
  salamiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salamiText: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    marginLeft: 3,
  },
  actionBtn: {
    padding: 6,
  },
  deleteBtn: {
    padding: 6,
    marginLeft: 2,
  },
  salamiSection: {
    marginTop: THEME.spacing.sm,
    paddingTop: THEME.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  salamiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  salamiHeaderTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: THEME.colors.accent,
    marginLeft: 5,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: 4,
  },
  subtaskTitle: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  subtaskCompleted: {
    textDecorationLine: 'line-through',
    color: THEME.colors.textTertiary,
  },
  subtaskInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121418',
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 8,
    marginTop: 6,
  },
  subtaskInput: {
    flex: 1,
    height: 34,
    fontSize: 12,
    color: THEME.colors.textPrimary,
  },
  subtaskAddBtn: {
    backgroundColor: THEME.colors.accent,
    width: 22,
    height: 22,
    borderRadius: THEME.radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
});
