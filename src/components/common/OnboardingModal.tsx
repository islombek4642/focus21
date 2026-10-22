import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme.ts';
import { useTranslation } from '../../services/i18n.ts';
import { VectorIcon } from './VectorIcon.tsx';
import { useSettingsStore } from '../../store/settingsStore.ts';

export interface OnboardingModalProps {
  visible: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      badge: 'PRINCIPLES #15 & #16',
      icon: 'clock',
      titleKey: 'onboarding.slide1Title',
      defaultTitle: '90-Minute Focus Chunk',
      descKey: 'onboarding.slide1Desc',
      defaultDesc: 'Single-handling on your most critical [A-1] task without interruption.',
      featureTag: 'Single Handling & Chunks of Time',
    },
    {
      badge: 'PRINCIPLES #3 & #4',
      icon: 'layers',
      titleKey: 'onboarding.slide2Title',
      defaultTitle: 'ABCDE & Pareto 80/20',
      descKey: 'onboarding.slide2Desc',
      defaultDesc: 'Isolate top 20% high-payoff tasks generating 80% of your results.',
      featureTag: 'ABCDE Prioritization & Evening Ritual',
    },
    {
      badge: 'PRINCIPLES #14 & #21',
      icon: 'shield',
      titleKey: 'onboarding.slide3Title',
      defaultTitle: 'TRAF Triage & Life Balance',
      descKey: 'onboarding.slide3Desc',
      defaultDesc: 'Handle inputs only once and maintain peak quality of life.',
      featureTag: 'TRAF Inbox & Wheel of Life',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    useSettingsStore.getState().setHasSeenOnboarding(true);
    useSettingsStore.getState().setOnboardingOpen(false);
    onClose();
  };

  const activeSlide = slides[currentSlide];

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <View style={styles.brandBadge}>
            <VectorIcon name="compass" size={14} color={THEME.colors.accent} />
            <Text style={styles.brandTitle}>FOCUS 21</Text>
          </View>
          <TouchableOpacity onPress={handleComplete} style={styles.skipBtn} activeOpacity={0.7}>
            <Text style={styles.skipText}>{t('onboarding.skipBtn', { defaultValue: 'Skip' })}</Text>
          </TouchableOpacity>
        </View>

        {/* Slide Content Card */}
        <View style={styles.contentArea}>
          {/* Main Visual Emblem */}
          <View style={styles.emblemContainer}>
            <View style={styles.outerGlowRing}>
              <View style={styles.innerEmblemBox}>
                <VectorIcon name={activeSlide.icon} size={42} color={THEME.colors.accent} />
              </View>
            </View>
          </View>

          {/* Principle Badge */}
          <View style={styles.principleBadge}>
            <Text style={styles.principleBadgeText}>{activeSlide.badge}</Text>
          </View>

          {/* Title & Desc */}
          <Text style={styles.title}>
            {t(activeSlide.titleKey, { defaultValue: activeSlide.defaultTitle })}
          </Text>
          <Text style={styles.description}>
            {t(activeSlide.descKey, { defaultValue: activeSlide.defaultDesc })}
          </Text>

          {/* Feature Tag */}
          <View style={styles.tagBox}>
            <VectorIcon name="check-circle" size={12} color={THEME.colors.accent} />
            <Text style={styles.tagText}>{activeSlide.featureTag}</Text>
          </View>
        </View>

        {/* Footer: Indicator & Next Button */}
        <View style={styles.footer}>
          {/* Dots Indicator */}
          <View style={styles.indicatorContainer}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  currentSlide === i && styles.dotActive,
                ]}
              />
            ))}
          </View>

          {/* Action Button */}
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.nextBtnText}>
              {currentSlide === slides.length - 1
                ? t('onboarding.finishBtn', { defaultValue: 'Get Started' })
                : t('onboarding.nextBtn', { defaultValue: 'Next' })}
            </Text>
            <VectorIcon
              name={currentSlide === slides.length - 1 ? 'check' : 'chevron-right'}
              size={16}
              color="#000000"
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.canvas,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: 50,
    paddingBottom: 36,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(229, 169, 60, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radii.full,
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.25)',
  },
  brandTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.accent,
    letterSpacing: 1.5,
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  skipText: {
    fontSize: 13,
    color: THEME.colors.textTertiary,
    fontWeight: '600',
  },
  contentArea: {
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
  },
  emblemContainer: {
    marginBottom: 28,
  },
  outerGlowRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(229, 169, 60, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.18)',
  },
  innerEmblemBox: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#161922',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.35)',
  },
  principleBadge: {
    backgroundColor: '#1C202B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radii.full,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 12,
  },
  principleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: THEME.colors.accent,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  tagBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#12141A',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: THEME.radii.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  tagText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    gap: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#262A36',
  },
  dotActive: {
    width: 22,
    backgroundColor: THEME.colors.accent,
  },
  nextBtn: {
    width: '100%',
    height: 48,
    backgroundColor: THEME.colors.accent,
    borderRadius: THEME.radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 0.5,
  },
});
