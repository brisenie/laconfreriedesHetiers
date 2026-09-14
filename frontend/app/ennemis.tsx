import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors, spacing } from '@/src/theme';

const fiches = [
  {
    id: 'infectes',
    nom: 'Les Infectés',
    sousTitre: 'Des êtres mystérieusement corrompus',
    description:
      'Ils attaquent seuls ou en groupe. Ils peuvent être décorrumpus grâce au baume d’argile.',
    image: require('../pnj/Les Infectés.png'),
    quote:
      '« Dix fois ils tomberont. Dix fois ils se relèveront. Seule la dixième chute pourra enfin les éloigner pour quelque temps. »',
  },
  {
    id: 'moumoune',
    nom: 'Moumoune La Saboteuse',
    sousTitre: 'La saboteuse',
    description:
      'Une figure redoutable qui sème le trouble et détourne les plans des Héritiers.',
    image: require('../pnj/Moumoune La saboteuse.png'),
    quote: null,
  },
];

export default function EnnemisScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Retour</Text>
          </Pressable>
        </View>

        <View style={styles.list}>
          {fiches.map((fiche) => (
            <View key={fiche.id} style={styles.card}>
              <Image
                source={fiche.image}
                style={styles.image}
                resizeMode="contain"
              />

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{fiche.nom}</Text>
                <Text style={styles.cardSubtitle}>{fiche.sousTitre}</Text>
                <View style={styles.separator} />
                <Text style={styles.cardDescription}>{fiche.description}</Text>

                {fiche.quote ? (
                  <View style={styles.quoteBox}>
                    <Text style={styles.quoteText}>{fiche.quote}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  content: {
    flexGrow: 1,
    paddingBottom: spacing.xxxl,
  },

  topBar: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },

  backButton: {
    alignSelf: 'flex-start',
  },

  backButtonText: {
    color: colors.onSurfaceSecondary,
    fontSize: 15,
    fontWeight: '700',
  },

  list: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },

  card: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },

  image: {
    width: '100%',
    height: 280,
    backgroundColor: '#1e1513',
  },

  cardContent: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },

  cardTitle: {
    color: colors.onSurface,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },

  cardSubtitle: {
    color: colors.onSurfaceSecondary,
    fontSize: 15,
    marginBottom: spacing.md,
  },

  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },

  cardDescription: {
    color: colors.onSurfaceSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },

  quoteBox: {
    backgroundColor: '#1f1a16',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },

  quoteText: {
    color: colors.onSurface,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
