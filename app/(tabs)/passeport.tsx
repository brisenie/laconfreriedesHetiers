import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Print from 'expo-print';
import { Asset } from 'expo-asset';

import {
  colors,
  spacing,
  radius,
  type,
  fonts,
} from '@/src/theme';
import ScreenHeader from '@/src/components/ScreenHeader';

const pagesPasseport = [
  {
    id: 'couverture',
    order: 1,
    name: 'Couverture',
    description:
      'La couverture officielle du Passeport des Héritiers.',
    image: require(
      '@/assets/passeport/Passeport-couverture.png'
    ),
  },
  {
    id: 'message-anciens',
    order: 2,
    name: 'Message des Anciens',
    description:
      'Le message officiel transmis par les Anciens Gardiens.',
    image: require(
      '@/assets/passeport/Passeport-message des anciens gardiens.png'
    ),
  },
  {
    id: 'serment',
    order: 3,
    name: 'Le Serment',
    description:
      'Le serment prêté par les aventuriers qui rejoignent la Confrérie.',
    image: require(
      '@/assets/passeport/Passeport-serment.png'
    ),
  },
  {
    id: 'niveaux',
    order: 4,
    name: 'Les niveaux des aventuriers',
    description:
      'La progression officielle des aventuriers de la Confrérie.',
    image: require(
      '@/assets/passeport/Passeport des héritiers _ niveaux des aventuriers.png'
    ),
  },
];

export default function PasseportScreen() {
  const [preview, setPreview] = useState<any | null>(null);
  const [impressionEnCours, setImpressionEnCours] =
    useState<string | null>(null);

  const ouvrirPage = (page: any) => {
    Haptics.selectionAsync().catch(() => {});
    setPreview(page);
  };

  const imprimerPage = async (page: any) => {
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    ).catch(() => {});

    try {
      setImpressionEnCours(page.id);

      const asset = Asset.fromModule(page.image);
      await asset.downloadAsync();

      const imageUri = asset.localUri || asset.uri;

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />

            <style>
              @page {
                size: letter portrait;
                margin: 0;
              }

              html,
              body {
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                background: white;
              }

              .page {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                page-break-after: always;
              }

              img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                display: block;
              }
            </style>
          </head>

          <body>
            <div class="page">
              <img src="${imageUri}" />
            </div>
          </body>
        </html>
      `;

      await Print.printAsync({
        html,
      });
    } catch (error) {
      console.error(
        'Erreur pendant l’impression :',
        error
      );

      Alert.alert(
        'Impression impossible',
        'La page n’a pas pu être envoyée vers l’imprimante.'
      );
    } finally {
      setImpressionEnCours(null);
    }
  };

  return (
    <SafeAreaView
      style={styles.root}
      edges={['top']}
      testID="passeport-screen"
    >
      <ScreenHeader
        title="LE PASSEPORT"
        subtitle="Les pages officielles des Héritiers"
        icon="passport"
      />

      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {pagesPasseport.map((page) => {
          const impression =
            impressionEnCours === page.id;

          return (
            <View
              key={page.id}
              style={styles.card}
              testID={`passport-card-${page.order}`}
            >
              <Pressable
                onPress={() => ouvrirPage(page)}
                style={({ pressed }) => [
                  styles.thumbWrap,
                  pressed && styles.cardPressed,
                ]}
              >
                <Image
                  source={page.image}
                  style={styles.thumb}
                  contentFit="cover"
                  transition={200}
                />

                <View style={styles.pageBadge}>
                  <Text style={styles.pageBadgeText}>
                    P.
                    {String(page.order).padStart(
                      2,
                      '0'
                    )}
                  </Text>
                </View>
              </Pressable>

              <View style={styles.cardFooter}>
                <Text
                  style={styles.cardName}
                  numberOfLines={2}
                >
                  {page.name}
                </Text>

                <Text
                  style={styles.cardDesc}
                  numberOfLines={3}
                >
                  {page.description}
                </Text>

                <Pressable
                  onPress={() => ouvrirPage(page)}
                  style={({ pressed }) => [
                    styles.openButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="eye-outline"
                    size={14}
                    color={colors.onBrandPrimary}
                  />

                  <Text style={styles.buttonText}>
                    OUVRIR
                  </Text>
                </Pressable>

                <Pressable
                  disabled={impression}
                  onPress={() => imprimerPage(page)}
                  style={({ pressed }) => [
                    styles.printButton,
                    pressed && styles.buttonPressed,
                    impression &&
                      styles.buttonDisabled,
                  ]}
                  testID={`passport-print-${page.order}`}
                >
                  <MaterialCommunityIcons
                    name={
                      impression
                        ? 'printer-clock'
                        : 'printer'
                    }
                    size={14}
                    color={colors.brandPrimary}
                  />

                  <Text style={styles.printButtonText}>
                    {impression
                      ? 'PRÉPARATION'
                      : 'IMPRIMER'}
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Modal
        visible={preview !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setPreview(null)}
      >
        <View style={styles.previewRoot}>
          {preview && (
            <View
              style={styles.previewCard}
              testID="passport-preview-modal"
            >
              <Image
                source={preview.image}
                style={styles.previewImg}
                contentFit="contain"
              />

              <View style={styles.previewFooter}>
                <Text style={styles.previewPage}>
                  PAGE {preview.order}
                </Text>

                <Text style={styles.previewTitle}>
                  {preview.name}
                </Text>

                <Text style={styles.previewDesc}>
                  {preview.description}
                </Text>

                <Pressable
                  onPress={() =>
                    imprimerPage(preview)
                  }
                  disabled={
                    impressionEnCours === preview.id
                  }
                  style={({ pressed }) => [
                    styles.previewPrintButton,
                    pressed && styles.buttonPressed,
                    impressionEnCours ===
                      preview.id &&
                      styles.buttonDisabled,
                  ]}
                  testID="passport-preview-print"
                >
                  <MaterialCommunityIcons
                    name="printer"
                    size={20}
                    color={colors.onBrandPrimary}
                  />

                  <Text
                    style={
                      styles.previewPrintButtonText
                    }
                  >
                    IMPRIMER CETTE PAGE
                  </Text>
                </Pressable>
              </View>

              <Pressable
                onPress={() => setPreview(null)}
                style={styles.closeBtn}
                testID="passport-preview-close"
              >
                <MaterialCommunityIcons
                  name="close"
                  size={23}
                  color={colors.brandPrimary}
                />
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    rowGap: spacing.sm,
    columnGap: spacing.sm,
    paddingBottom: spacing.xxxl,
  },

  card: {
    width: '31%',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    overflow: 'hidden',
  },

  cardPressed: {
    opacity: 0.82,
  },

  thumbWrap: {
    position: 'relative',
  },

  thumb: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: colors.surfaceTertiary,
  },

  pageBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: 'rgba(22,19,17,0.85)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.brandPrimary,
  },

  pageBadgeText: {
    fontFamily: fonts.text,
    fontSize: 8,
    color: colors.brandPrimary,
    letterSpacing: 1,
    fontWeight: '700',
  },

  cardFooter: {
    padding: spacing.sm,
    gap: 5,
  },

  cardName: {
    fontFamily: fonts.display,
    fontSize: 12,
    fontWeight: '700',
    color: colors.onSurface,
    minHeight: 30,
  },

  cardDesc: {
    ...type.small,
    fontSize: 9,
    lineHeight: 12,
    minHeight: 36,
  },

  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: colors.brandPrimary,
    paddingVertical: 7,
    paddingHorizontal: 3,
    borderRadius: radius.sm,
  },

  printButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.brandPrimary,
    paddingVertical: 7,
    paddingHorizontal: 3,
    borderRadius: radius.sm,
  },

  buttonText: {
    fontFamily: fonts.text,
    fontSize: 8,
    fontWeight: '700',
    color: colors.onBrandPrimary,
    letterSpacing: 1,
  },

  printButtonText: {
    fontFamily: fonts.text,
    fontSize: 8,
    fontWeight: '700',
    color: colors.brandPrimary,
    letterSpacing: 0.7,
  },

  buttonPressed: {
    opacity: 0.75,
  },

  buttonDisabled: {
    opacity: 0.45,
  },

  previewRoot: {
    flex: 1,
    backgroundColor: colors.backdrop,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },

  previewCard: {
    width: '100%',
    maxWidth: 460,
    maxHeight: '94%',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.brandPrimary,
    overflow: 'hidden',
  },

  previewImg: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: colors.surface,
  },

  previewFooter: {
    padding: spacing.lg,
  },

  previewPage: {
    fontFamily: fonts.text,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.brandPrimary,
    marginBottom: 4,
  },

  previewTitle: {
    fontFamily: fonts.display,
    fontSize: 21,
    fontWeight: '700',
    color: colors.onSurface,
  },

  previewDesc: {
    ...type.small,
    marginTop: 4,
    marginBottom: spacing.md,
  },

  previewPrintButton: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.brandPrimary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
  },

  previewPrintButtonText: {
    fontFamily: fonts.text,
    fontSize: 12,
    fontWeight: '700',
    color: colors.onBrandPrimary,
    letterSpacing: 1,
  },

  closeBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(22,19,17,0.88)',
    borderWidth: 1,
    borderColor: colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});