import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, spacing, radius, type, fonts } from '@/src/theme';
import { fetchJournal } from '@/src/api';
import ScreenHeader from '@/src/components/ScreenHeader';

const MONTHS = ['JANV', 'FÉVR', 'MARS', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC'];
const LAST_JOURNAL_IMAGE = require('../../frontend/assets/images/journal/journal des infectés.jpg');
const SECOND_JOURNAL_IMAGE = require('../../frontend/assets/images/journal/le message des anciens.png');
const FIRST_JOURNAL_IMAGE = require('../../frontend/assets/images/journal/chasse 2026.png');

function formatDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { day: '??', month: '???', year: '' };
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: MONTHS[d.getMonth()],
    year: String(d.getFullYear()),
  };
}

export default function JournalScreen() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJournal()
      .then(setEntries)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={['top']} testID="journal-screen">
      <ScreenHeader title="LE JOURNAL" subtitle="Chronique des jours passés" icon="notebook-outline" />

      {loading ? (
        <ActivityIndicator color={colors.brandPrimary} style={{ marginTop: spacing.xxl }} />
      ) : entries.length === 0 ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons name="notebook-outline" size={48} color={colors.brandTertiary} />
          <Text style={styles.emptyText}>Aucune entrée pour l'instant.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {entries.map((e, index) => {
            const d = formatDate(e.date);
            const isFirstEntry = index === 0;
            const isSecondEntry = index === 1;
            const isLastEntry = index === entries.length - 1;
            return (
              <View key={e.id} style={styles.entry} testID={`journal-entry-${e.id}`}>
                <View style={styles.dateCol}>
                  <Text style={styles.dateDay}>{d.day}</Text>
                  <Text style={styles.dateMonth}>{d.month}</Text>
                  <Text style={styles.dateYear}>{d.year}</Text>
                </View>
                <View style={styles.parchment}>
                  {isFirstEntry ? (
                    <Image source={FIRST_JOURNAL_IMAGE} style={styles.lastEntryImage} contentFit="contain" />
                  ) : isSecondEntry ? (
                    <Image source={SECOND_JOURNAL_IMAGE} style={styles.lastEntryImage} contentFit="contain" />
                  ) : isLastEntry ? (
                    <Image source={LAST_JOURNAL_IMAGE} style={styles.lastEntryImage} contentFit="contain" />
                  ) : (
                    <>
                      <Text style={styles.entryTitle}>{e.title}</Text>
                      <View style={styles.rule} />
                      <Text style={styles.entryBody}>{e.body}</Text>
                    </>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  list: { padding: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.lg },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emptyText: { ...type.body, color: colors.onSurfaceSecondary, fontStyle: 'italic' },
  entry: { flexDirection: 'row', gap: spacing.md },
  dateCol: {
    width: 64, alignItems: 'center', justifyContent: 'flex-start',
    paddingTop: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.borderStrong,
    paddingBottom: spacing.md,
  },
  dateDay: { fontFamily: fonts.display, fontSize: 26, fontWeight: '700', color: colors.brandPrimary, lineHeight: 30 },
  dateMonth: { fontFamily: fonts.text, fontSize: 11, color: colors.onSurface, letterSpacing: 1.5, marginTop: 2 },
  dateYear: { fontFamily: fonts.text, fontSize: 10, color: colors.onSurfaceSecondary, marginTop: 2 },
  parchment: {
    flex: 1,
    backgroundColor: colors.surfaceInverse,
    borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.brandSecondary,
    padding: spacing.md,
  },
  lastEntryImage: { width: '100%', aspectRatio: 2 / 3, borderRadius: radius.sm },
  entryTitle: {
    fontFamily: fonts.display, fontSize: 18, fontWeight: '700',
    color: colors.onSurfaceInverse,
  },
  rule: { height: 1, backgroundColor: colors.brandTertiary, marginVertical: spacing.sm, opacity: 0.5 },
  entryBody: {
    fontFamily: fonts.text, fontSize: 13, lineHeight: 20,
    color: colors.onSurfaceInverse,
  },
});
