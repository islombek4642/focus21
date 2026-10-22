import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { THEME } from '../constants/theme.ts';
import { ROUTES } from '../constants/routes.ts';
import { useTranslation } from '../services/i18n.ts';
import { VectorIcon } from '../components/common/VectorIcon.tsx';
import { getTabIconName } from './navConfig.ts';

import { FocusScreen } from '../modules/focus/FocusScreen.tsx';
import { GoalsScreen } from '../modules/goals/GoalsScreen.tsx';
import { PlannerScreen } from '../modules/planner/PlannerScreen.tsx';
import { AuditScreen } from '../modules/audit/AuditScreen.tsx';
import { BalanceScreen } from '../modules/balance/BalanceScreen.tsx';

const Tab = createBottomTabNavigator();

export const RootNavigator: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      initialRouteName={ROUTES.FOCUS}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: THEME.colors.accent,
        tabBarInactiveTintColor: THEME.colors.textTertiary,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getTabIconName(route.name, focused);
          return (
            <View style={styles.iconContainer}>
              <VectorIcon name={iconName} size={size ?? 22} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name={ROUTES.FOCUS}
        component={FocusScreen}
        options={{ tabBarLabel: t('tabs.focus') }}
      />
      <Tab.Screen
        name={ROUTES.GOALS}
        component={GoalsScreen}
        options={{ tabBarLabel: t('tabs.goals') }}
      />
      <Tab.Screen
        name={ROUTES.PLANNER}
        component={PlannerScreen}
        options={{ tabBarLabel: t('tabs.planner') }}
      />
      <Tab.Screen
        name={ROUTES.AUDIT}
        component={AuditScreen}
        options={{ tabBarLabel: t('tabs.audit') }}
      />
      <Tab.Screen
        name={ROUTES.BALANCE}
        component={BalanceScreen}
        options={{ tabBarLabel: t('tabs.balance') }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: THEME.colors.canvas,
    borderTopColor: THEME.colors.border,
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
