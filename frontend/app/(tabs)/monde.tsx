import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, spacing, radius, type } from '@/src/theme';
import { fetchWorld } from '@/src/api';
import ScreenHeader from '@/src/components/ScreenHeader';

export default function MondeScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetchWorld()
      .then(setData)
      .catch(() => setErr('Impossible de charger le monde.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={['top']} testID="monde-screen">
      <ScreenHeader title="LE MONDE" subtitle="Chroniques des mers oubliées" icon="ship-wheel" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading && <ActivityIndicator color={colors.brandPrimary} style={{ marginTop: spacing.xxl }} />}
        {err && <Text style={styles.err} testID="monde-error">{err}</Text>}

        {data && (
          <>
            <View style={styles.parchment}>
              <Text style={styles.parchmentTitle}>{data.title}</Text>
              <View style={styles.divider} />
              <Text style={styles.parchmentBody}>{data.intro}</Text>
            </View>

            {data.sections?.map((s: any, i: number) => (
              <View key={i} style={styles.parchment} testID={`monde-section-${i}`}>
                <View style={styles.sectionHead}>
                  <MaterialCommunityIcons name="star-four-points-outline" size={16} color={colors.onSurfaceInverse} />
                  <Text style={styles.parchmentHead}>{s.heading}</Text>
                </View>
                <Text style={styles.parchmentBody}>{s.body}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.lg },
  err: { ...type.body, color: colors.error, textAlign: 'center' },
  parchment: {
    backgroundColor: colors.surfaceInverse,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1, borderColor: colors.brandSecondary,
  },
  parchmentTitle: {
    fontFamily: type.h2.fontFamily, fontSize: 22, fontWeight: '700',
    color: colors.onSurfaceInverse, textAlign: 'center', letterSpacing: 1,
  },
  divider: {
    height: 1, backgroundColor: colors.brandTertiary,
    marginVertical: spacing.md, marginHorizontal: spacing.xl,
  },
  parchmentBody: {
    fontFamily: type.body.fontFamily, fontSize: 14, lineHeight: 22,
    color: colors.onSurfaceInverse,
  },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  parchmentHead: {
    fontFamily: type.h3.fontFamily, fontSize: 17, fontWeight: '700',
    color: colors.onSurfaceInverse,
  },
});
