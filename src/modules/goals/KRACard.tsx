import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme.ts';
import { useTranslation } from '../../services/i18n.ts';
import { VectorIcon } from '../../components/common/VectorIcon.tsx';
import { KRAItem } from '../../store/goalsStore.ts';

export interface KRACardProps {
  kraList: KRAItem[];
  onAddKra: (title: string, rank?: number) => void;
  onDeleteKra: (id: string) => void;
}

export const KRACard: React.FC<KRACardProps> = ({ kraList, onAddKra, onDeleteKra }) => {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = () => {
    if (newTitle.trim()) {
      onAddKra(newTitle.trim(), kraList.length + 1);
      setNewTitle('');
      setIsAdding(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <VectorIcon name="target" size={16} color={THEME.colors.accent} />
          <View style={styles.headerTitles}>
            <Text style={styles.title}>
              {t('goals.kraTitle', { defaultValue: 'Key Result Areas (KRAs)' })}
            </Text>
            <Text style={styles.subtitle}>
              {t('goals.kraSubtitle', { defaultValue: 'Principle #14: "Why am I on the payroll?"' })}
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

      {isAdding && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={t('goals.kraPlaceholder', {
              defaultValue: 'e.g. Closing enterprise deals, product quality...',
            })}
            placeholderTextColor={THEME.colors.textTertiary}
            value={newTitle}
            onChangeText={setNewTitle}
            onSubmitEditing={handleAdd}
            autoFocus
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
            <VectorIcon name="check" size={16} color={THEME.colors.canvas} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.list}>
        {kraList.length === 0 && !isAdding ? (
          <Text style={styles.emptyText}>
            {t('goals.kraEmpty', {
              defaultValue: 'Identify the 5 to 7 specific output results required for your success.',
            })}
          </Text>
        ) : (
          kraList.map((item, index) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => onDeleteKra(item.id)}
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitles: {
    marginLeft: 8,
    flex: 1,
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
  list: {
    marginTop: 4,
  },
  emptyText: {
    fontSize: 12,
    color: THEME.colors.textTertiary,
    fontStyle: 'italic',
    paddingVertical: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  rankBadge: {
    width: 22,
    height: 22,
    borderRadius: THEME.radii.full,
    backgroundColor: '#261F10',
    borderWidth: 1,
    borderColor: THEME.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.accent,
  },
  itemTitle: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.textPrimary,
  },
  deleteBtn: {
    padding: 4,
    marginLeft: 6,
  },
});
