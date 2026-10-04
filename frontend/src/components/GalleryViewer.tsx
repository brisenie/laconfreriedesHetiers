import React, { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, spacing } from '@/src/theme';
import ImageViewer, { ZoomHint } from '@/src/components/ImageViewer';

export type GallerySection = {
  title: string;
  source: ImageSourcePropType;
  // Ratio largeur / hauteur de l'image
  aspect: number;
};

type Props = {
  visible: boolean;
  title: string;
  sections: GallerySection[];
  onClose: () => void;
};

// Plusieurs images à la suite, qu'on fait défiler. Toucher une image
// l'affiche seule en plein écran.
export default function GalleryViewer({ visible, title, sections, onClose }: Props) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [zoomed, setZoomed] = useState<GallerySection | null>(null);

  const imageWidth = Math.min(width - spacing.md * 2, 1100);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop} testID="gallery-viewer">
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 64, paddingBottom: insets.bottom + spacing.xl },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{title}</Text>

          {sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Pressable onPress={() => setZoomed(section)} testID={`gallery-image-${index}`}>
                <Image
                  source={section.source}
                  style={{ width: imageWidth, height: imageWidth / section.aspect }}
                  resizeMode="contain"
                />
                <ZoomHint />
              </Pressable>
            </View>
          ))}
        </ScrollView>

        <Pressable
          onPress={onClose}
          style={[styles.closeBtn, { top: insets.top + spacing.md }]}
          hitSlop={12}
          testID="gallery-viewer-close"
        >
          <MaterialCommunityIcons name="close" size={26} color={colors.onSurface} />
        </Pressable>

        <ImageViewer
          source={zoomed ? zoomed.source : null}
          title={zoomed?.title}
          onClose={() => setZoomed(null)}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(8, 5, 3, 0.97)',
  },
  content: {
    alignItems: 'center',
    gap: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  title: {
    fontFamily: fonts.display,
    color: colors.brandPrimary,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
  },
  section: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.display,
    color: colors.onSurfaceSecondary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  closeBtn: {
    position: 'absolute',
    right: spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(44, 34, 28, 0.85)',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
});
