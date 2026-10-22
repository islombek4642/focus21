import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
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
  const scrollViewRef = useRef<React.ElementRef<typeof ScrollView>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

  // Sync current slide index as user scrolls across thresholds
  useEffect(() => {
    const listenerId = scrollX.addListener(({ value }) => {
      const pageIndex = Math.round(value / SCREEN_WIDTH);
      if (pageIndex >= 0 && pageIndex < slides.length) {
        setCurrentSlide((prev) => (prev !== pageIndex ? pageIndex : prev));
      }
    });
    return () => {
      scrollX.removeListener(listenerId);
    };
  }, [SCREEN_WIDTH, slides.length]);

  // Reset scroll position and state when modal becomes visible
  useEffect(() => {
    if (visible) {
      setCurrentSlide(0);
      scrollX.setValue(0);
      scrollViewRef.current?.scrollTo({ x: 0, animated: false });
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  const goToSlide = (nextIndex: number) => {
    if (nextIndex >= 0 && nextIndex < slides.length) {
      setCurrentSlide(nextIndex);
      scrollViewRef.current?.scrollTo({ x: nextIndex * SCREEN_WIDTH, animated: true });
    }
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    useSettingsStore.getState().setHasSeenOnboarding(true);
    useSettingsStore.getState().setOnboardingOpen(false);
    onClose();
  };

  return (
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

      {/* Horizontal Swipeable Slides with Liquid Transitions */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment="center"
        overScrollMode="never"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={styles.scrollContent}
      >
        {slides.map((slide, index) => {
          const inputRange = [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ];

          // Smooth depth scale & opacity interpolation per card
          const cardScale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
          });

          const cardOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.35, 1, 0.35],
            extrapolate: 'clamp',
          });

          const emblemTranslateY = scrollX.interpolate({
            inputRange,
            outputRange: [14, 0, 14],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.slideCard,
                {
                  width: SCREEN_WIDTH,
                  opacity: cardOpacity,
                  transform: [{ scale: cardScale }],
                },
              ]}
            >
              {/* Luxury Emblem with vertical float */}
              <Animated.View
                style={[
                  styles.emblemContainer,
                  { transform: [{ translateY: emblemTranslateY }] },
                ]}
              >
                <View style={styles.outerGlowRing}>
                  <View style={styles.innerEmblemBox}>
                    <VectorIcon name={slide.icon} size={42} color={THEME.colors.accent} />
                  </View>
                </View>
              </Animated.View>

              {/* Principle Badge */}
              <View style={styles.principleBadge}>
                <Text style={styles.principleBadgeText}>{slide.badge}</Text>
              </View>

              {/* Title & Desc */}
              <Text style={styles.title}>
                {t(slide.titleKey, { defaultValue: slide.defaultTitle })}
              </Text>
              <Text style={styles.description}>
                {t(slide.descKey, { defaultValue: slide.defaultDesc })}
              </Text>

              {/* Feature Tag */}
              <View style={styles.tagBox}>
                <VectorIcon name="check-circle" size={12} color={THEME.colors.accent} />
                <Text style={styles.tagText}>{slide.featureTag}</Text>
              </View>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Footer: Liquid Morphing Dots & Next Button */}
      <View style={styles.footer}>
        {/* Dynamic Liquid Dots Indicator */}
        <View style={styles.indicatorContainer}>
          {slides.map((_, i) => {
            const inputRange = [
              (i - 1) * SCREEN_WIDTH,
              i * SCREEN_WIDTH,
              (i + 1) * SCREEN_WIDTH,
            ];

            // Fluid width morph: 8px idle -> 26px active pill -> 8px idle
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 26, 8],
              extrapolate: 'clamp',
            });

            // Smooth opacity transition
            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.35, 1, 0.35],
              extrapolate: 'clamp',
            });

            // Smooth color morph from dark slate to brilliant gold
            const dotColor = scrollX.interpolate({
              inputRange,
              outputRange: ['#2A2E3D', THEME.colors.accent, '#2A2E3D'],
              extrapolate: 'clamp',
            });

            return (
              <TouchableOpacity
                key={i}
                onPress={() => goToSlide(i)}
                activeOpacity={0.7}
                hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
              >
                <Animated.View
                  style={[
                    styles.dot,
                    {
                      width: dotWidth,
                      opacity: dotOpacity,
                      backgroundColor: dotColor,
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
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
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: THEME.colors.canvas,
    paddingTop: 50,
    paddingBottom: 36,
    justifyContent: 'space-between',
    zIndex: 10000,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
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
  scrollContent: {
    alignItems: 'center',
  },
  slideCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing.xl,
  },
  emblemContainer: {
    marginBottom: 26,
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
    paddingHorizontal: THEME.spacing.lg,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 12,
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
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
