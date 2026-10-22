import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme.ts';
import { t } from '../../services/i18n.ts';
import { VectorIcon } from '../../components/common/VectorIcon.tsx';

export interface SayingNoJournalProps {
  entries: Array<{ id: string; request: string; reason: string }>;
  onAddEntry: (request: string, reason?: string) => void;
}

export const SayingNoJournal: React.FC<SayingNoJournalProps> = ({ entries, onAddEntry }) => {
  const [requestText, setRequestText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleLog = () => {
    if (requestText.trim()) {
      onAddEntry(requestText.trim());
      setRequestText('');
      setIsAdding(false);
    }
  };

  const scripts = [
    t('balance.script1', {
      defaultValue: 'Thank you for thinking of me, but my current commitments do not permit this.',
    }),
    t('balance.script2', {
      defaultValue: 'I am 100% focused on completing our A-1 strategic goal and cannot take anything on.',
    }),
  ];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <VectorIcon name="shield" size={16} color={THEME.colors.accent} />
          <View style={styles.titles}>
            <Text style={styles.title}>
              {t('balance.sayingNoTitle', { defaultValue: 'Learn to Say NO (Principle #10)' })}
            </Text>
            <Text style={styles.subtitle}>
              {t('balance.sayingNoSubtitle', { defaultValue: 'The ultimate executive time management weapon' })}
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

      {/* Diplomatic Refusal Scripts */}
      <View style={styles.scriptsBlock}>
        <Text style={styles.scriptsHeader}>
          {t('balance.scriptsHeader', { defaultValue: 'EXECUTIVE DIPLOMATIC SCRIPTS:' })}
        </Text>
        {scripts.map((script, idx) => (
          <View key={idx} style={styles.scriptItem}>
            <VectorIcon name="corner-down-right" size={11} color={THEME.colors.accent} />
            <Text style={styles.scriptText}>"{script}"</Text>
          </View>
        ))}
      </View>

      {/* Add Entry Input */}
      {isAdding && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={t('balance.declinedPlaceholder', {
              defaultValue: 'What non-essential request did you decline today?',
            })}
            placeholderTextColor={THEME.colors.textTertiary}
            value={requestText}
            onChangeText={setRequestText}
            onSubmitEditing={handleLog}
            autoFocus
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleLog}>
            <VectorIcon name="check" size={16} color={THEME.colors.canvas} />
          </TouchableOpacity>
        </View>
      )}

      {/* Entries List */}
      <View style={styles.entriesList}>
        {entries.length === 0 && !isAdding ? (
          <Text style={styles.emptyText}>
            {t('balance.emptySayingNo', {
              defaultValue: 'No declinations recorded yet. Saying NO frees up hours of your life.',
            })}
          </Text>
        ) : (
          entries.slice(0, 4).map((entry) => (
            <View key={entry.id} style={styles.entryRow}>
              <View style={styles.noBadge}>
                <Text style={styles.noBadgeText}>NO</Text>
              </View>
              <Text style={styles.entryText}>{entry.request}</Text>
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
  addBtn: {
    padding: 6,
  },
  scriptsBlock: {
    backgroundColor: '#111317',
    borderRadius: THEME.radii.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: 10,
    marginBottom: 10,
  },
  scriptsHeader: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: THEME.colors.accent,
    marginBottom: 6,
  },
  scriptItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  scriptText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontStyle: 'italic',
    marginLeft: 6,
    flex: 1,
    lineHeight: 15,
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
  entriesList: {
    marginTop: 2,
  },
  emptyText: {
    fontSize: 12,
    color: THEME.colors.textTertiary,
    fontStyle: 'italic',
    paddingVertical: 4,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  noBadge: {
    backgroundColor: '#301313',
    borderWidth: 1,
    borderColor: THEME.colors.danger,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: THEME.radii.sm,
    marginRight: 8,
  },
  noBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.danger,
  },
  entryText: {
    flex: 1,
    fontSize: 12,
    color: THEME.colors.textPrimary,
  },
});
