import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts } from '@/src/theme';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

// Icône d'onglet : pastille dorée derrière l'icône de l'onglet actif
function TabIcon({
  name,
  focused,
  color,
  size,
}: {
  name: IconName;
  focused: boolean;
  color: string;
  size: number;
}) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <MaterialCommunityIcons name={name} size={size} color={color} />
    </View>
  );
}

const TABS: { name: string; title: string; headerTitle: string; icon: IconName }[] = [
  { name: 'classes', title: 'Classes', headerTitle: 'Classes des aventuriers', icon: 'sword-cross' },
  { name: 'journal', title: 'Journal', headerTitle: 'Journal de bord', icon: 'book-open-page-variant' },
  { name: 'monde', title: 'Monde', headerTitle: 'Le monde des Héritiers', icon: 'compass-rose' },
  { name: 'passeport', title: 'Passeport', headerTitle: 'Passeport des Héritiers', icon: 'passport' },
  { name: 'pnj', title: 'PNJ', headerTitle: 'Personnages', icon: 'account-group' },
  { name: 'quetes', title: 'Quêtes', headerTitle: 'Quêtes de la Confrérie', icon: 'map-marker-path' },
];

export default function TabsLayout() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isSmallScreen = width < 500;
  const iconSize = isSmallScreen ? 22 : 24;

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarLabelPosition: 'below-icon',
        tabBarActiveTintColor: colors.brandPrimary,
        tabBarInactiveTintColor: '#9C8A70',
        tabBarLabelStyle: {
          fontFamily: fonts.display,
          fontSize: isSmallScreen ? 10 : 12,
          fontWeight: '700',
          letterSpacing: 0.5,
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingTop: 6,
        },
        tabBarStyle: {
          backgroundColor: colors.surfaceSecondary,
          borderTopWidth: 2,
          borderTopColor: colors.borderStrong,
          height: (isSmallScreen ? 64 : 70) + insets.bottom,
          paddingBottom: insets.bottom + 6,
        },
        headerStyle: {
          backgroundColor: '#f4e7c5',
        },
        headerTintColor: '#3b2718',
        headerTitleStyle: {
          fontWeight: '800',
        },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            headerTitle: tab.headerTitle,
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name={tab.icon} focused={focused} color={color} size={iconSize} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 999,
  },
  iconWrapActive: {
    backgroundColor: 'rgba(198, 156, 74, 0.18)',
  },
});
