import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer.tsx';
import { ExecutiveHeader } from '../../components/common/ExecutiveHeader.tsx';
import { THEME } from '../../constants/theme.ts';
import { useTranslation } from '../../services/i18n.ts';
import { VectorIcon } from '../../components/common/VectorIcon.tsx';
import { ExecutiveButton } from '../../components/common/ExecutiveButton.tsx';
import { TimerRing } from './TimerRing.tsx';
import { HeroTaskCard } from './HeroTaskCard.tsx';
import { DailyPrincipleCard } from '../../components/common/DailyPrincipleCard.tsx';
import { SelectA1TaskModal } from './SelectA1TaskModal.tsx';
import { useFocusTimer } from './useFocusTimer.ts';
import { usePlannerStore } from '../../store/plannerStore.ts';
import { useFocusStore } from '../../store/focusStore.ts';

export const FocusScreen: React.FC = () => {
  const { t } = useTranslation();
  const {
    isRunning,
    formattedTime,
    completedChunksCount,
    progress,
    start,
    pause,
    reset,
  } = useFocusTimer();

  const [focusState, setFocusState] = useState(() => useFocusStore.getState());
  const [plannerTasks, setPlannerTasks] = useState(() => usePlannerStore.getState().tasks);
  const [selectModalVisible, setSelectModalVisible] = useState(false);

  useEffect(() => {
    const unsubFocus = useFocusStore.subscribe(() => {
      setFocusState({ ...useFocusStore.getState() });
    });
    const unsubPlanner = usePlannerStore.subscribe(() => {
      setPlannerTasks([...usePlannerStore.getState().tasks]);
    });
    return () => {
      unsubFocus();
      unsubPlanner();
    };
  }, []);

  // Pure automatic priority focus:
  // Active task is ALWAYS the highest-priority incomplete task (A-1 -> A-2 -> B-1 ...)
  const activeTask = React.useMemo(() => {
    const incomplete = plannerTasks.filter((t) => !t.completed);
    return incomplete[0] || null;
  }, [plannerTasks]);

  // Keep focusStore in sync for offline persistence
  useEffect(() => {
    const currentA1 = useFocusStore.getState().a1Task;
    const nextVal = activeTask ? { id: activeTask.id, title: activeTask.title } : null;
    if (currentA1?.id !== nextVal?.id || currentA1?.title !== nextVal?.title) {
      useFocusStore.getState().setA1Task(nextVal);
    }
  }, [activeTask]);

  const handleToggleTimer = () => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  };

  const handleCompleteTask = () => {
    if (activeTask) {
      usePlannerStore.getState().toggleTask(activeTask.id);
    }
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const task = plannerTasks.find((t) => t.id === taskId);
    if (!task || !task.subtasks) return;
    const nextSubtasks = task.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    usePlannerStore.getState().updateTask(taskId, { subtasks: nextSubtasks });
  };

  return (
    <ScreenContainer>
      {/* Top Header */}
      <ExecutiveHeader
        title="FOCUS 21"
        subtitle={t('focus.subtitle', { defaultValue: 'Executive OS' })}
        badge={
          <View style={styles.mantraBadge}>
            <VectorIcon name="activity" size={12} color={THEME.colors.accent} />
            <Text style={styles.mantraText}>
              {t('focus.doItNow', { defaultValue: 'DO IT NOW!' })}
            </Text>
          </View>
        }
      />

      {/* 90-Minute Timer Ring */}
      <TimerRing
        formattedTime={formattedTime}
        isRunning={isRunning}
        completedChunks={completedChunksCount}
        progress={progress}
      />

      {/* Primary Action Buttons */}
      <View style={styles.buttonContainer}>
        <ExecutiveButton
          title={
            isRunning
              ? t('focus.pause', { defaultValue: 'PAUSE FOCUS' })
              : t('focus.doItNow', { defaultValue: 'DO IT NOW!' })
          }
          icon={isRunning ? 'pause' : 'play'}
          variant="primary"
          size="lg"
          onPress={handleToggleTimer}
          style={styles.mainActionButton}
        />

        <ExecutiveButton
          title={t('focus.reset', { defaultValue: 'Reset' })}
          icon="rotate-ccw"
          variant="ghost"
          size="sm"
          onPress={reset}
          style={styles.resetButton}
        />
      </View>

      {/* [A-1] Single Handling Hero Card */}
      <HeroTaskCard
        task={activeTask}
        onSelectTask={() => setSelectModalVisible(true)}
        onCompleteTask={activeTask ? handleCompleteTask : undefined}
        onToggleSubtask={handleToggleSubtask}
      />

      {/* Daily Brian Tracy Principle Card */}
      <DailyPrincipleCard />

      {/* Select or Create [A-1] Task Modal */}
      <SelectA1TaskModal
        visible={selectModalVisible}
        onClose={() => setSelectModalVisible(false)}
        onSelectTask={(task) => {
          useFocusStore.getState().setA1Task(task);
        }}
        activeTaskId={activeTask?.id}
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
  mantraBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.accentMuted,
    borderWidth: 1,
    borderColor: THEME.colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radii.full,
  },
  mantraText: {
    color: THEME.colors.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginLeft: 5,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: THEME.spacing.sm,
  },
  mainActionButton: {
    width: '100%',
    maxWidth: 320,
    height: 52,
    borderRadius: THEME.radii.full,
  },
  resetButton: {
    marginTop: THEME.spacing.xs,
  },
});
