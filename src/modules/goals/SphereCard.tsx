import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme.ts';
import { useTranslation } from '../../services/i18n.ts';
import { VectorIcon } from '../../components/common/VectorIcon.tsx';
import { Goal, GoalSphere } from '../../store/goalsStore.ts';

export interface SphereCardProps {
  sphere: GoalSphere;
  title: string;
  icon: string;
  goals: Goal[];
  onAddGoal: (title: string) => void;
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
}

export const SphereCard: React.FC<SphereCardProps> = ({
  sphere,
  title,
  icon,
  goals,
  onAddGoal,
  onToggleGoal,
  onDeleteGoal,
}) => {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleSave = () => {
    if (newTitle.trim()) {
      onAddGoal(newTitle.trim());
      setNewTitle('');
      setIsAdding(false);
    }
  };

  const sphereAccent =
    sphere === 'business'
      ? THEME.colors.accent
      : sphere === 'family'
      ? '#60A5FA'
      : THEME.colors.success;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconBadge, { borderColor: sphereAccent }]}>
            <VectorIcon name={icon} size={15} color={sphereAccent} />
          </View>
          <View style={styles.titleTextContainer}>
            <Text style={styles.sphereTitle}>{title}</Text>
            <Text style={styles.goalCount}>
              {goals.length} {t('goals.goalsCountSuffix', { defaultValue: 'goals' })}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setIsAdding(!isAdding)}
          activeOpacity={0.7}
        >
          <VectorIcon
            name={isAdding ? 'x' : 'plus'}
            size={16}
            color={THEME.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Add Goal Input */}
      {isAdding && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={t('goals.newGoalPlaceholder', { defaultValue: 'Enter concrete goal...' })}
            placeholderTextColor={THEME.colors.textTertiary}
            value={newTitle}
            onChangeText={setNewTitle}
            onSubmitEditing={handleSave}
            autoFocus
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <VectorIcon name="check" size={16} color={THEME.colors.canvas} />
          </TouchableOpacity>
        </View>
      )}

      {/* Goal List */}
      <View style={styles.goalsList}>
        {goals.length === 0 && !isAdding ? (
          <Text style={styles.emptyText}>
            {t('goals.emptySphere', { defaultValue: 'No goals set in this sphere yet.' })}
          </Text>
        ) : (
          goals.map((item) => (
            <View key={item.id} style={styles.goalItem}>
              <TouchableOpacity
                style={styles.checkBtn}
                onPress={() => onToggleGoal(item.id)}
                activeOpacity={0.8}
              >
                <VectorIcon
                  name={item.completed ? 'check-square' : 'square'}
                  size={16}
                  color={item.completed ? THEME.colors.success : THEME.colors.textTertiary}
                />
              </TouchableOpacity>
              <Text style={[styles.goalItemText, item.completed && styles.goalCompleted]}>
                {item.title}
              </Text>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => onDeleteGoal(item.id)}
                activeOpacity={0.7}
              >
                <VectorIcon name="trash-2" size={13} color={THEME.colors.textTertiary} />
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: THEME.radii.md,
    backgroundColor: '#1E222A',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleTextContainer: {
    marginLeft: 10,
  },
  sphereTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  goalCount: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
  addBtn: {
    padding: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B1E26',
    borderRadius: THEME.radii.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    color: THEME.colors.textPrimary,
    fontSize: 13,
  },
  saveBtn: {
    backgroundColor: THEME.colors.accent,
    width: 28,
    height: 28,
    borderRadius: THEME.radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  goalsList: {
    marginTop: 4,
  },
  emptyText: {
    fontSize: 12,
    color: THEME.colors.textTertiary,
    fontStyle: 'italic',
    paddingVertical: 6,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  checkBtn: {
    marginRight: 10,
  },
  goalItemText: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.textPrimary,
  },
  goalCompleted: {
    textDecorationLine: 'line-through',
    color: THEME.colors.textTertiary,
  },
  deleteBtn: {
    padding: 4,
    marginLeft: 6,
  },
});
