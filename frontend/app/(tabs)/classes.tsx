import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Modal,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { colors, spacing, radius, type, fonts } from '@/src/theme';
import { fetchClasses } from '@/src/api';
import ScreenHeader from '@/src/components/ScreenHeader';

export default function ClassesScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    fetchClasses()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const open = (c: any) => {
    Haptics.selectionAsync().catch(() => {});
    setSelected(c);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']} testID="classes-screen">
      <ScreenHeader title="LES CLASSES" subtitle="Les dix voies des Héritiers" icon="sword-cross" />

      {loading ? (
        <ActivityIndicator color={colors.brandPrimary} style={{ marginTop: spacing.xxl }} />
      ) : (
        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {items.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => open(c)}
              style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
              testID={`class-card-${c.order}`}
            >
              <Image source={{ uri: c.image_url }} style={styles.cardImg} contentFit="cover" transition={200} />
              <View style={styles.cardFooter}>
                <Text style={styles.cardIndex}>N°{String(c.order).padStart(2, '0')}</Text>
                <Text style={styles.cardName} numberOfLines={1}>{c.name}</Text>
                <Text style={styles.cardSub} numberOfLines={1}>{c.subtitle}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <Modal visible={!!selected} animationType="fade" transparent onRequestClose={() => setSelected(null)}>
        <View style={styles.modalRoot}>
          {selected && (
            <View style={styles.modalCard} testID="class-detail-modal">
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={{ uri: selected.image_url }} style={styles.modalImg} contentFit="contain" />
                <View style={styles.modalBody}>
                  <Text style={styles.modalIndex}>CLASSE N°{String(selected.order).padStart(2, '0')}</Text>
                  <Text style={styles.modalTitle}>{selected.name}</Text>
                  <Text style={styles.modalSub}>{selected.subtitle}</Text>
                  <View style={styles.rule} />
                  <Text style={styles.modalDesc}>{selected.description}</Text>
                </View>
              </ScrollView>
              <Pressable onPress={() => setSelected(null)} style={styles.closeBtn} testID="class-detail-close">
                <MaterialCommunityIcons name="close" size={22} color={colors.brandPrimary} />
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    padding: spacing.lg, rowGap: spacing.md, columnGap: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  card: {
    flexBasis: '47%',
    flexGrow: 0,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.borderStrong,
    overflow: 'hidden',
  },
  cardImg: { width: '100%', aspectRatio: 3 / 4, backgroundColor: colors.surfaceTertiary },
  cardFooter: { padding: spacing.md },
  cardIndex: { fontFamily: fonts.text, fontSize: 10, color: colors.brandPrimary, letterSpacing: 2, marginBottom: 2 },
  cardName: { fontFamily: fonts.display, fontSize: 16, fontWeight: '700', color: colors.onSurface },
  cardSub: { ...type.small, fontStyle: 'italic', marginTop: 2 },

  modalRoot: {
    flex: 1, backgroundColor: colors.backdrop,
    alignItems: 'center', justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%', maxWidth: 400, maxHeight: '90%',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    borderWidth: 2, borderColor: colors.brandPrimary,
    overflow: 'hidden',
  },
  modalImg: { width: '100%', aspectRatio: 2 / 3, backgroundColor: colors.surface },
  modalBody: { padding: spacing.lg },
  modalIndex: { fontFamily: fonts.text, fontSize: 11, color: colors.brandPrimary, letterSpacing: 3 },
  modalTitle: { fontFamily: fonts.display, fontSize: 26, fontWeight: '700', color: colors.onSurface, marginTop: 4 },
  modalSub: { ...type.body, fontStyle: 'italic', color: colors.brandPrimary, marginTop: 4 },
  rule: { height: 1, backgroundColor: colors.brandTertiary, marginVertical: spacing.md, opacity: 0.6 },
  modalDesc: { ...type.body },
  closeBtn: {
    position: 'absolute', top: spacing.md, right: spacing.md,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(22,19,17,0.85)',
    borderWidth: 1, borderColor: colors.brandPrimary,
    alignItems: 'center', justifyContent: 'center',
  },
});
