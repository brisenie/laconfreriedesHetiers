#!/bin/bash
cd ~/laconfreriedesHetiers/frontend

# Modifier index.tsx
cat > app/index.tsx << 'ENDFILE'
import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

const HERO =
  'https://customer-assets.emergentagent.com/job_mobile-app-builder-1889/artifacts/kwwhtls9_file_00000000811071f5926f2a60cf549990.png';

// Image d'accueil : environ 1024 × 1536
const IMAGE_ASPECT = 1024 / 1536;

export default function Index() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  // Responsive sizing
  const isLandscape = width > height;
  const imageWidth = width;
  const imageHeight = isLandscape
    ? Math.min(height * 0.95, imageWidth / IMAGE_ASPECT)
    : imageWidth / IMAGE_ASPECT;

  const onStart = () => {
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Medium
    ).catch(() => {});

    router.replace('/(tabs)/monde');
  };

  return (
    <View style={styles.root} testID="home-screen">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={!isLandscape}
      >
        <View
          style={{
            width: imageWidth,
            height: imageHeight,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={{ uri: HERO }}
            style={StyleSheet.absoluteFill}
            contentFit="contain"
            transition={300}
          />

          <Pressable
            testID="start-adventure-btn"
            onPress={onStart}
            style={[
              styles.ctaHitbox,
              {
                top: imageHeight * 0.82,
                height: imageHeight * 0.12,
              },
            ]}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },

  scrollContent: {
    alignItems: 'center',
    backgroundColor: '#000',
  },

  ctaHitbox: {
    position: 'absolute',
    left: '5%',
    right: '5%',
  },
});
ENDFILE

echo "✅ index.tsx updated"

# Modifier _layout.tsx
cat > app/\(tabs\)/_layout.tsx << 'ENDFILE'
import React from 'react';
import { Tabs, useWindowDimensions } from 'expo-router';

export default function TabsLayout() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 500;

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#8b5a2b',
        tabBarInactiveTintColor: '#6b6b6b',
        tabBarLabelStyle: {
          fontSize: isSmallScreen ? 10 : 12,
          fontWeight: '700',
        },
        tabBarStyle: {
          backgroundColor: '#f4e7c5',
          borderTopColor: '#8b5a2b',
          height: isSmallScreen ? 50 : 60,
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
      <Tabs.Screen
        name="classes"
        options={{
          title: 'Classes',
          headerTitle: 'Classes des aventuriers',
        }}
      />

      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          headerTitle: 'Journal de bord',
        }}
      />

      <Tabs.Screen
        name="monde"
        options={{
          title: 'Monde',
          headerTitle: 'Le monde des Héritiers',
        }}
      />

      <Tabs.Screen
        name="passeport"
        options={{
          title: 'Passeport',
          headerTitle: 'Passeport des Héritiers',
        }}
      />

      <Tabs.Screen
        name="pnj"
        options={{
          title: 'PNJ',
          headerTitle: 'Personnages',
        }}
      />

      <Tabs.Screen
        name="quetes"
        options={{
          title: 'Quêtes',
          headerTitle: 'Quêtes de la Confrérie',
        }}
      />
    </Tabs>
  );
}
ENDFILE

echo "✅ _layout.tsx updated"
