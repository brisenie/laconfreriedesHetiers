import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

const HERO = 'https://customer-assets.emergentagent.com/job_a4f0da38-6feb-4136-bf10-c3c0c6eb3e54/artifacts/ioaqv1kg_1_20260713_093758_0000.png';

export default function Index() {
  const router = useRouter();

  const onStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.replace('/(tabs)/monde');
  };

  return (
    <View style={styles.root} testID="home-screen">
      {/* Image is anchored to top so the bottom portion (with baked-in tab miniatures)
          falls below the visible area, which is then covered by a solid black band. */}
      <View style={styles.imageClip}>
        <Image
          source={{ uri: HERO }}
          style={styles.hero}
          contentFit="cover"
          transition={300}
        />
      </View>

      {/* Black band that hides the baked-in tab icons drawn at the bottom of the image */}
      <View style={styles.bottomMask} />

      {/* Tap zone over the "COMMENCER L'AVENTURE" button drawn in the image */}
      <Pressable
        testID="start-adventure-btn"
        onPress={onStart}
        style={styles.ctaHitbox}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  imageClip: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  hero: {
    width: '100%',
    height: '100%',
  },
  bottomMask: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: '7%',
    backgroundColor: '#000',
  },
  ctaHitbox: {
    position: 'absolute',
    left: '5%',
    right: '5%',
    bottom: '9%',
    height: 80,
  },
});
