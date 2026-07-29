import React from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, spacing } from '@/src/theme';

const HISTOIRE = 'https://customer-assets.emergentagent.com/job_mobile-app-builder-1889/artifacts/wyozghem_file_00000000c2ec722fa14bf0c144723220.png';

// Source image is roughly 1024 x 1536 → aspect 2:3
const IMG_ASPECT = 1024 / 1536;

export default function HistoireScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const contentWidth = width - spacing.lg * 2;
  const contentHeight = contentWidth / IMG_ASPECT;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']} testID="histoire-screen">
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} testID="histoire-back">
          <MaterialCommunityIcons name="chevron-left" size={26} color={colors.brandPrimary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.frame, { width: contentWidth, height: contentHeight }]}>
          <Image
            source={{ uri: HISTOIRE }}
            style={StyleSheet.absoluteFill}
            contentFit="contain"
            transition={200}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  topBar: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    flexDirection: 'row', alignItems: 'center',
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 1, borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
  },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl, alignItems: 'center' },
  frame: { backgroundColor: colors.surface, borderRadius: 8, overflow: 'hidden' },
});
