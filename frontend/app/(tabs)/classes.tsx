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
    id: 'alchimiste',
    order: 1,
    name: 'Alchimiste',
    subtitle: 'Maître des potions et des transformations',
    description:
      'L’Alchimiste étudie les plantes, les minéraux et les anciennes recettes afin de fabriquer des potions et des remèdes.',
  },
  {
    id: 'bosco',
    order: 2,
    name: 'Bosco',
    subtitle: 'Gardien de l’équipage',
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
      'L’Éclaireur observe les environs, repère les dangers et guide ses compagnons.',
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
      'Le Médecin de Bord soigne les blessures et veille sur la santé de l’équipage.',
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
      'Le Navigateur utilise les cartes, les étoiles et la boussole pour guider l’équipage.',
  },
  {
    id: 'tireur-elite',
    order: 10,
    name: "Tireur d'Élite",
    subtitle: 'Maître de la précision',
    description:
      'Le Tireur d’Élite utilise son calme, son observation et sa précision.',
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
        .replace(/[\u0300-\u036f]/g, '')
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
        'Le fichier n’a pas pu être préparé.'
      );
    }
  };

  return (
    <SafeAreaView
      style={styles.root}
      edges={['top']}
      testID="classes-screen"
    >
      <ScreenHeader
        title="LES CLASSES"
        subtitle="Les dix voies des Héritiers"
        icon="sword-cross"
      />

      {loading ? (
        <ActivityIndicator
          color={colors.brandPrimary}
          style={{ marginTop: spacing.xxl }}
        />
      ) : (
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
      )}

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

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
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