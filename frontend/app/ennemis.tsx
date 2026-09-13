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

const ennemis = [
  {
    id: 'infectes',
    nom: 'Les Infectés',
    description: 'Des créatures corrompues qui hantent les terres oubliées.',
    image: require('../pnj/Les Infectés.png'),
  },
];

export default function EnnemisScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </Pressable>

        <Text style={styles.title}>Ennemis</Text>
        <Text style={styles.subtitle}>
          Liste des menaces connues et des créatures encore non identifiées.
        </Text>

        {ennemis.map((ennemi) => (
          <Pressable
            key={ennemi.id}
            style={styles.card}
            onPress={() => {
              if (ennemi.id === 'infectes') {
                router.push('/pnj');
              }
            }}
          >
            <Image source={ennemi.image} style={styles.image} resizeMode="cover" />

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{ennemi.nom}</Text>
              <Text style={styles.cardDescription}>{ennemi.description}</Text>
            </View>
          </Pressable>
        ))}
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
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },

  backButtonText: {
    color: colors.onSurfaceSecondary,
    fontSize: 15,
    fontWeight: '700',
  },

  title: {
    color: colors.onSurface,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },

  subtitle: {
    color: colors.onSurfaceSecondary,
    fontSize: 15,
    marginBottom: spacing.xl,
  },

  card: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  image: {
    width: '100%',
    height: 220,
    backgroundColor: '#1e1513',
  },

  cardContent: {
    padding: spacing.lg,
  },

  cardTitle: {
    color: colors.onSurface,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },

  cardDescription: {
    color: colors.onSurfaceSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
