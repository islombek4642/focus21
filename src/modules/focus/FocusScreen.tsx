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
    start,
    pause,
    reset,
  } = useFocusTimer();

  const [activeTask, setActiveTask] = useState<{ id: string; title: string } | null>(null);
  const [selectModalVisible, setSelectModalVisible] = useState(false);

  // Sync active task from planner or focusStore
  useEffect(() => {
    const focusState = useFocusStore.getState();
    if (focusState.a1Task) {
      setActiveTask(focusState.a1Task);
      return;
    }

    // Auto-select first A1 task or first task from plannerStore
    const plannerTasks = usePlannerStore.getState().tasks;
    const a1 = plannerTasks.find((task) => !task.completed && task.priority === 'A' && task.priorityRank === 1);
    const anyA = plannerTasks.find((task) => !task.completed && task.priority === 'A');
    const firstTask = plannerTasks.find((task) => !task.completed);

    const candidate = a1 || anyA || firstTask;
    if (candidate) {
      const taskObj = { id: candidate.id, title: candidate.title };
      setActiveTask(taskObj);
      useFocusStore.getState().setA1Task(taskObj);
    }
  }, []);

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
      useFocusStore.getState().setA1Task(null);
      setActiveTask(null);
    }
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
      />

      {/* Daily Brian Tracy Principle Card */}
      <DailyPrincipleCard />

      {/* Select or Create [A-1] Task Modal */}
      <SelectA1TaskModal
        visible={selectModalVisible}
        onClose={() => setSelectModalVisible(false)}
        onSelectTask={(task) => {
          setActiveTask(task);
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
    backgroundColor: '#261F10',
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
