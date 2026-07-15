import React from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/src/theme';
import ScreenHeader from '@/src/components/ScreenHeader';

const HISTOIRE = 'https://customer-assets.emergentagent.com/job_mobile-app-builder-1889/artifacts/wyozghem_file_00000000c2ec722fa14bf0c144723220.png';

// Source image aspect ratio (roughly 2:3 portrait — 1024 x 1536)
const IMG_ASPECT = 1024 / 1536;

export default function HistoireScreen() {
  const { width } = useWindowDimensions();
  const contentWidth = width - spacing.lg * 2;
  const contentHeight = contentWidth / IMG_ASPECT;

  return (
    <SafeAreaView style={styles.root} edges={['top']} testID="histoire-screen">
      <ScreenHeader title="L'HISTOIRE" subtitle="Chronique de la Confrérie" icon="book-open-page-variant" />
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
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl, alignItems: 'center' },
  frame: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
