import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/src/theme';
import ScreenHeader from '@/src/components/ScreenHeader';

const MAIN_QUESTS_IMAGE = require('../../quêtes/image de quêtes.png');
const COMPLETED_QUEST_IMAGE = require('../../quêtes/1iere quête la chasse 2026/quête chasse aux trésors 2026 completée .png');
const ANCIENT_MESSAGE_IMAGE = require('../../assets/images/journal/le message des anciens.png');

export default function QuetesScreen() {
  const [showDetail, setShowDetail] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [showAncientMessageLabel, setShowAncientMessageLabel] = useState(false);
  const [detailImage, setDetailImage] = useState<any>(null);

  const openDetail = (image: any) => {
    setShowLabel(true);
    setDetailImage(image);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setDetailImage(null);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']} testID="quetes-screen">
      <ScreenHeader title="LES QUÊTES" subtitle="Contrats de la Confrérie" icon="script-text-outline" />

      <View style={styles.imageWrap}>
        <View style={styles.mapFrame}>
          <Image source={MAIN_QUESTS_IMAGE} style={styles.image} contentFit="contain" />

          {showLabel ? <Text style={styles.questMarkerLabel}>chasse 2026 complété</Text> : null}

          <Pressable
            accessibilityLabel="Ouvrir la chasse aux trésors 2026"
            onPress={() => openDetail(COMPLETED_QUEST_IMAGE)}
            style={styles.questMarker}
          >
            <Text style={styles.questMarkerText} aria-hidden="true"> </Text>
          </Pressable>

          {showAncientMessageLabel ? <Text style={styles.questMarkerSecondLabel}>Le message des anciens et la lettre du capitaine</Text> : null}

          <Pressable
            accessibilityLabel="Ouvrir le message des anciens"
            onPress={() => {
              if (!showAncientMessageLabel) {
                setShowAncientMessageLabel(true);
              }
              openDetail(ANCIENT_MESSAGE_IMAGE);
            }}
            style={styles.questMarkerSecond}
          >
            <Text style={styles.questMarkerText} aria-hidden="true"> </Text>
          </Pressable>
        </View>
      </View>

      {showDetail && detailImage ? (
        <Pressable style={styles.overlay} onPress={closeDetail}>
          <Pressable style={styles.detailCard} onPress={closeDetail}>
            <Image source={detailImage} style={styles.detailImage} contentFit="contain" />
          </Pressable>
        </Pressable>
      ) : null}
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
    justifyContent: 'center',
  },
  mapFrame: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1536 / 1024,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  questMarker: {
    position: 'absolute',
    left: '16.1%',
    top: '61.7%',
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
  },
  questMarkerSecond: {
    position: 'absolute',
    left: '26.4%',
    top: '54.0%',
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
  },
  questMarkerSecondLabel: {
    position: 'absolute',
    left: '26.4%',
    top: '61.4%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
    fontSize: 14,
    fontWeight: '700',
    color: '#070605',
    textAlign: 'center',
    maxWidth: 180,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  questMarkerLabel: {
    position: 'absolute',
    left: '17%',
    top: '51%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
    fontSize: 16,
    fontWeight: '700',
    color: '#070605',
    textAlign: 'center',
    maxWidth: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  questMarkerText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#2F1A0D',
    lineHeight: 30,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(24, 18, 14, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  detailCard: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
    borderRadius: 24,
    overflow: 'visible',
    backgroundColor: '#f4e7c5',
  },
  detailImage: {
    width: '100%',
    height: '100%',
    minHeight: 680,
  },
});
