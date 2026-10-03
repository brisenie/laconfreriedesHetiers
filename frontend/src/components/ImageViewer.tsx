import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/src/theme';

type Props = {
  source: ImageSourcePropType | null;
  title?: string;
  onClose: () => void;
};

// Affiche une image en plein écran. Un toucher n'importe où la referme.
export default function ImageViewer({ source, title, onClose }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={source !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} testID="image-viewer">
        {source !== null && (
          <Image source={source} style={styles.image} resizeMode="contain" />
        )}

        {title ? (
          <View style={[styles.titleBar, { paddingBottom: insets.bottom + spacing.md }]}>
            <Text style={styles.title}>{title}</Text>
          </View>
        ) : null}

        <Pressable
          onPress={onClose}
          style={[styles.closeBtn, { top: insets.top + spacing.md }]}
          hitSlop={12}
          testID="image-viewer-close"
        >
          <MaterialCommunityIcons name="close" size={26} color={colors.onSurface} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Petite loupe en coin d'image pour indiquer qu'on peut l'agrandir
export function ZoomHint() {
  return (
    <View style={styles.hint} pointerEvents="none">
      <MaterialCommunityIcons name="magnify-plus-outline" size={20} color={colors.onSurface} />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(8, 5, 3, 0.96)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  titleBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: spacing.md,
    alignItems: 'center',
    backgroundColor: 'rgba(8, 5, 3, 0.6)',
  },
  title: {
    color: colors.brandPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
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
  hint: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(22, 19, 17, 0.7)',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
});
