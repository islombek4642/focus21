import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { THEME } from '../../constants/theme.ts';
import { useTranslation } from '../../services/i18n.ts';
import { VectorIcon } from '../../components/common/VectorIcon.tsx';
import { ExecutiveButton } from '../../components/common/ExecutiveButton.tsx';
import { useGoalsStore, GoldenQuestions } from '../../store/goalsStore.ts';

export interface GoldenQuestionsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const GoldenQuestionsModal: React.FC<GoldenQuestionsModalProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState<GoldenQuestions>({
    q1Lottery: '',
    q2SixMonths: '',
    q3DareToDream: '',
  });

  useEffect(() => {
    if (visible) {
      const stored = useGoalsStore.getState().goldenQuestions;
      setAnswers({
        q1Lottery: stored.q1Lottery || '',
        q2SixMonths: stored.q2SixMonths || '',
        q3DareToDream: stored.q3DareToDream || stored.q3NoFailure || '',
      });
    }
  }, [visible]);

  const handleSave = () => {
    const store = useGoalsStore.getState();
    store.setGoldenQuestionAnswer('q1Lottery', answers.q1Lottery);
    store.setGoldenQuestionAnswer('q2SixMonths', answers.q2SixMonths);
    store.setGoldenQuestionAnswer('q3DareToDream', answers.q3DareToDream);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
        >
          <View style={styles.modalCard}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <VectorIcon name="help-circle" size={18} color={THEME.colors.accent} />
              <Text style={styles.headerTitle}>
                {t('goals.goldenQuestionsTitle', { defaultValue: '3 Golden Questions' })}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <VectorIcon name="x" size={20} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.quoteSubtitle}>
            {t('goals.goldenQuestionsQuote', {
              defaultValue: 'Brian Tracy Principle #1: Instant Clarifiers for Ultimate Purpose',
            })}
          </Text>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Q1: $1,000,000 */}
            <View style={styles.questionBlock}>
              <View style={styles.questionLabelRow}>
                <VectorIcon name="dollar-sign" size={14} color={THEME.colors.accent} />
                <Text style={styles.questionLabel}>
                  {t('goals.q1Label', { defaultValue: '1. What if you won $1,000,000 tax-free today?' })}
                </Text>
              </View>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={3}
                placeholder={t('goals.q1Placeholder', {
                  defaultValue: 'Write how you would allocate your resources and time...',
                })}
                placeholderTextColor={THEME.colors.textTertiary}
                value={answers.q1Lottery}
                onChangeText={(text) => setAnswers((prev) => ({ ...prev, q1Lottery: text }))}
              />
            </View>

            {/* Q2: 6 Months to Live */}
            <View style={styles.questionBlock}>
              <View style={styles.questionLabelRow}>
                <VectorIcon name="clock" size={14} color={THEME.colors.badgeBlue} />
                <Text style={styles.questionLabel}>
                  {t('goals.q2Label', { defaultValue: '2. What if you had only 6 months left to live?' })}
                </Text>
              </View>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={3}
                placeholder={t('goals.q2Placeholder', {
                  defaultValue: 'Who would you spend time with? What would you stop doing immediately?',
                })}
                placeholderTextColor={THEME.colors.textTertiary}
                value={answers.q2SixMonths}
                onChangeText={(text) => setAnswers((prev) => ({ ...prev, q2SixMonths: text }))}
              />
            </View>

            {/* Q3: Dare to Dream */}
            <View style={styles.questionBlock}>
              <View style={styles.questionLabelRow}>
                <VectorIcon name="award" size={14} color={THEME.colors.success} />
                <Text style={styles.questionLabel}>
                  {t('goals.q3Label', {
                    defaultValue: '3. What one great thing would you dare to dream if you could not fail?',
                  })}
                </Text>
              </View>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={3}
                placeholder={t('goals.q3Placeholder', {
                  defaultValue: 'Your single ultimate audacious goal...',
                })}
                placeholderTextColor={THEME.colors.textTertiary}
                value={answers.q3DareToDream}
                onChangeText={(text) => setAnswers((prev) => ({ ...prev, q3DareToDream: text }))}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <ExecutiveButton
              title={t('common.saveAnswers', { defaultValue: 'Save & Commit' })}
              variant="primary"
              size="md"
              onPress={handleSave}
            />
          </View>
        </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  keyboardAvoid: {
    width: '100%',
  },
  modalCard: {
    backgroundColor: THEME.colors.card,
    borderTopLeftRadius: THEME.radii.lg + 4,
    borderTopRightRadius: THEME.radii.lg + 4,
    borderTopWidth: 1,
    borderColor: THEME.colors.border,
    padding: THEME.spacing.md,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginLeft: 8,
  },
  closeBtn: {
    padding: 4,
  },
  quoteSubtitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.md,
  },
  scrollView: {
    marginBottom: THEME.spacing.md,
  },
  questionBlock: {
    marginBottom: THEME.spacing.md,
  },
  questionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  questionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
    marginLeft: 6,
    flex: 1,
  },
  textArea: {
    backgroundColor: THEME.colors.cardDark,
    borderRadius: THEME.radii.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: 10,
    color: THEME.colors.textPrimary,
    fontSize: 13,
    minHeight: 65,
    textAlignVertical: 'top',
  },
  footer: {
    paddingTop: THEME.spacing.xs,
  },
});
