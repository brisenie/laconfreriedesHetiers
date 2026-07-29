import React from 'react';
import { Tabs } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { colors, spacing, fonts } from '@/src/theme';

const TABS = [
  {
    name: 'monde',
    label: 'MONDE',
    icon: 'ship-wheel' as const,
  },
  {
    name: 'histoire',
    label: 'HISTOIRE',
    icon: 'book-open-page-variant' as const,
  },
  {
    name: 'classes',
    label: 'CLASSES',
    icon: 'sword-cross' as const,
  },
  {
    name: 'quetes',
    label: 'QUÊTES',
    icon: 'script-text-outline' as const,
  },
  {
    name: 'journal',
    label: 'JOURNAL',
    icon: 'notebook-outline' as const,
  },
  {
    name: 'passeport',
    label: 'PASSEPORT',
    icon: 'passport' as const,
  },
];

function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBar,
        {
          paddingBottom: Math.max(
            insets.bottom,
            spacing.sm
          ),
        },
      ]}
      testID="bottom-tab-bar"
    >
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;

        const tab = TABS.find(
          (item) => item.name === route.name
        );

        if (!tab) {
          return null;
        }

        const onPress = () => {
          Haptics.selectionAsync().catch(() => {});

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (
            !isFocused &&
            !event.defaultPrevented
          ) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
            testID={`tab-${tab.name}`}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={24}
              color={
                isFocused
                  ? colors.brandPrimary
                  : colors.onSurfaceSecondary
              }
            />

            <Text
              style={[
                styles.tabLabel,
                isFocused &&
                  styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>

            {isFocused && (
              <View style={styles.tabIndicator} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => (
        <CustomTabBar {...props} />
      )}
    >
      <Tabs.Screen name="monde" />
      <Tabs.Screen name="histoire" />
      <Tabs.Screen name="classes" />
      <Tabs.Screen name="quetes" />
      <Tabs.Screen name="journal" />
      <Tabs.Screen name="passeport" />

      <Tabs.Screen
        name="pnj"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0F0C0A',
    borderTopWidth: 1,
    borderTopColor: colors.brandTertiary,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    gap: 4,
  },

  tabLabel: {
    fontFamily: fonts.text,
    fontSize: 9,
    letterSpacing: 1,
    color: colors.onSurfaceSecondary,
    fontWeight: '600',
  },

  tabLabelActive: {
    color: colors.brandPrimary,
  },

  tabIndicator: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 2,
    backgroundColor: colors.brandPrimary,
    borderRadius: 2,
  },
});