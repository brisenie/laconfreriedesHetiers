import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { colors } from '@/src/theme';

const UNIVERS =
  'https://customer-assets.emergentagent.com/job_mobile-app-builder-1889/artifacts/46qnx118_file_000000004cd0722fae6924f665c15167.png';

const IMG_ASPECT = 1024 / 2048;

// Emplacements des six cartes dans l'image Univers (fractions de la largeur
// et de la hauteur de l'image), mesurés sur l'image affichée.
const COLS = [
  { left: 0.044, right: 0.338 },
  { left: 0.358, right: 0.64 },
  { left: 0.66, right: 0.961 },
];
// La 2e rangée de cartes est moins haute que la 1re
const ROWS = [
  { top: 0.336, bottom: 0.602 },
  { top: 0.615, bottom: 0.857 },
];

type Card = {
  id: string;
  left: number;
  right: number;
  top: number;
  bottom: number;
  image?: number;
};

const CARDS: Card[] = [
  { id: 'histoire', ...COLS[0], ...ROWS[0] },
  { id: 'monde', ...COLS[1], ...ROWS[0] },
  { id: 'pnj', ...COLS[2], ...ROWS[0] },
  { id: 'reliques', ...COLS[0], ...ROWS[1] },
  { id: 'legendes', ...COLS[1], ...ROWS[1] },
  {
    id: 'ennemis',
    ...COLS[2],
    ...ROWS[1],
    // Carte « Ennemis » dans le même style que les autres cartes
    image: require('../../Monde/ennemis/carte-ennemis.png'),
  },
];

export default function MondeScreen() {
  const router = useRouter();
  const [box, setBox] = useState({ width: 0, height: 0 });

  // L'image entière tient dans l'écran, sans défilement
  const imgHeight = Math.min(box.height, box.width / IMG_ASPECT);
  const imgWidth = imgHeight * IMG_ASPECT;
  const imgLeft = (box.width - imgWidth) / 2;
  const imgTop = (box.height - imgHeight) / 2;

  const onCard = (id: string) => {
    Haptics.selectionAsync().catch(() => {});

    if (id === 'histoire') {
      router.push('/histoire');
      return;
    }

    if (id === 'pnj') {
      router.push('/pnj');
      return;
    }

    if (id === 'ennemis') {
      router.push('/ennemis');
      return;
    }
  };

  return (
    <View
      style={styles.root}
      testID="monde-screen"
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setBox({ width, height });
      }}
    >
      {/* Fond flouté tiré de la même image, à la place de bandes noires */}
      <Image
        source={{ uri: UNIVERS }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        blurRadius={30}
      />

      {imgHeight > 0 && (
        <View
          style={{
            position: 'absolute',
            left: imgLeft,
            top: imgTop,
            width: imgWidth,
            height: imgHeight,
          }}
        >
          <Image
            source={{ uri: UNIVERS }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={200}
          />

          {CARDS.map((c) => (
            <Pressable
              key={c.id}
              testID={`univers-card-${c.id}`}
              onPress={() => onCard(c.id)}
              style={{
                position: 'absolute',
                top: imgHeight * c.top,
                left: imgWidth * c.left,
                width: imgWidth * (c.right - c.left),
                height: imgHeight * (c.bottom - c.top),
              }}
            >
              {c.image ? (
                <Image
                  source={c.image}
                  style={StyleSheet.absoluteFill}
                  contentFit="fill"
                  transition={200}
                />
              ) : null}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
});
