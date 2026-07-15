import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

const HERO = 'https://customer-assets.emergentagent.com/job_mobile-app-builder-1889/artifacts/kwwhtls9_file_00000000811071f5926f2a60cf549990.png';

export default function Index() {
  const router = useRouter();

  const onStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.replace('/(tabs)/monde');
  };

  return (
    <View style={styles.root} testID="home-screen">
      <Image
        source={{ uri: HERO }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={300}
      />
      {/* Tap zone aligned with the "COMMENCER L'AVENTURE" button drawn in the image */}
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
  ctaHitbox: {
    position: 'absolute',
    left: '5%',
    right: '5%',
    bottom: '4%',
    height: 90,
  },
});
