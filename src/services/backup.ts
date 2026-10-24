/**
 * Backup Service
 * Exports and imports all Focus 21 Executive OS state to/from JSON
 */

import { usePlannerStore } from '../store/plannerStore.ts';
import { useGoalsStore } from '../store/goalsStore.ts';
import { useAuditStore } from '../store/auditStore.ts';
import { useBalanceStore } from '../store/balanceStore.ts';

export interface AppBackupPayload {
  version: number;
  exportedAt: number;
  planner: {
    tasks: any[];
  };
  goals: {
    goals: any[];
    goldenQuestions: any;
    kraList: any[];
  };
  audit: {
    trafItems: any[];
    timeLogs: any[];
    annualTargetIncome: number;
    hourlyRate: number;
  };
  balance: {
    wheelScores: any;
    familyMinutesToday: number;
    refusals: any[];
  };
}

export function exportAllData(): string {
  const payload: AppBackupPayload = {
    version: 1,
    exportedAt: Date.now(),
    planner: {
      tasks: usePlannerStore.getState().tasks,
    },
    goals: {
      goals: useGoalsStore.getState().goals,
      goldenQuestions: useGoalsStore.getState().goldenQuestions,
      kraList: useGoalsStore.getState().kraList,
    },
    audit: {
      trafItems: useAuditStore.getState().trafItems,
      timeLogs: useAuditStore.getState().timeLogs,
      annualTargetIncome: useAuditStore.getState().annualTargetIncome,
      hourlyRate: useAuditStore.getState().hourlyRate,
    },
    balance: {
      wheelScores: useBalanceStore.getState().wheelScores,
      familyMinutesToday: useBalanceStore.getState().familyMinutesToday,
      refusals: useBalanceStore.getState().refusals,
    },
  };

  return JSON.stringify(payload, null, 2);
}

export function importAllData(jsonString: string): boolean {
  try {
    const data: AppBackupPayload = JSON.parse(jsonString);

    if (!data || typeof data !== 'object' || !data.version) {
      return false;
    }

    if (data.planner && Array.isArray(data.planner.tasks)) {
      usePlannerStore.getState().setTasks(data.planner.tasks);
    }

    if (data.goals) {
      if (Array.isArray(data.goals.goals)) {
        useGoalsStore.getState().setGoals(data.goals.goals);
      }
      if (Array.isArray(data.goals.kraList)) {
        useGoalsStore.getState().setKraList(data.goals.kraList);
      }
      if (data.goals.goldenQuestions) {
        for (const [k, v] of Object.entries(data.goals.goldenQuestions)) {
          useGoalsStore.getState().setGoldenQuestionAnswer(k as any, String(v));
        }
      }
    }

    if (data.audit) {
      if (Array.isArray(data.audit.trafItems)) {
        useAuditStore.getState().setTrafItems(data.audit.trafItems);
      }
      if (Array.isArray(data.audit.timeLogs)) {
        useAuditStore.getState().setTimeLogs(data.audit.timeLogs);
      }
      if (data.audit.annualTargetIncome) {
        useAuditStore.getState().setAnnualTargetIncome(data.audit.annualTargetIncome);
      }
    }

    if (data.balance) {
      if (data.balance.wheelScores) {
        useBalanceStore.getState().setWheelScores(data.balance.wheelScores);
      }
      if (typeof data.balance.familyMinutesToday === 'number') {
        useBalanceStore.getState().setFamilyMinutesToday(data.balance.familyMinutesToday);
      }
      if (Array.isArray(data.balance.refusals)) {
        useBalanceStore.getState().setRefusals(data.balance.refusals);
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}
