import React, { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, spacing } from '@/src/theme';

export type BookPage = {
  source: ImageSourcePropType;
  // Ratio largeur / hauteur de l'image
  aspect: number;
};

type Props = {
  pages: BookPage[] | null;
  title?: string;
  onClose: () => void;
};

const COVER = 10; // épaisseur de la reliure autour des pages

// Affiche plusieurs pages côte à côte, comme un livre ouvert.
// Toucher une page l'affiche seule en plein écran.
export default function BookViewer({ pages, title, onClose }: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [focused, setFocused] = useState<number | null>(null);

  const close = () => {
    setFocused(null);
    onClose();
  };

  // Place disponible pour le livre
  const availW = width - spacing.md * 2 - COVER * 2;
  const availH =
    height - insets.top - insets.bottom - 64 /* croix */ - 72 /* titre */ - COVER * 2;

  // Toutes les pages ont la même hauteur
  const totalAspect = (pages ?? []).reduce((sum, p) => sum + p.aspect, 0);
  const pageHeight = totalAspect > 0 ? Math.min(availH, availW / totalAspect) : 0;

  const focusedPage = pages && focused !== null ? pages[focused] : null;

  return (
    <Modal visible={pages !== null} transparent animationType="fade" onRequestClose={close}>
      <View style={styles.backdrop} testID="book-viewer">
        {focusedPage ? (
          <Pressable style={styles.focusArea} onPress={() => setFocused(null)}>
            <Image source={focusedPage.source} style={styles.focusImage} resizeMode="contain" />
          </Pressable>
        ) : (
          <Pressable style={styles.bookArea} onPress={close}>
            <View style={styles.cover}>
              <View style={styles.pagesRow}>
                {(pages ?? []).map((page, index) => (
                  <Pressable
                    key={index}
                    onPress={() => setFocused(index)}
                    testID={`book-page-${index}`}
                  >
                    <Image
                      source={page.source}
                      style={{ width: pageHeight * page.aspect, height: pageHeight }}
                      resizeMode="cover"
                    />
                  </Pressable>
                ))}

                {/* Pliure du livre entre les pages */}
                {(pages ?? []).slice(0, -1).map((_, index) => {
                  const left =
                    (pages ?? [])
                      .slice(0, index + 1)
                      .reduce((sum, p) => sum + p.aspect, 0) * pageHeight;
                  return (
                    <View key={`fold-${index}`} pointerEvents="none" style={[styles.fold, { left: left - 14 }]}>
                      <View style={[styles.foldShade, { opacity: 0.15 }]} />
                      <View style={[styles.foldShade, { opacity: 0.35 }]} />
                      <View style={[styles.foldShade, { opacity: 0.6 }]} />
                      <View style={[styles.foldShade, { opacity: 0.35 }]} />
                      <View style={[styles.foldShade, { opacity: 0.15 }]} />
                    </View>
                  );
                })}
              </View>
            </View>
          </Pressable>
        )}

        <View style={[styles.titleBar, { paddingBottom: insets.bottom + spacing.md }]} pointerEvents="none">
          {title ? <Text style={styles.title}>{title}</Text> : null}
          <Text style={styles.hint}>
            {focusedPage ? 'Touchez pour revenir au livre' : 'Touchez une page pour l’agrandir'}
          </Text>
        </View>

        <Pressable
          onPress={focusedPage ? () => setFocused(null) : close}
          style={[styles.closeBtn, { top: insets.top + spacing.md }]}
          hitSlop={12}
          testID="book-viewer-close"
        >
          <MaterialCommunityIcons
            name={focusedPage ? 'book-open-variant' : 'close'}
            size={24}
            color={colors.onSurface}
          />
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(8, 5, 3, 0.96)',
  },
  bookArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  cover: {
    padding: COVER,
    borderRadius: 8,
    backgroundColor: '#4A2E1A',
    borderWidth: 2,
    borderColor: colors.brandSecondary,
    shadowColor: '#000',
    shadowOpacity: 0.7,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  pagesRow: {
    flexDirection: 'row',
    position: 'relative',
  },
  fold: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 28,
    flexDirection: 'row',
  },
  foldShade: {
    flex: 1,
    backgroundColor: '#000',
  },
  focusArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusImage: {
    width: '100%',
    height: '100%',
  },
  titleBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: spacing.sm,
    alignItems: 'center',
    backgroundColor: 'rgba(8, 5, 3, 0.6)',
  },
  title: {
    fontFamily: fonts.display,
    color: colors.brandPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  hint: {
    color: colors.onSurfaceSecondary,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
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
