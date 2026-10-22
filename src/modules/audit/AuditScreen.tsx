import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ScreenContainer } from '../../components/common/ScreenContainer.tsx';
import { ExecutiveHeader } from '../../components/common/ExecutiveHeader.tsx';
import { THEME } from '../../constants/theme.ts';
import { useTranslation } from '../../services/i18n.ts';
import { HourlyRateCalculator } from './HourlyRateCalculator.tsx';
import { TRAFInbox } from './TRAFInbox.tsx';
import { TimeLogList } from './TimeLogList.tsx';
import { useAuditStore, TRAFCategory, TimeLogCategory } from '../../store/auditStore.ts';

export const AuditScreen: React.FC = () => {
  const { t } = useTranslation();
  const [auditState, setAuditState] = useState(() => useAuditStore.getState());

  useEffect(() => {
    const unsubscribe = useAuditStore.subscribe(() => {
      setAuditState({ ...useAuditStore.getState() });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddTraf = (title: string, category: TRAFCategory) => {
    useAuditStore.getState().addTrafItem(title, category);
  };

  const handleDeleteTraf = (id: string) => {
    useAuditStore.getState().deleteTrafItem(id);
  };

  const handleAddTimeLog = (activity: string, durationMinutes: number, category: TimeLogCategory) => {
    useAuditStore.getState().addTimeLog(activity, durationMinutes, category);
  };

  const handleDeleteTimeLog = (id: string) => {
    useAuditStore.getState().deleteTimeLog(id);
  };

  return (
    <ScreenContainer>
      {/* Top Header */}
      <ExecutiveHeader
        title={t('tabs.audit', { defaultValue: 'TIME AUDIT & TRIAGE' })}
        subtitle={t('audit.principleNote', { defaultValue: 'Principles #6, #11, #12 & #15' })}
      />

      {/* Hourly Rate & Delegation Calculator */}
      <HourlyRateCalculator />

      {/* TRAF Triage System */}
      <TRAFInbox
        items={auditState.trafItems}
        onAddItem={handleAddTraf}
        onDeleteItem={handleDeleteTraf}
      />

      {/* Minute-by-Minute Time Log */}
      <TimeLogList
        logs={auditState.timeLogs}
        onAddLog={handleAddTimeLog}
        onDeleteLog={handleDeleteTimeLog}
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
