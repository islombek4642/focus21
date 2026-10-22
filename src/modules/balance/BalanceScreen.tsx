import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer.tsx';
import { ExecutiveHeader } from '../../components/common/ExecutiveHeader.tsx';
import { THEME } from '../../constants/theme.ts';
import { useTranslation } from '../../services/i18n.ts';
import { WheelOfLifeRadar } from './WheelOfLifeRadar.tsx';
import { FamilyTimeTracker } from './FamilyTimeTracker.tsx';
import { SayingNoJournal } from './SayingNoJournal.tsx';
import { useBalanceStore } from '../../store/balanceStore.ts';

export const BalanceScreen: React.FC = () => {
  const { t } = useTranslation();
  const [balanceState, setBalanceState] = useState(() => useBalanceStore.getState());

  useEffect(() => {
    const unsubscribe = useBalanceStore.subscribe(() => {
      setBalanceState({ ...useBalanceStore.getState() });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleUpdateScore = (pillar: string, score: number) => {
    useBalanceStore.getState().setScore(pillar, score);
  };

  const handleAddFamilyMinutes = (minutes: number) => {
    useBalanceStore.getState().addFamilyMinutes(minutes);
  };

  const handleAddSayingNo = (request: string, reason?: string) => {
    useBalanceStore.getState().addSayingNoEntry(request, reason);
  };

  const averageScore = useBalanceStore.getState().getAverageScore();

  return (
    <ScreenContainer>
      {/* Top Header */}
      <ExecutiveHeader
        title={t('tabs.balance', { defaultValue: 'EXECUTIVE BALANCE' })}
        subtitle={t('balance.principleNote', { defaultValue: 'Principles #10, #19 & #20' })}
      />

      {/* Wheel of Life Radar */}
      <WheelOfLifeRadar
        scores={balanceState.scores}
        averageScore={averageScore}
        onUpdateScore={handleUpdateScore}
      />

      {/* Family Undivided Attention Tracker */}
      <FamilyTimeTracker
        minutesToday={balanceState.familyMinutesToday}
        onAddMinutes={handleAddFamilyMinutes}
      />

      {/* Saying No Boundary Journal */}
      <SayingNoJournal
        entries={balanceState.sayingNoEntries}
        onAddEntry={handleAddSayingNo}
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
});
