import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { THEME } from '../constants/theme.ts';
import { useTranslation, SupportedLanguage } from '../services/i18n.ts';
import { useSettingsStore } from '../store/settingsStore.ts';
import { VectorIcon } from './common/VectorIcon.tsx';
import { ExecutiveButton } from './common/ExecutiveButton.tsx';
import { exportAllData, importAllData } from '../services/backup.ts';

export interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onLanguageChanged?: (lang: SupportedLanguage) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  onLanguageChanged,
}) => {
  const { t, language, setLanguage } = useTranslation();
  const [importText, setImportText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [backupCopied, setBackupCopied] = useState(false);

  const languages: { code: SupportedLanguage; label: string; sub: string }[] = [
    { code: 'uz', label: "O'zbekcha", sub: 'Lotin yozuvida' },
    { code: 'ru', label: 'Русский', sub: 'Полная локализация' },
    { code: 'en', label: 'English', sub: 'Original Tracy Edition' },
  ];

  const handleSelectLang = (code: SupportedLanguage) => {
    setLanguage(code);
    useSettingsStore.getState().setLanguage(code);
    if (onLanguageChanged) {
      onLanguageChanged(code);
    }
  };

  const handleExport = () => {
    const json = exportAllData();
    setImportText(json);
    setShowImportBox(true);
    setBackupCopied(true);
  };

  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    const ok = importAllData(importText.trim());
    if (ok) {
      Alert.alert(
        t('common.importSuccessTitle', { defaultValue: 'Restore Complete' }),
        t('common.importSuccessMsg', { defaultValue: 'All executive records have been successfully restored.' })
      );
      setShowImportBox(false);
      setImportText('');
    } else {
      Alert.alert(
        t('common.importErrorTitle', { defaultValue: 'Invalid Backup' }),
        t('common.importErrorMsg', { defaultValue: 'The JSON string is malformed or invalid.' })
      );
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <VectorIcon name="settings" size={18} color={THEME.colors.accent} />
              <Text style={styles.headerTitle}>
                {t('common.settings', { defaultValue: 'Executive Settings' })}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <VectorIcon name="x" size={20} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Language Selector */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                {t('common.language', { defaultValue: 'LANGUAGE (TIL / ЯЗЫК)' })}
              </Text>

              {languages.map((l) => (
                <TouchableOpacity
                  key={l.code}
                  style={[
                    styles.langRow,
                    language === l.code && styles.langRowActive,
                  ]}
                  onPress={() => handleSelectLang(l.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.langInfo}>
                    <Text
                      style={[
                        styles.langLabel,
                        language === l.code && styles.langLabelActive,
                      ]}
                    >
                      {l.label}
                    </Text>
                    <Text style={styles.langSub}>{l.sub}</Text>
                  </View>
                  {language === l.code && (
                    <VectorIcon name="check" size={16} color={THEME.colors.accent} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Offline Data Backup & Restore */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                {t('common.backupSection', { defaultValue: 'OFFLINE DATA & BACKUP' })}
              </Text>

              <View style={styles.backupButtonsRow}>
                <TouchableOpacity
                  style={styles.backupActionBtn}
                  onPress={handleExport}
                  activeOpacity={0.7}
                >
                  <VectorIcon name="download" size={14} color={THEME.colors.accent} />
                  <Text style={styles.backupBtnText}>
                    {t('common.export', { defaultValue: 'Export JSON' })}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backupActionBtn}
                  onPress={() => setShowImportBox(!showImportBox)}
                  activeOpacity={0.7}
                >
                  <VectorIcon name="upload" size={14} color="#60A5FA" />
                  <Text style={[styles.backupBtnText, { color: '#60A5FA' }]}>
                    {t('common.import', { defaultValue: 'Import JSON' })}
                  </Text>
                </TouchableOpacity>
              </View>

              {showImportBox && (
                <View style={styles.importBox}>
                  <Text style={styles.importBoxLabel}>
                    {backupCopied
                      ? t('common.exportNotice', { defaultValue: 'Your backup payload:' })
                      : t('common.pasteBackup', { defaultValue: 'Paste your JSON backup payload here:' })}
                  </Text>
                  <TextInput
                    style={styles.textArea}
                    multiline
                    value={importText}
                    onChangeText={setImportText}
                    placeholder="Paste JSON here..."
                    placeholderTextColor={THEME.colors.textTertiary}
                  />
                  {!backupCopied && (
                    <ExecutiveButton
                      title={t('common.restoreNow', { defaultValue: 'Restore Backup Now' })}
                      variant="primary"
                      size="sm"
                      onPress={handleImportSubmit}
                      style={{ marginTop: 8 }}
                    />
                  )}
                </View>
              )}
            </View>

            {/* Anti-Slop Thesis */}
            <View style={styles.thesisCard}>
              <VectorIcon name="shield" size={14} color={THEME.colors.accent} />
              <View style={styles.thesisContent}>
                <Text style={styles.thesisTitle}>Obsidian Executive OS</Text>
                <Text style={styles.thesisText}>
                  Built strictly according to Brian Tracy's 21 Time Management Principles. 100% offline, zero emojis, pure focus.
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <ExecutiveButton
              title={t('common.done', { defaultValue: 'Done' })}
              variant="secondary"
              size="md"
              onPress={onClose}
            />
          </View>
        </View>
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
  card: {
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
    marginBottom: THEME.spacing.md,
  },
  headerLeft: {
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
  scrollArea: {
    marginBottom: THEME.spacing.md,
  },
  section: {
    marginBottom: THEME.spacing.md,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: THEME.colors.textSecondary,
    marginBottom: 8,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111317',
    borderRadius: THEME.radii.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: 12,
    marginBottom: 6,
  },
  langRowActive: {
    borderColor: THEME.colors.accent,
    backgroundColor: '#1E190E',
  },
  langInfo: {
    flex: 1,
  },
  langLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
  },
  langLabelActive: {
    color: THEME.colors.accent,
  },
  langSub: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  backupButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  backupActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111317',
    borderRadius: THEME.radii.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingVertical: 10,
  },
  backupBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.accent,
    marginLeft: 6,
  },
  importBox: {
    marginTop: 10,
    backgroundColor: '#111317',
    borderRadius: THEME.radii.md,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  importBoxLabel: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginBottom: 6,
  },
  textArea: {
    backgroundColor: '#0D0E11',
    borderRadius: THEME.radii.sm,
    color: THEME.colors.textPrimary,
    fontSize: 11,
    fontFamily: 'monospace',
    padding: 8,
    maxHeight: 120,
    textAlignVertical: 'top',
  },
  thesisCard: {
    flexDirection: 'row',
    backgroundColor: '#15171D',
    borderRadius: THEME.radii.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    padding: 10,
    marginTop: 4,
  },
  thesisContent: {
    marginLeft: 8,
    flex: 1,
  },
  thesisTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textPrimary,
    marginBottom: 2,
  },
  thesisText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    lineHeight: 15,
  },
  footer: {
    paddingTop: THEME.spacing.xs,
  },
});
