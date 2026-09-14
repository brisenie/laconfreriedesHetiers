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

const infectes = {
  id: 'infectes',
  nom: 'Les Infectés',
  sousTitre: 'Des êtres mystérieusement corrompus',
  description:
    'Ils attaquent seuls ou en groupe. Ils peuvent être décorrumpus grâce au baume d’argile.',
  image: require('../pnj/Les Infectés.png'),
};

export default function EnnemisScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </Pressable>

        <View style={styles.card}>
          <Image
            source={infectes.image}
            style={styles.image}
            resizeMode="contain"
          />

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{infectes.nom}</Text>
            <Text style={styles.cardSubtitle}>{infectes.sousTitre}</Text>
            <View style={styles.separator} />
            <Text style={styles.cardDescription}>{infectes.description}</Text>

            <View style={styles.quoteBox}>
              <Text style={styles.quoteText}>
                « Dix fois ils tomberont. Dix fois ils se relèveront. Seule la dixième
                chute pourra enfin les éloigner pour quelque temps. »
              </Text>
            </View>
          </View>
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
    padding: 0,
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },

  backButtonText: {
    color: colors.onSurfaceSecondary,
    fontSize: 15,
    fontWeight: '700',
  },

  card: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 0,
    overflow: 'hidden',
    borderWidth: 0,
    borderColor: colors.border,
    minHeight: '100%',
  },

  image: {
    width: '100%',
    height: 360,
    backgroundColor: '#1e1513',
  },

  cardContent: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxxl,
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
