import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { THEME } from '../../constants/theme.ts';
import { t } from '../../services/i18n.ts';
import { VectorIcon } from '../../components/common/VectorIcon.tsx';
import { useAuditStore } from '../../store/auditStore.ts';

export const HourlyRateCalculator: React.FC = () => {
  const store = useAuditStore.getState();
  const [annualInput, setAnnualInput] = useState(store.annualTargetIncome.toString());

  const handleIncomeChange = (val: string) => {
    setAnnualInput(val);
    const numeric = parseInt(val.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(numeric) && numeric > 0) {
      useAuditStore.getState().setAnnualTargetIncome(numeric);
    }
  };

  const hourlyRate = store.hourlyRate;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <VectorIcon name="dollar-sign" size={16} color={THEME.colors.accent} />
          <View style={styles.titles}>
            <Text style={styles.title}>
              {t('audit.hourlyRateTitle', { defaultValue: 'Hourly Value & Delegation' })}
            </Text>
            <Text style={styles.subtitle}>
              {t('audit.hourlyRatePrinciple', { defaultValue: 'Principle #12: Annual Income ÷ 2,000 Hours' })}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.contentRow}>
        <View style={styles.inputBlock}>
          <Text style={styles.inputLabel}>
            {t('audit.annualTargetLabel', { defaultValue: 'DESIRED ANNUAL INCOME' })}
          </Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.currencyPrefix}>$</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={annualInput}
              onChangeText={handleIncomeChange}
            />
          </View>
        </View>

        <View style={styles.rateDisplayBlock}>
          <Text style={styles.rateLabel}>
            {t('audit.hourlyRateLabel', { defaultValue: 'HOURLY VALUE' })}
          </Text>
          <Text style={styles.rateValue}>${hourlyRate}/hr</Text>
        </View>
      </View>

      <View style={styles.ruleBanner}>
        <VectorIcon name="shield" size={13} color={THEME.colors.accent} />
        <Text style={styles.ruleText}>
          {t('audit.delegationRule', {
            rate: hourlyRate.toString(),
            defaultValue: `If you can outsource a task for less than $${hourlyRate}/hr, never do it yourself. Delegate it!`,
          })}
        </Text>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titles: {
    marginLeft: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: THEME.spacing.sm,
  },
  inputBlock: {
    flex: 1,
    marginRight: 12,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: THEME.colors.textSecondary,
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111317',
    borderRadius: THEME.radii.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 8,
    height: 42,
  },
  currencyPrefix: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.accent,
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  rateDisplayBlock: {
    backgroundColor: '#261F10',
    borderWidth: 1,
    borderColor: THEME.colors.accent,
    borderRadius: THEME.radii.md,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  rateLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: THEME.colors.accent,
  },
  rateValue: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.colors.accent,
    marginTop: 2,
  },
  ruleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171A21',
    borderRadius: THEME.radii.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    padding: 8,
    marginTop: 4,
  },
  ruleText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginLeft: 6,
    flex: 1,
    lineHeight: 15,
  },
});
