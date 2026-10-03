import React, { useState } from 'react';
import { View, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

const HERO =
  'https://customer-assets.emergentagent.com/job_mobile-app-builder-1889/artifacts/kwwhtls9_file_00000000811071f5926f2a60cf549990.png';

// Ratio largeur / hauteur de l'image d'accueil, en attendant de connaître
// sa vraie taille au chargement.
const DEFAULT_ASPECT = 0.545;

// Part maximale de l'image qu'on accepte de couper pour remplir l'écran.
// Au-delà (écran beaucoup plus large ou plus allongé que l'image), l'image
// est affichée en entier sur un fond flouté tiré de la même image, au lieu
// de bandes noires.
const MAX_CROP = 0.18;

// Position du bouton « Commencer l'aventure » dans l'image (en fraction
// de la hauteur de l'image).
const CTA_TOP = 0.855;
const CTA_HEIGHT = 0.11;

export default function Index() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [aspect, setAspect] = useState(DEFAULT_ASPECT);

  // Taille de l'image à l'écran : elle remplit tout l'écran (quitte à
  // rogner un peu les bords), sauf si cela couperait trop l'image.
  const coverHeight = Math.max(width / aspect, height);
  const coverWidth = coverHeight * aspect;
  const crop = Math.max(
    (coverWidth - width) / coverWidth,
    (coverHeight - height) / coverHeight
  );
  const fillScreen = crop <= MAX_CROP;

  const imageHeight = fillScreen ? coverHeight : Math.min(height, width / aspect);
  const imageWidth = imageHeight * aspect;
  const imageLeft = (width - imageWidth) / 2;
  const imageTop = (height - imageHeight) / 2;

  const onStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.replace('/(tabs)/monde');
  };

  return (
    <View style={styles.root} testID="home-screen">
      {!fillScreen && (
        <Image
          source={{ uri: HERO }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          blurRadius={30}
        />
      )}

      <View
        style={{
          position: 'absolute',
          left: imageLeft,
          top: imageTop,
          width: imageWidth,
          height: imageHeight,
        }}
      >
        <Image
          source={{ uri: HERO }}
          style={StyleSheet.absoluteFill}
          contentFit="fill"
          transition={300}
          onLoad={(event) => {
            const { width: w, height: h } = event.source;
            if (w > 0 && h > 0) setAspect(w / h);
          }}
        />

        <Pressable
          testID="start-adventure-btn"
          onPress={onStart}
          style={[
            styles.ctaHitbox,
            {
              top: imageHeight * CTA_TOP,
              height: imageHeight * CTA_HEIGHT,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },

  ctaHitbox: {
    position: 'absolute',
    left: '12%',
    right: '12%',
  },
});
