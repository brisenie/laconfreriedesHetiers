import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
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
    id: "capitaine",
    order: 0,
    name: "Capitaine",
    subtitle: "Meneur de la Confrérie",
    description:
      "Le Capitaine est un meneur, un négociateur et un homme de réputation. Là où les autres Héritiers comptent sur leurs armes, leurs connaissances ou leur savoir-faire, le Capitaine peut compter sur son nom, son pavillon et les liens qu\'il a tissés au fil de ses voyages.",
  },
  {
    id: "alchimiste",
    order: 1,
    name: "Alchimiste",
    subtitle: "Maître des potions et des transformations",
    description:
      "L'Alchimiste étudie les plantes, les minéraux et les anciennes recettes afin de fabriquer des potions et des remèdes.",
  },
  {
    id: "bosco",
    order: 2,
    name: "Bosco",
    subtitle: "Gardien de l'équipage",
    description:
      "Le Bosco protège son équipage et utilise sa force pour surmonter les obstacles.",
  },
  {
    id: "bretteur",
    order: 3,
    name: "Bretteur",
    subtitle: "Maître du duel",
    description:
      "Le Bretteur manie son arme avec précision, courage et élégance.",
  },
  {
    id: "chasseur-de-tresors",
    order: 4,
    name: "Chasseur de Trésors",
    subtitle: "Déchiffreur des secrets anciens",
    description:
      "Le Chasseur de Trésors découvre les indices, déchiffre les cartes et retrouve les objets oubliés.",
  },
  {
    id: "eclaireur",
    order: 5,
    name: "Éclaireur",
    subtitle: "Les yeux de la Confrérie",
    description:
      "L'Éclaireur observe les environs, repère les dangers et guide ses compagnons.",
  },
  {
    id: "maitre-des-marees",
    order: 6,
    name: "Maître des Marées",
    subtitle: "Gardien des courants",
    description:
      "Le Maître des Marées comprend les océans, les vents et les courants.",
  },
  {
    id: "medecin-de-bord",
    order: 7,
    name: "Médecin de Bord",
    subtitle: "Protecteur des aventuriers",
    description:
      "Le Médecin de Bord soigne les blessures et veille sur la santé de l'équipage.",
  },
  {
    id: "messager",
    order: 8,
    name: "Messager",
    subtitle: "Porteur des nouvelles",
    description:
      "Le Messager transporte les messages importants entre les membres de la Confrérie.",
  },
  {
    id: "navigateur",
    order: 9,
    name: "Navigateur",
    subtitle: "Guide des mers inconnues",
    description:
      "Le Navigateur utilise les cartes, les étoiles et la boussole pour guider l'équipage.",
  },
  {
    id: "tireur-elite",
    order: 10,
    name: "Tireur d'Élite",
    subtitle: "Maître de la précision",
    description:
      "Le Tireur d'Élite utilise son calme, son observation et sa précision.",
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
  const isNarrow = width < 600;

  useEffect(() => {
    fetchClasses()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Le backend ne connaît pas forcément le Capitaine : on l'ajoute.
          const merged = [
            ...localClasses.filter(
              (local) => !data.some((d: any) => d.name === local.name)
            ),
            ...data,
          ].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setItems(merged);
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

  // Affiche directement la première classe à droite.
  useEffect(() => {
    if (!selected && items.length > 0) {
      setSelected(items[0]);
    }
  }, [items, selected]);

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
        "Le fichier n'a pas pu être préparé."
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

  // Liste des classes à gauche, fiche en grand à droite
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScreenHeader
        title="LES CLASSES"
        subtitle="Les onze voies des Héritiers"
        icon="sword-cross"
      />

      <View
        style={[
          styles.twoColumnContainer,
          isNarrow && styles.twoColumnContainerNarrow,
        ]}
      >
        <ScrollView
          style={[styles.leftColumn, isNarrow && styles.leftColumnNarrow]}
          showsVerticalScrollIndicator={false}
        >
          {items.map((classe) => {
            const active = selected?.id === classe.id;
            return (
              <Pressable
                key={classe.id}
                onPress={() => open(classe)}
                style={({ pressed }) => [
                  styles.listItem,
                  isNarrow && styles.listItemNarrow,
                  active && styles.listItemActive,
                  pressed && { opacity: 0.7 },
                ]}
                testID={`class-card-${classe.order}`}
              >
                {!isNarrow && (
                  <View style={styles.listItemIcon}>
                    <Image
                      source={classImages[classe.name]}
                      style={styles.listItemImage}
                      contentFit="cover"
                      contentPosition="top"
                    />
                  </View>
                )}
                <View style={styles.listItemContent}>
                  <Text
                    style={[
                      styles.listItemIndex,
                      active && styles.listItemTextActive,
                    ]}
                  >
                    N°{String(classe.order).padStart(2, '0')}
                  </Text>
                  <Text
                    style={[
                      styles.listItemName,
                      isNarrow && styles.listItemNameNarrow,
                      active && styles.listItemTextActive,
                    ]}
                    numberOfLines={2}
                  >
                    {classe.name}
                  </Text>
                  {!isNarrow && (
                    <Text
                      style={[
                        styles.listItemSub,
                        active && styles.listItemTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {classe.subtitle}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        <ScrollView
          style={styles.rightColumn}
          contentContainerStyle={[
            styles.rightColumnContent,
            isNarrow && styles.rightColumnContentNarrow,
          ]}
          showsVerticalScrollIndicator={false}
          testID="class-detail"
        >
          {selected && (
            <>
              <Image
                source={classImages[selected.name]}
                style={styles.detailImage}
                contentFit="contain"
                transition={200}
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
            </>
          )}
        </ScrollView>
      </View>
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

  twoColumnContainerNarrow: {
    gap: spacing.sm,
    padding: spacing.sm,
  },

  leftColumn: {
    width: 280,
    flexGrow: 0,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },

  listItem: {
    flexDirection: 'row',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },

  leftColumnNarrow: {
    width: 110,
  },

  listItemNarrow: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },

  listItemActive: {
    backgroundColor: colors.brandPrimary,
  },

  listItemTextActive: {
    color: '#fff',
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

  listItemNameNarrow: {
    fontSize: 12,
  },

  listItemSub: {
    fontSize: 10,
    color: colors.onSurfaceSecondary,
    fontStyle: 'italic',
  },

  rightColumn: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },

  rightColumnContent: {
    padding: spacing.lg,
    alignItems: 'center',
  },

  rightColumnContentNarrow: {
    padding: spacing.sm,
  },

  // Les fiches font 1024 x 1536 : on garde ce ratio pour l'afficher en grand
  detailImage: {
    width: '100%',
    maxWidth: 900,
    aspectRatio: 1024 / 1536,
    marginBottom: spacing.md,
  },

  detailActions: {
    width: '100%',
    maxWidth: 900,
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
    maxWidth: 900,
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
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },

  detailDesc: {
    fontSize: 12,
    color: colors.onSurface,
    lineHeight: 18,
  },

});
