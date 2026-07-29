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

// Image d’accueil : environ 1024 × 1536
const IMAGE_ASPECT = 1024 / 1536;

export default function Index() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const imageWidth = width;
  const imageHeight = imageWidth / IMAGE_ASPECT;

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
      >
        <View
          style={{
            width: imageWidth,
            height: imageHeight,
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