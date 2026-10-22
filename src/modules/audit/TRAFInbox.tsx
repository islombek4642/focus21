import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme.ts';
import { useTranslation } from '../../services/i18n.ts';
import { VectorIcon } from '../../components/common/VectorIcon.tsx';
import { TRAFItem, TRAFCategory } from '../../store/auditStore.ts';

export interface TRAFInboxProps {
  items: TRAFItem[];
  onAddItem: (title: string, category: TRAFCategory) => void;
  onDeleteItem: (id: string) => void;
}

export const TRAFInbox: React.FC<TRAFInboxProps> = ({ items, onAddItem, onDeleteItem }) => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TRAFCategory>('action');

  const handleDispatch = (cat: TRAFCategory) => {
    if (inputText.trim()) {
      onAddItem(inputText.trim(), cat);
      setInputText('');
    }
  };

  const getCategoryDetails = (cat: TRAFCategory) => {
    switch (cat) {
      case 'toss':
        return {
          label: t('audit.trafToss', { defaultValue: 'Toss' }),
          icon: 'trash-2',
          color: THEME.colors.danger,
          bg: '#2A1010',
          desc: t('audit.trafTossDesc', { defaultValue: 'Darhol tashlash' }),
        };
      case 'refer':
        return {
          label: t('audit.trafRefer', { defaultValue: 'Refer' }),
          icon: 'share-2',
          color: '#F97316',
          bg: '#2B1A0D',
          desc: t('audit.trafReferDesc', { defaultValue: 'Boshqalarga topshirish' }),
        };
      case 'action':
        return {
          label: t('audit.trafAction', { defaultValue: 'Action' }),
          icon: 'check-circle',
          color: THEME.colors.accent,
          bg: '#261F10',
          desc: t('audit.trafActionDesc', { defaultValue: '[A] rejaga kiritish' }),
        };
      case 'file':
      default:
        return {
          label: t('audit.trafFile', { defaultValue: 'File' }),
          icon: 'folder',
          color: '#60A5FA',
          bg: '#14223A',
          desc: t('audit.trafFileDesc', { defaultValue: 'Arxivga saqlash' }),
        };
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <VectorIcon name="inbox" size={16} color={THEME.colors.accent} />
          <View style={styles.titles}>
            <Text style={styles.title}>
              {t('audit.trafTitle', { defaultValue: 'TRAF Triage System' })}
            </Text>
            <Text style={styles.subtitle}>
              {t('audit.trafSubtitle', { defaultValue: 'Principle #11: Toss, Refer, Action, File' })}
            </Text>
          </View>
        </View>
      </View>

      {/* Input Row */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder={t('audit.trafPlaceholder', {
            defaultValue: 'Incoming document, memo, or request...',
          })}
          placeholderTextColor={THEME.colors.textTertiary}
          value={inputText}
          onChangeText={setInputText}
        />
      </View>

      {/* 4 Dispatch Buttons (2x2 Responsive Grid) */}
      <View style={styles.buttonsGrid}>
        {(['toss', 'refer', 'action', 'file'] as TRAFCategory[]).map((cat) => {
          const d = getCategoryDetails(cat);
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.triageBtn, { backgroundColor: d.bg, borderColor: d.color }]}
              onPress={() => handleDispatch(cat)}
              activeOpacity={0.7}
            >
              <VectorIcon name={d.icon} size={15} color={d.color} />
              <View style={styles.triageBtnInfo}>
                <Text style={[styles.triageBtnText, { color: d.color }]}>{d.label}</Text>
                <Text style={styles.triageBtnDesc} numberOfLines={1}>{d.desc}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Items List */}
      <View style={styles.itemsList}>
        {items.length === 0 ? (
          <Text style={styles.emptyText}>
            {t('audit.trafEmpty', { defaultValue: 'Inbox zero. Triage incoming items instantly.' })}
          </Text>
        ) : (
          items.slice(0, 5).map((item) => {
            const d = getCategoryDetails(item.category);
            return (
              <View key={item.id} style={styles.itemRow}>
                <View style={[styles.catBadge, { backgroundColor: d.bg, borderColor: d.color }]}>
                  <Text style={[styles.catBadgeText, { color: d.color }]}>{d.label}</Text>
                </View>
                <Text style={styles.itemText}>{item.title}</Text>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => onDeleteItem(item.id)}
                  activeOpacity={0.7}
                >
                  <VectorIcon name="x" size={13} color={THEME.colors.textTertiary} />
                </TouchableOpacity>
              </View>
            );
          })
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
  inputContainer: {
    backgroundColor: '#111317',
    borderRadius: THEME.radii.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  textInput: {
    height: 40,
    color: THEME.colors.textPrimary,
    fontSize: 13,
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: THEME.spacing.sm,
  },
  triageBtn: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: THEME.radii.md,
    borderWidth: 1,
    gap: 7,
  },
  triageBtnInfo: {
    flex: 1,
    minWidth: 0,
  },
  triageBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  triageBtnDesc: {
    fontSize: 9,
    color: THEME.colors.textSecondary,
    marginTop: 1,
  },
  itemsList: {
    marginTop: 4,
  },
  emptyText: {
    fontSize: 12,
    color: THEME.colors.textTertiary,
    fontStyle: 'italic',
    paddingVertical: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  catBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radii.sm,
    borderWidth: 1,
    marginRight: 8,
    minWidth: 46,
    alignItems: 'center',
  },
  catBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  itemText: {
    flex: 1,
    fontSize: 13,
    color: THEME.colors.textPrimary,
  },
  deleteBtn: {
    padding: 4,
    marginLeft: 6,
  },
});
