import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Image } from 'react-native';
import { THEME } from '../../constants/theme.ts';
import { useTranslation } from '../../services/i18n.ts';

export interface ExecutiveSplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export const ExecutiveSplashScreen: React.FC<ExecutiveSplashScreenProps> = ({
  onFinish,
  durationMs = 2600,
}) => {
  const { t } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const exitFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Entrance animation (fade in + spring scale up)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Controlled hold duration followed by smooth exit fade
    const timer = setTimeout(() => {
      Animated.timing(exitFade, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs]);

  return (
    <Animated.View style={[styles.container, { opacity: exitFade }]} pointerEvents="auto">
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Luxury Brand Emblem */}
        <View style={styles.logoRing}>
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.brandTitle}>
          {t('common.appName', { defaultValue: 'FOCUS 21' })}
        </Text>
        <Text style={styles.brandSubtitle}>
          {t('common.tagline', { defaultValue: 'EXECUTIVE OS' })}
        </Text>

        <View style={styles.goldDivider} />

        {/* Tagline */}
        <Text style={styles.tagline}>
          {t('common.tracyPrinciples', { defaultValue: 'Brian Tracy 21 Principles' })}
        </Text>
      </Animated.View>

      {/* Footer System Badge */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={styles.footerText}>
          {t('common.highPerformance', { defaultValue: 'HIGH-PERFORMANCE TIME MANAGEMENT' })}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0D0E11',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999999,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(229, 169, 60, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(229, 169, 60, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: THEME.colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  logoImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.accent,
    letterSpacing: 3,
    marginBottom: 16,
  },
  goldDivider: {
    width: 36,
    height: 2,
    backgroundColor: THEME.colors.accent,
    marginBottom: 14,
    borderRadius: 1,
  },
  tagline: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    letterSpacing: 0.8,
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  footerText: {
    fontSize: 10,
    color: THEME.colors.textTertiary,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
});
