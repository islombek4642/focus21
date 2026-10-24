import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer.tsx';
import { ExecutiveHeader } from '../../components/common/ExecutiveHeader.tsx';
import { THEME } from '../../constants/theme.ts';
import { useTranslation } from '../../services/i18n.ts';
import { VectorIcon } from '../../components/common/VectorIcon.tsx';
import { SphereCard } from './SphereCard.tsx';
import { GoldenQuestionsModal } from './GoldenQuestionsModal.tsx';
import { KRACard } from './KRACard.tsx';
import { useGoalsStore, GoalSphere } from '../../store/goalsStore.ts';

export const GoalsScreen: React.FC = () => {
  const { t } = useTranslation();
  const [goalsState, setGoalsState] = useState(() => useGoalsStore.getState());
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = useGoalsStore.subscribe(() => {
      setGoalsState({ ...useGoalsStore.getState() });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddGoal = (sphere: GoalSphere, title: string) => {
    useGoalsStore.getState().addGoal(sphere, title);
  };

  const handleToggleGoal = (id: string) => {
    useGoalsStore.getState().toggleGoal(id);
  };

  const handleDeleteGoal = (id: string) => {
    useGoalsStore.getState().deleteGoal(id);
  };

  const handleAddKra = (title: string, rank?: number) => {
    useGoalsStore.getState().addKra(title, rank);
  };

  const handleDeleteKra = (id: string) => {
    useGoalsStore.getState().deleteKra(id);
  };

  const familyGoals = goalsState.goals.filter((g) => g.sphere === 'family');
  const businessGoals = goalsState.goals.filter((g) => g.sphere === 'business');
  const selfGoals = goalsState.goals.filter((g) => g.sphere === 'self');

  const hasGoldenAnswers = Boolean(
    goalsState.goldenQuestions.q1Lottery ||
      goalsState.goldenQuestions.q2SixMonths ||
      goalsState.goldenQuestions.q3DareToDream
  );

  return (
    <ScreenContainer>
      {/* Top Header */}
      <ExecutiveHeader
        title={t('tabs.goals', { defaultValue: 'GOALS & PURPOSE' })}
        subtitle={t('goals.principleNote', { defaultValue: 'Principles #1, #12 & #19' })}
        badge={
          <TouchableOpacity
            style={styles.clarifierBtn}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <VectorIcon name="help-circle" size={13} color={THEME.colors.accent} />
            <Text style={styles.clarifierBtnText}>
              {hasGoldenAnswers
                ? t('goals.viewClarifiers', { defaultValue: '3 Questions' })
                : t('goals.openClarifiers', { defaultValue: 'Clarify' })}
            </Text>
          </TouchableOpacity>
        }
      />

      {/* Golden Questions Callout */}
      <TouchableOpacity
        style={styles.goldenBanner}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <View style={styles.goldenBannerRow}>
          <View style={styles.goldenIconBox}>
            <VectorIcon name="award" size={16} color={THEME.colors.accent} />
          </View>
          <View style={styles.goldenContent}>
            <Text style={styles.goldenTitle}>
              {t('goals.goldenQuestionsBannerTitle', { defaultValue: '3 Golden Instant Clarifiers' })}
            </Text>
            <Text style={styles.goldenSubtitle}>
              {hasGoldenAnswers
                ? t('goals.goldenCompletedText', { defaultValue: 'Answers committed. Tap to review or edit.' })
                : t('goals.goldenIncompleteText', { defaultValue: 'Clarify what you want in 30 seconds.' })}
            </Text>
          </View>
          <VectorIcon name="chevron-right" size={16} color={THEME.colors.textSecondary} />
        </View>
      </TouchableOpacity>

      {/* 3 Spheres */}
      <SphereCard
        sphere="family"
        title={t('goals.sphereFamily', { defaultValue: 'Family & Personal' })}
        icon="users"
        goals={familyGoals}
        onAddGoal={(title) => handleAddGoal('family', title)}
        onToggleGoal={handleToggleGoal}
        onDeleteGoal={handleDeleteGoal}
      />

      <SphereCard
        sphere="business"
        title={t('goals.sphereBusiness', { defaultValue: 'Business, Career & Financial' })}
        icon="briefcase"
        goals={businessGoals}
        onAddGoal={(title) => handleAddGoal('business', title)}
        onToggleGoal={handleToggleGoal}
        onDeleteGoal={handleDeleteGoal}
      />

      <SphereCard
        sphere="self"
        title={t('goals.sphereSelf', { defaultValue: 'Self-development & Health' })}
        icon="book-open"
        goals={selfGoals}
        onAddGoal={(title) => handleAddGoal('self', title)}
        onToggleGoal={handleToggleGoal}
        onDeleteGoal={handleDeleteGoal}
      />

      {/* Key Result Areas */}
      <KRACard
        kraList={goalsState.kraList}
        onAddKra={handleAddKra}
        onDeleteKra={handleDeleteKra}
      />

      {/* Modal */}
      <GoldenQuestionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
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
  clarifierBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.accentMuted,
    borderWidth: 1,
    borderColor: THEME.colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radii.full,
  },
  clarifierBtnText: {
    color: THEME.colors.accent,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  goldenBanner: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.3)',
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  goldenBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goldenIconBox: {
    width: 34,
    height: 34,
    borderRadius: THEME.radii.md,
    backgroundColor: THEME.colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  goldenContent: {
    flex: 1,
  },
  goldenTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  goldenSubtitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
});
