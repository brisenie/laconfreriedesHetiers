import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/src/theme';
import ScreenHeader from '@/src/components/ScreenHeader';

const MAIN_QUESTS_IMAGE = require('../../frontend/quêtes/image de quêtes.png');

export default function QuetesScreen() {
  return (
    <SafeAreaView style={styles.root} edges={['top']} testID="quetes-screen">
      <ScreenHeader title="LES QUÊTES" subtitle="Contrats de la Confrérie" icon="script-text-outline" />

      <View style={styles.imageWrap}>
        <Image source={MAIN_QUESTS_IMAGE} style={styles.image} contentFit="contain" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  imageWrap: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
});
