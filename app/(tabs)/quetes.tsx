import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, Pressable, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { colors, spacing, radius, type, fonts } from '@/src/theme';
import { verifyQuests } from '@/src/api';
import ScreenHeader from '@/src/components/ScreenHeader';

const DIFFICULTY_COLORS: Record<string, string> = {
  'Facile': '#6E8B5D',
  'Moyen': '#B8860B',
  'Difficile': '#B8623B',
  'Épique': '#9B4B8B',
};

export default function QuetesScreen() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [quests, setQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const shake = useSharedValue(0);

  const shakeAnim = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  const onSubmit = async () => {
    if (!password.trim()) return;
    setLoading(true);
    setErr(null);
    try {
      const data = await verifyQuests(password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setQuests(data.quests || []);
      setUnlocked(true);
    } catch (e: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      setErr(e.message === 'bad_password' ? 'Code incorrect, matelot.' : 'Erreur de connexion.');
      shake.value = withSequence(
        withTiming(-10, { duration: 60 }),
        withTiming(10, { duration: 60 }),
        withTiming(-6, { duration: 60 }),
        withTiming(0, { duration: 60 }),
      );
    } finally {
      setLoading(false);
    }
  };

  if (!unlocked) {
    return (
      <SafeAreaView style={styles.root} edges={['top']} testID="quetes-locked">
        <ScreenHeader title="LES QUÊTES" subtitle="Zone protégée par la Confrérie" icon="script-text-outline" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.lockCenter}>
            <View style={styles.sealCircle}>
              <MaterialCommunityIcons name="lock-outline" size={64} color={colors.brandPrimary} />
            </View>
            <Text style={styles.lockTitle}>ENTRÉE INTERDITE</Text>
            <Text style={styles.lockHint}>
              Seuls les Héritiers connaissant le mot de passe de la Confrérie peuvent accéder aux quêtes.
            </Text>

            <Animated.View style={[styles.inputWrap, shakeAnim]}>
              <MaterialCommunityIcons name="key-variant" size={20} color={colors.brandPrimary} />
              <TextInput
                testID="quetes-password-input"
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor={colors.onSurfaceSecondary}
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
                onSubmitEditing={onSubmit}
              />
            </Animated.View>

            {err && <Text style={styles.errText} testID="quetes-error">{err}</Text>}

            <Pressable
              onPress={onSubmit}
              disabled={loading}
              style={({ pressed }) => [styles.unlockBtn, pressed && { opacity: 0.85 }, loading && { opacity: 0.6 }]}
              testID="quetes-unlock-btn"
            >
              {loading
                ? <ActivityIndicator color={colors.brandPrimary} />
                : <Text style={styles.unlockText}>ENTRER LE CODE</Text>}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']} testID="quetes-screen">
      <ScreenHeader title="LES QUÊTES" subtitle={`${quests.length} contrats ouverts`} icon="script-text-outline" />
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {quests.map((q) => (
          <View key={q.id} style={styles.questCard} testID={`quest-card-${q.order}`}>
            <View style={styles.questHead}>
              <View style={[styles.diffPill, { backgroundColor: DIFFICULTY_COLORS[q.difficulty] || colors.brandTertiary }]}>
                <Text style={styles.diffText}>{q.difficulty.toUpperCase()}</Text>
              </View>
              <Text style={styles.questNum}>#{String(q.order).padStart(2, '0')}</Text>
            </View>
            <Text style={styles.questTitle}>{q.title}</Text>
            <View style={styles.locRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={14} color={colors.brandPrimary} />
              <Text style={styles.locText}>{q.location}</Text>
            </View>
            <Text style={styles.questDesc}>{q.description}</Text>
            <View style={styles.rewardRow}>
              <MaterialCommunityIcons name="treasure-chest" size={16} color={colors.brandPrimary} />
              <Text style={styles.rewardText}>{q.reward}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },

  lockCenter: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.xl, gap: spacing.md,
  },
  sealCircle: {
    width: 130, height: 130, borderRadius: 65,
    borderWidth: 2, borderColor: colors.brandPrimary,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  lockTitle: {
    fontFamily: fonts.display, fontSize: 22, fontWeight: '700',
    color: colors.brandPrimary, letterSpacing: 3,
  },
  lockHint: {
    ...type.body, textAlign: 'center', color: colors.onSurfaceSecondary,
    marginBottom: spacing.lg,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.brandPrimary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    width: '100%', maxWidth: 340,
    height: 52,
  },
  input: {
    flex: 1, color: colors.onSurface, fontFamily: fonts.text, fontSize: 15,
  },
  errText: { ...type.body, color: colors.error, textAlign: 'center' },
  unlockBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 2, borderColor: colors.brandPrimary,
    paddingVertical: spacing.md, paddingHorizontal: spacing.xl,
    borderRadius: radius.md, minWidth: 220, alignItems: 'center',
  },
  unlockText: { fontFamily: fonts.text, fontWeight: '700', letterSpacing: 2, color: colors.brandPrimary },

  list: { padding: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.md },
  questCard: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.borderStrong,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  questHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  diffPill: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.sm },
  diffText: { fontFamily: fonts.text, fontSize: 10, fontWeight: '700', color: '#FFF', letterSpacing: 1 },
  questNum: { fontFamily: fonts.text, fontSize: 12, color: colors.brandPrimary, letterSpacing: 1.5 },
  questTitle: { fontFamily: fonts.display, fontSize: 18, fontWeight: '700', color: colors.onSurface },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locText: { ...type.small, color: colors.onSurfaceSecondary, fontStyle: 'italic' },
  questDesc: { ...type.body, color: colors.onSurfaceSecondary },
  rewardRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginTop: spacing.xs, paddingTop: spacing.sm,
    borderTopWidth: 1, borderTopColor: colors.divider,
  },
  rewardText: { ...type.small, color: colors.brandPrimary, fontWeight: '600' },
});
