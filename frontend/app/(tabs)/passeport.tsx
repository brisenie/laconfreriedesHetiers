import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator,
  Modal, Dimensions, Linking, Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { colors, spacing, radius, type, fonts } from '@/src/theme';
import { fetchPassport } from '@/src/api';
import ScreenHeader from '@/src/components/ScreenHeader';

const { width } = Dimensions.get('window');
const CARD_W = (width - spacing.lg * 2 - spacing.md) / 2;

export default function PasseportScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<any | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchPassport()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const download = async (item: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    try {
      if (Platform.OS === 'web') {
        Linking.openURL(item.download_url);
        showToast('Ouverture du modèle…');
        return;
      }
      const filename = `${item.name.replace(/\s+/g, '_')}.jpg`;
      const dest = (FileSystem as any).documentDirectory + filename;
      const dl = await FileSystem.downloadAsync(item.download_url, dest);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(dl.uri, { dialogTitle: item.name });
      } else {
        showToast('Téléchargé dans le stockage de l\'app.');
      }
    } catch {
      showToast('Erreur de téléchargement.');
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']} testID="passeport-screen">
      <ScreenHeader title="LE PASSEPORT" subtitle="Modèles à imprimer" icon="passport" />

      {loading ? (
        <ActivityIndicator color={colors.brandPrimary} style={{ marginTop: spacing.xxl }} />
      ) : (
        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {items.map((p) => (
            <View key={p.id} style={[styles.card, { width: CARD_W }]} testID={`passport-card-${p.order}`}>
              <Pressable onPress={() => { Haptics.selectionAsync().catch(() => {}); setPreview(p); }} style={styles.thumbWrap}>
                <Image source={{ uri: p.thumbnail_url }} style={styles.thumb} contentFit="cover" transition={200} />
                <View style={styles.pageBadge}>
                  <Text style={styles.pageBadgeText}>P.{String(p.order).padStart(2, '0')}</Text>
                </View>
              </Pressable>
              <View style={styles.cardFooter}>
                <Text style={styles.cardName} numberOfLines={1}>{p.name}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>{p.description}</Text>
                <Pressable
                  onPress={() => download(p)}
                  style={({ pressed }) => [styles.dlBtn, pressed && { opacity: 0.8 }]}
                  testID={`passport-download-${p.order}`}
                >
                  <MaterialCommunityIcons name="download-outline" size={16} color={colors.onBrandPrimary} />
                  <Text style={styles.dlText}>MODÈLE</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal visible={!!preview} animationType="fade" transparent onRequestClose={() => setPreview(null)}>
        <View style={styles.previewRoot}>
          {preview && (
            <View style={styles.previewCard} testID="passport-preview-modal">
              <Image source={{ uri: preview.thumbnail_url }} style={styles.previewImg} contentFit="contain" />
              <View style={styles.previewFooter}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.previewTitle}>{preview.name}</Text>
                  <Text style={styles.previewDesc}>{preview.description}</Text>
                </View>
                <Pressable onPress={() => download(preview)} style={styles.dlBtnLarge} testID="passport-preview-download">
                  <MaterialCommunityIcons name="download" size={18} color={colors.onBrandPrimary} />
                </Pressable>
              </View>
              <Pressable onPress={() => setPreview(null)} style={styles.closeBtn}>
                <MaterialCommunityIcons name="close" size={22} color={colors.brandPrimary} />
              </Pressable>
            </View>
          )}
        </View>
      </Modal>

      {toast && (
        <View style={styles.toast} testID="passport-toast">
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    padding: spacing.lg, gap: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  card: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.borderStrong,
    overflow: 'hidden',
  },
  thumbWrap: { position: 'relative' },
  thumb: { width: '100%', aspectRatio: 3 / 4, backgroundColor: colors.surfaceTertiary },
  pageBadge: {
    position: 'absolute', top: spacing.sm, left: spacing.sm,
    backgroundColor: 'rgba(22,19,17,0.85)',
    paddingHorizontal: spacing.sm, paddingVertical: 3,
    borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.brandPrimary,
  },
  pageBadgeText: { fontFamily: fonts.text, fontSize: 10, color: colors.brandPrimary, letterSpacing: 1, fontWeight: '700' },
  cardFooter: { padding: spacing.md, gap: 4 },
  cardName: { fontFamily: fonts.display, fontSize: 15, fontWeight: '700', color: colors.onSurface },
  cardDesc: { ...type.small, minHeight: 32 },
  dlBtn: {
    marginTop: spacing.sm,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.brandPrimary,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  dlText: { fontFamily: fonts.text, fontSize: 11, fontWeight: '700', color: colors.onBrandPrimary, letterSpacing: 1.5 },

  previewRoot: { flex: 1, backgroundColor: colors.backdrop, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  previewCard: {
    width: '100%', maxWidth: 420,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg, borderWidth: 2, borderColor: colors.brandPrimary,
    overflow: 'hidden',
  },
  previewImg: { width: '100%', aspectRatio: 3 / 4, backgroundColor: colors.surface },
  previewFooter: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  previewTitle: { fontFamily: fonts.display, fontSize: 20, fontWeight: '700', color: colors.onSurface },
  previewDesc: { ...type.small, marginTop: 2 },
  dlBtnLarge: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: colors.brandPrimary,
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute', top: spacing.md, right: spacing.md,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(22,19,17,0.85)',
    borderWidth: 1, borderColor: colors.brandPrimary,
    alignItems: 'center', justifyContent: 'center',
  },
  toast: {
    position: 'absolute', bottom: spacing.xxxl, alignSelf: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1, borderColor: colors.brandPrimary,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  toastText: { fontFamily: fonts.text, fontSize: 12, color: colors.onSurface },
});
