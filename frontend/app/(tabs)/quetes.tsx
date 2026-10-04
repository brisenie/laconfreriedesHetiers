import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { colors, fonts, radius, spacing } from '@/src/theme';
import ScreenHeader from '@/src/components/ScreenHeader';
import ImageViewer from '@/src/components/ImageViewer';
import BookViewer, { BookPage } from '@/src/components/BookViewer';
import { storage } from '@/src/utils/storage';

// Carte des quêtes : le chemin se perd dans les « Aventures inconnues »
const MAIN_QUESTS_IMAGE = require('../../quêtes/carte des quêtes - terres inconnues.jpg');
const COMPLETED_QUEST_IMAGE = require('../../quêtes/toutes les quêtes/quête chasse aux trésors 2026 completée .png');
const ANCIENT_MESSAGE_IMAGE = require('../../assets/images/journal/le message des anciens.png');
const FORGERON_EXPLAINED_IMAGE = require('../../quêtes/toutes les quêtes/La_Forge_des_Anciens.png');

// Emplacement sur la carte du médaillon de la prochaine quête
const NEXT_QUEST_SPOT = { x: 0.433, y: 0.533 };

// Mémorise sur l'appareil les quêtes déjà ouvertes
const seenKey = (number: number) => `quetes.vue.${number}`;

type Quest = {
  number: number;
  title: string;
  status: string;
  image: ImageSourcePropType;
  // Plusieurs fiches : affichées côte à côte comme un livre ouvert
  pages?: BookPage[];
  // Illustration de la quête, affichée dans le médaillon une fois ouverte
  emblem: ImageSourcePropType;
  // Centre du médaillon sur la carte (fractions de la largeur / hauteur)
  x: number;
  y: number;
};

const QUESTS: Quest[] = [
  {
    number: 1,
    title: 'Chasse aux trésors 2026',
    status: 'Complétée',
    image: COMPLETED_QUEST_IMAGE,
    emblem: require('../../assets/images/quetes/chasse.png'),
    x: 0.179,
    y: 0.598,
  },
  {
    number: 2,
    title: 'Le message des anciens et la lettre du capitaine',
    status: 'Découverte',
    image: ANCIENT_MESSAGE_IMAGE,
    emblem: require('../../assets/images/quetes/message.png'),
    x: 0.264,
    y: 0.542,
  },
  {
    number: 3,
    title: 'La forge des Anciens',
    status: 'Découverte',
    image: FORGERON_EXPLAINED_IMAGE,
    emblem: require('../../assets/images/quetes/forge.png'),
    x: 0.353,
    y: 0.469,
  },
];

const MEDALLION_SIZE = 0.074; // diamètre de l'anneau, en fraction de la largeur de la carte
const EMBLEM_SIZE = 0.05; // diamètre de l'illustration posée sur le médaillon

// Médaillon « ? » de la prochaine quête : il brille doucement
function NextQuestMarker({ size, x, y }: { size: number; x: number; y: number }) {
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [glow]);

  return (
    <Animated.View
      pointerEvents="none"
      testID="quest-next-marker"
      style={[
        styles.ring,
        styles.nextRing,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] }),
          transform: [
            { translateX: -size / 2 },
            { translateY: -size / 2 },
            { scale: glow.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1.08] }) },
          ],
        },
      ]}
    />
  );
}

export default function QuetesScreen() {
  const [opened, setOpened] = useState<Quest | null>(null);
  const [mapWidth, setMapWidth] = useState(0);
  const [seen, setSeen] = useState<Record<number, boolean>>({});

  useEffect(() => {
    Promise.all(
      QUESTS.map((quest) => storage.getItem(seenKey(quest.number), false))
    ).then((values) => {
      const loaded: Record<number, boolean> = {};
      QUESTS.forEach((quest, index) => {
        loaded[quest.number] = Boolean(values[index]);
      });
      setSeen(loaded);
    });
  }, []);
  // Sur grand écran, le registre se place à droite de la carte
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  const open = (quest: Quest) => {
    Haptics.selectionAsync().catch(() => {});
    setOpened(quest);
    if (!seen[quest.number]) {
      setSeen((current) => ({ ...current, [quest.number]: true }));
      storage.setItem(seenKey(quest.number), true);
    }
  };

  const ringSize = mapWidth * MEDALLION_SIZE;
  const emblemSize = mapWidth * EMBLEM_SIZE;

  return (
    <SafeAreaView style={styles.root} edges={['top']} testID="quetes-screen">
      <ScreenHeader title="LES QUÊTES" subtitle="Contrats de la Confrérie" icon="script-text-outline" />

      <ScrollView
        contentContainerStyle={[styles.content, isWide && styles.contentWide]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.mapFrame, isWide && styles.mapFrameWide]}
          onLayout={(event) => setMapWidth(event.nativeEvent.layout.width)}
        >
          <Image source={MAIN_QUESTS_IMAGE} style={styles.image} contentFit="contain" />

          {/* Anneau doré sur les médaillons des quêtes disponibles */}
          {mapWidth > 0 &&
            QUESTS.map((quest) => (
              <Pressable
                key={quest.number}
                accessibilityLabel={`Ouvrir la quête ${quest.number} : ${quest.title}`}
                onPress={() => open(quest)}
                testID={`quest-marker-${quest.number}`}
                style={[
                  styles.ring,
                  {
                    width: ringSize,
                    height: ringSize,
                    borderRadius: ringSize / 2,
                    left: `${quest.x * 100}%`,
                    top: `${quest.y * 100}%`,
                    transform: [
                      { translateX: -ringSize / 2 },
                      { translateY: -ringSize / 2 },
                    ],
                  },
                ]}
              >
                {seen[quest.number] && (
                  <Image
                    source={quest.emblem}
                    style={[
                      styles.mapEmblem,
                      {
                        width: emblemSize,
                        height: emblemSize,
                        borderRadius: emblemSize / 2,
                      },
                    ]}
                    contentFit="cover"
                    transition={300}
                  />
                )}
              </Pressable>
            ))}

          {mapWidth > 0 && (
            <NextQuestMarker size={ringSize} x={NEXT_QUEST_SPOT.x} y={NEXT_QUEST_SPOT.y} />
          )}
        </View>

        {/* Registre des quêtes, lisible sur mobile */}
        <View style={[styles.register, isWide && styles.registerWide]}>
          <Text style={styles.registerTitle}>REGISTRE DES QUÊTES</Text>
          <Text style={styles.registerSub}>
            {QUESTS.length} quêtes accomplies
          </Text>

          {QUESTS.map((quest) => (
            <Pressable
              key={quest.number}
              onPress={() => open(quest)}
              testID={`quest-row-${quest.number}`}
              style={({ pressed }) => [styles.row, pressed && { opacity: 0.8 }]}
            >
              {seen[quest.number] ? (
                <View>
                  <Image source={quest.emblem} style={styles.rowEmblem} contentFit="cover" />
                  <View style={styles.rowEmblemNumber}>
                    <Text style={styles.rowEmblemNumberText}>{quest.number}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{quest.number}</Text>
                </View>
              )}
              <View style={styles.rowBody}>
                <Text style={styles.rowTitle}>{quest.title}</Text>
                <Text style={styles.rowStatus}>{quest.status}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color={colors.brandPrimary} />
            </Pressable>
          ))}

          <View style={[styles.row, styles.rowLocked]}>
            <View style={[styles.badge, styles.badgeLocked]}>
              <MaterialCommunityIcons name="lock" size={14} color="#9C8A70" />
            </View>
            <View style={styles.rowBody}>
              <Text style={[styles.rowTitle, styles.rowTitleLocked]}>
                Prochaine quête
              </Text>
              <Text style={styles.rowStatusLocked}>À découvrir…</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <ImageViewer
        source={opened && !opened.pages ? opened.image : null}
        title={opened ? `Quête ${opened.number} · ${opened.title}` : undefined}
        onClose={() => setOpened(null)}
      />

      <BookViewer
        pages={opened?.pages ?? null}
        title={opened ? `Quête ${opened.number} · ${opened.title}` : undefined}
        onClose={() => setOpened(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    padding: spacing.md,
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  contentWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  mapFrameWide: {
    flex: 2,
    maxWidth: 1000,
  },
  registerWide: {
    flex: 1,
    maxWidth: 420,
  },
  mapFrame: {
    position: 'relative',
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    aspectRatio: 1536 / 1024,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  nextRing: {
    borderColor: '#FFE3A0',
    backgroundColor: 'rgba(255, 227, 160, 0.18)',
    shadowRadius: 12,
  },
  ring: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#F2C766',
    backgroundColor: 'rgba(242, 199, 102, 0.12)',
    shadowColor: '#F2C766',
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  mapEmblem: {
    borderWidth: 1.5,
    borderColor: '#F2C766',
  },
  rowEmblem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.brandPrimary,
  },
  rowEmblemNumber: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C221C',
    borderWidth: 1.5,
    borderColor: colors.brandPrimary,
  },
  rowEmblemNumberText: {
    fontFamily: fonts.display,
    fontSize: 11,
    fontWeight: '700',
    color: colors.brandPrimary,
  },
  register: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    backgroundColor: '#EAD9B5',
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.brandSecondary,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  registerTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#3B2718',
    textAlign: 'center',
  },
  registerSub: {
    fontFamily: fonts.display,
    fontStyle: 'italic',
    fontSize: 13,
    color: '#6B4E2E',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: '#F6EBD2',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#C9A86A',
  },
  rowLocked: {
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C221C',
    borderWidth: 2,
    borderColor: colors.brandPrimary,
  },
  badgeLocked: {
    backgroundColor: '#E2CFA6',
    borderColor: '#B9A27A',
  },
  badgeText: {
    fontFamily: fonts.display,
    fontSize: 15,
    fontWeight: '700',
    color: colors.brandPrimary,
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    fontFamily: fonts.display,
    fontSize: 15,
    fontWeight: '700',
    color: '#2A1E17',
  },
  rowTitleLocked: {
    color: '#8A7456',
  },
  rowStatus: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#7A5A2E',
    marginTop: 2,
  },
  rowStatusLocked: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#9C8A70',
    marginTop: 2,
  },
});
