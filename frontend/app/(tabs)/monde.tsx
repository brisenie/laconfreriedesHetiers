import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { colors, spacing } from '@/src/theme';

const UNIVERS =
  'https://customer-assets.emergentagent.com/job_mobile-app-builder-1889/artifacts/46qnx118_file_000000004cd0722fae6924f665c15167.png';

const IMG_ASPECT = 1024 / 2048;

const CARDS = [
  { id: 'histoire', top: 0.315, bottom: 0.535, left: 0.045, right: 0.355 },
  { id: 'monde', top: 0.315, bottom: 0.535, left: 0.355, right: 0.665 },
  { id: 'pnj', top: 0.315, bottom: 0.535, left: 0.665, right: 0.955 },
  { id: 'reliques', top: 0.545, bottom: 0.765, left: 0.045, right: 0.355 },
  { id: 'legendes', top: 0.545, bottom: 0.765, left: 0.355, right: 0.665 },
  {
    id: 'ennemis',
    top: 0.545,
    bottom: 0.765,
    left: 0.665,
    right: 0.955,
    image: require('../../Monde/ennemis/kraken.png'),
  },
];

export default function MondeScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();

  const imgWidth = width;
  const imgHeight = imgWidth / IMG_ASPECT;

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
    <SafeAreaView
      style={styles.root}
      edges={['top']}
      testID="monde-screen"
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: imgWidth, height: imgHeight }}>
          <Image
            source={{ uri: UNIVERS }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={200}
          />

          {CARDS.map((c) => {
            // Fixed, explicit pixel box for this card — computed once here
            // instead of being left to percentage styles, so the card's
            // own image can never influence the size of its clickable box
            // (this is what was letting the Ennemis card grow taller than
            // Reliques / Légendes and spill into the PNJ row above it).
            const cardWidth = imgWidth * (c.right - c.left);
            const cardHeight = imgHeight * (c.bottom - c.top);
            const cardTop = imgHeight * c.top;
            const cardLeft = imgWidth * c.left;

            return (
              <Pressable
                key={c.id}
                testID={`univers-card-${c.id}`}
                onPress={() => onCard(c.id)}
                style={{
                  position: 'absolute',
                  top: cardTop,
                  left: cardLeft,
                  width: cardWidth,
                  height: cardHeight,
                  overflow: 'hidden',
                }}
              >
                {c.image ? (
                  <View
                    style={[
                      styles.cardImageClip,
                      { width: cardWidth, height: cardHeight },
                    ]}
                  >
                    <Image
                      source={c.image}
                      style={{ width: cardWidth, height: cardHeight }}
                      contentFit="fill"
                      transition={200}
                    />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  content: {
    paddingBottom: spacing.xxxl,
  },

  cardImageClip: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
});
