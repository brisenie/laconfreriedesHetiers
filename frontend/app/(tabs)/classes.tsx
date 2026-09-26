import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Modal,
  Alert,
  useWindowDimensions,
} from 'react-native';

import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { colors, spacing, radius, type, fonts } from '@/src/theme';
import { fetchClasses } from '@/src/api';
import ScreenHeader from '@/src/components/ScreenHeader';

const classImages: Record<string, any> = {
  Capitaine: require('@/assets/classes/capitaine.png'),
  Alchimiste: require('@/assets/classes/alchimiste.png'),
  Bosco: require('@/assets/classes/Bosco.png'),
  Bretteur: require('@/assets/classes/Bretteur.png'),
  'Chasseur de Trésors': require(
    '@/assets/classes/chasseur de trésors.png'
  ),
  Éclaireur: require('@/assets/classes/éclaireur.png'),
  'Maître des Marées': require(
    '@/assets/classes/maitre_des_marees.png'
  ),
  'Médecin de Bord': require(
    '@/assets/classes/Médecin de bord.png'
  ),
  Messager: require('@/assets/classes/messager.png'),
  Navigateur: require('@/assets/classes/navigateur.png'),
  "Tireur d'Élite": require(
    '@/assets/classes/tireur d_elite.png'
  ),
};

const localClasses = [
  {
    id: 'capitaine',
    order: 0,
    name: 'Capitaine',
    subtitle: 'Meneur de la Confrérie',
    description:
      'Le Capitaine est un meneur, un négociateur et un homme de réputation. Là où les autres Héritiers comptent sur leurs armes, leurs connaissances ou leur savoir-faire, le Capitaine peut compter sur son nom, son pavillon et les liens qu'il a tissés au fil de ses voyages.',
  },
  {
    id: 'alchimiste',
    order: 1,
    name: 'Alchimiste',
    subtitle: 'Maître des potions et des transformations',
    description:
      'L'Alchimiste étudie les plantes, les minéraux et les anciennes recettes afin de fabriquer des potions et des remèdes.',
  },
  {
    id: 'bosco',
    order: 2,
    name: 'Bosco',
    subtitle: 'Gardien de l'équipage',
    description:
      'Le Bosco protège son équipage et utilise sa force pour surmonter les obstacles.',
  },
  {
    id: 'bretteur',
    order: 3,
    name: 'Bretteur',
    subtitle: 'Maître du duel',
    description:
      'Le Bretteur manie son arme avec précision, courage et élégance.',
  },
  {
    id: 'chasseur-de-tresors',
    order: 4,
    name: 'Chasseur de Trésors',
    subtitle: 'Déchiffreur des secrets anciens',
    description:
      'Le Chasseur de Trésors découvre les indices, déchiffre les cartes et retrouve les objets oubliés.',
  },
  {
    id: 'eclaireur',
    order: 5,
    name: 'Éclaireur',
    subtitle: 'Les yeux de la Confrérie',
    description:
      'L'Éclaireur observe les environs, repère les dangers et guide ses compagnons.',
  },
  {
    id: 'maitre-des-marees',
    order: 6,
    name: 'Maître des Marées',
    subtitle: 'Gardien des courants',
    description:
      'Le Maître des Marées comprend les océans, les vents et les courants.',
  },
  {
    id: 'medecin-de-bord',
    order: 7,
    name: 'Médecin de Bord',
    subtitle: 'Protecteur des aventuriers',
    description:
      'Le Médecin de Bord soigne les blessures et veille sur la santé de l'équipage.',
  },
  {
    id: 'messager',
    order: 8,
    name: 'Messager',
    subtitle: 'Porteur des nouvelles',
    description:
      'Le Messager transporte les messages importants entre les membres de la Confrérie.',
  },
  {
    id: 'navigateur',
    order: 9,
    name: 'Navigateur',
    subtitle: 'Guide des mers inconnues',
    description:
      'Le Navigateur utilise les cartes, les étoiles et la boussole pour guider l'équipage.',
  },
  {
    id: 'tireur-elite',
    order: 10,
    name: "Tireur d'Élite",
    subtitle: 'Maître de la précision',
    description:
      'Le Tireur d'Élite utilise son calme, son observation et sa précision.',
  },
];

const buildClassDownloadContent = (classe: any) => {
  return [
    `Classe : ${classe.name}`,
    `Sous-titre : ${classe.subtitle}`,
    `Description : ${classe.description}`,
    '',
    'Confrérie des Héritiers',
  ].join('\n');
};

export default function ClassesScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const { width } = useWindowDimensions();
  const isWideScreen = width >= 800;

  useEffect(() => {
    fetchClasses()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else {
          setItems(localClasses);
        }
      })
      .catch((error) => {
        console.error(
          'Erreur pendant le chargement des classes :',
          error
        );
        setItems(localClasses);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const open = (classe: any) => {
    Haptics.selectionAsync().catch(() => {});
    setSelected(classe);
  };

  const handleDownload = async (classe: any) => {
    Haptics.selectionAsync().catch(() => {});

    try {
      const safeName = (classe.name || 'classe')
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-');
      const fileUri = `${FileSystem.Paths.cache.uri}${safeName || 'classe'}.txt`;

      await FileSystem.writeAsStringAsync(fileUri, buildClassDownloadContent(classe), {
        encoding: 'utf8',
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: `Télécharger ${classe.name}`,
      });
    } catch (error) {
      console.error('Erreur pendant le téléchargement de la classe :', error);
      Alert.alert(
        'Téléchargement impossible',
        'Le fichier n'a pas pu être préparé.'
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <ScreenHeader
          title="LES CLASSES"
          subtitle="Les onze voies des Héritiers"
          icon="sword-cross"
        />
        <ActivityIndicator
          color={colors.brandPrimary}
          style={{ marginTop: spacing.xxl }}
        />
      </SafeAreaView>
    );
  }

  // Two-column layout for wide screens
  if (isWideScreen) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <ScreenHeader
          title="LES CLASSES"
          subtitle="Les onze voies des Héritiers"
          icon="sword-cross"
        />

        <View style={styles.twoColumnContainer}>
          {/* Left sidebar with class list */}
          <ScrollView
            style={styles.leftColumn}
            showsVerticalScrollIndicator={false}
          >
            {items.map((classe) => (
              <Pressable
                key={classe.id}
                onPress={() => setSelected(classe)}
                style={({ pressed }) => [
                  styles.listItem,
                  selected?.id === classe.id && styles.listItemActive,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <View style={styles.listItemIcon}>
                  <Image
                    source={classImages[classe.name]}
                    style={styles.listItemImage}
                    contentFit="cover"
                  />
                </View>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemIndex}>
                    N°{String(classe.order).padStart(2, '0')}
                  </Text>
                  <Text style={styles.listItemName} numberOfLines={1}>
                    {classe.name}
                  </Text>
                  <Text style={styles.listItemSub} numberOfLines={1}>
                    {classe.subtitle}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          {/* Right column with details */}
          {selected && (
            <View style={styles.rightColumn}>
              <Image
                source={classImages[selected.name]}
                style={styles.detailImage}
                contentFit="contain"
              />

              <View style={styles.detailActions}>
                <Pressable
                  style={({ pressed }) => [
                    styles.actionBtn,
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={() => handleDownload(selected)}
                >
                  <MaterialCommunityIcons
                    name="download-outline"
                    size={16}
                    color="#fff"
                  />
                  <Text style={styles.actionBtnText}>Télécharger</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.actionBtn,
                    styles.printBtn,
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    Alert.alert('Imprimer', `Imprimer la fiche de ${selected.name}`);
                  }}
                >
                  <MaterialCommunityIcons
                    name="printer-outline"
                    size={16}
                    color={colors.brandPrimary}
                  />
                  <Text style={[styles.actionBtnText, { color: colors.brandPrimary }]}>
                    Imprimer
                  </Text>
                </Pressable>
              </View>

              <View style={styles.detailInfo}>
                <Text style={styles.detailIndex}>
                  CLASSE N°{String(selected.order).padStart(2, '0')}
                </Text>
                <Text style={styles.detailTitle}>{selected.name}</Text>
                <Text style={styles.detailSub}>{selected.subtitle}</Text>
                <View style={styles.divider} />
                <Text style={styles.detailDesc}>{selected.description}</Text>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Grid layout for mobile screens (original)
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader
        title="LES CLASSES"
        subtitle="Les onze voies des Héritiers"
        icon="sword-cross"
      />

      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {items.map((classe) => (
          <Pressable
            key={classe.id}
            onPress={() => open(classe)}
            style={({ pressed }) => [
              styles.card,
              pressed && { opacity: 0.85 },
            ]}
            testID={`class-card-${classe.order}`}
          >
            <Image
              source={classImages[classe.name]}
              style={styles.cardImg}
              contentFit="cover"
              transition={200}
            />

            <View style={styles.cardFooter}>
              <Text style={styles.cardIndex}>
                N°{String(classe.order).padStart(2, '0')}
              </Text>

              <Text style={styles.cardName} numberOfLines={1}>
                {classe.name}
              </Text>

              <Text style={styles.cardSub} numberOfLines={1}>
                {classe.subtitle}
              </Text>

              <View style={styles.cardActions}>
                <Pressable
                  style={[styles.actionBtn, styles.previewBtn]}
                  onPress={(event) => {
                    event.stopPropagation();
                    open(classe);
                  }}
                >
                  <MaterialCommunityIcons
                    name="eye-outline"
                    size={14}
                    color={colors.brandPrimary}
                  />
                  <Text style={styles.actionText}>Aperçu</Text>
                </Pressable>

                <Pressable
                  style={[styles.actionBtn, styles.downloadBtn]}
                  onPress={(event) => {
                    event.stopPropagation();
                    handleDownload(classe);
                  }}
                >
                  <MaterialCommunityIcons
                    name="download-outline"
                    size={14}
                    color={colors.onSurface}
                  />
                  <Text style={styles.actionText}>Télécharger</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Modal
        visible={selected !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.modalRoot}>
          {selected && (
            <View
              style={styles.modalCard}
              testID="class-detail-modal"
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                  source={classImages[selected.name]}
                  style={styles.modalImg}
                  contentFit="contain"
                />

                <View style={styles.modalBody}>
                  <Text style={styles.modalIndex}>
                    CLASSE N°
                    {String(selected.order).padStart(2, '0')}
                  </Text>

                  <Text style={styles.modalTitle}>
                    {selected.name}
                  </Text>

                  <Text style={styles.modalSub}>
                    {selected.subtitle}
                  </Text>

                  <View style={styles.rule} />

                  <Text style={styles.modalDesc}>
                    {selected.description}
                  </Text>
                </View>
              </ScrollView>

              <Pressable
                onPress={() => setSelected(null)}
                style={styles.closeBtn}
                testID="class-detail-close"
              >
                <MaterialCommunityIcons
                  name="close"
                  size={22}
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

  // Two-column layout styles
  twoColumnContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },

  leftColumn: {
    flex: 0.35,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },

  listItem: {
    flexDirection: 'row',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderWeak,
    gap: spacing.sm,
  },

  listItemActive: {
    backgroundColor: colors.brandPrimary,
  },

  listItemIcon: {
    width: 50,
    height: 50,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceTertiary,
    overflow: 'hidden',
  },

  listItemImage: {
    width: '100%',
    height: '100%',
  },

  listItemContent: {
    flex: 1,
    justifyContent: 'center',
  },

  listItemIndex: {
    fontSize: 8,
    color: colors.brandPrimary,
    letterSpacing: 1,
    fontWeight: '600',
  },

  listItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.onSurface,
  },

  listItemSub: {
    fontSize: 10,
    color: colors.onSurfaceVariant,
    fontStyle: 'italic',
  },

  rightColumn: {
    flex: 0.65,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  detailImage: {
    width: '100%',
    height: '60%',
    marginBottom: spacing.md,
  },

  detailActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },

  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.brandPrimary,
    borderRadius: radius.sm,
    gap: spacing.xs,
  },

  printBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.brandPrimary,
  },

  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },

  detailInfo: {
    width: '100%',
  },

  detailIndex: {
    fontSize: 10,
    color: colors.brandPrimary,
    letterSpacing: 2,
    fontWeight: '600',
  },

  detailTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
    marginTop: spacing.xs,
  },

  detailSub: {
    fontSize: 12,
    color: colors.brandPrimary,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },

  divider: {
    height: 1,
    backgroundColor: colors.borderWeak,
    marginVertical: spacing.sm,
  },

  detailDesc: {
    fontSize: 12,
    color: colors.onSurface,
    lineHeight: 18,
  },

  // Grid layout styles (mobile)
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.lg,
    rowGap: spacing.md,
    columnGap: spacing.md,
    paddingBottom: spacing.xxxl,
  },

  card: {
    flexBasis: '47%',
    flexGrow: 0,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    overflow: 'hidden',
  },

  cardImg: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: colors.surfaceTertiary,
  },

  cardFooter: {
    padding: spacing.md,
  },

  cardIndex: {
    fontFamily: fonts.text,
    fontSize: 10,
    color: colors.brandPrimary,
    letterSpacing: 2,
    marginBottom: 2,
  },

  cardName: {
    fontFamily: fonts.display,
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
  },

  cardSub: {
    ...type.small,
    fontStyle: 'italic',
    marginTop: 2,
  },

  cardActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },

  previewBtn: {
    backgroundColor: colors.surface,
    borderColor: colors.brandPrimary,
  },

  downloadBtn: {
    backgroundColor: colors.brandPrimary,
    borderColor: colors.brandPrimary,
  },

  actionText: {
    fontFamily: fonts.text,
    fontSize: 11,
    fontWeight: '600',
    color: colors.onSurface,
  },

  modalRoot: {
    flex: 1,
    backgroundColor: colors.backdrop,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },

  modalCard: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.brandPrimary,
    overflow: 'hidden',
  },

  modalImg: {
    width: '100%',
    aspectRatio: 2 / 3,
    backgroundColor: colors.surface,
  },

  modalBody: {
    padding: spacing.lg,
  },

  modalIndex: {
    fontFamily: fonts.text,
    fontSize: 11,
    color: colors.brandPrimary,
    letterSpacing: 3,
  },

  modalTitle: {
    fontFamily: fonts.display,
    fontSize: 26,
    fontWeight: '700',
    color: colors.onSurface,
    marginTop: 4,
  },

  modalSub: {
    ...type.body,
    fontStyle: 'italic',
    color: colors.brandPrimary,
    marginTop: 4,
  },

  rule: {
    height: 1,
    backgroundColor: colors.brandTertiary,
    marginVertical: spacing.md,
    opacity: 0.6,
  },

  modalDesc: {
    ...type.body,
  },

  closeBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(22,19,17,0.85)',
    borderWidth: 1,
    borderColor: colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
