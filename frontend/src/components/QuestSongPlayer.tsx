import React from 'react';
import { Linking, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBackClose } from '@/src/hooks/use-web-back';

const SONG_URL = 'https://www.youtube.com/watch?v=culCToPiSwg';

export default function QuestSongPlayer({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  useBackClose(visible, onClose);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Chanson · Quête 1</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Fermer la chanson" onPress={onClose} style={styles.close}>
              <MaterialCommunityIcons name="close" size={26} color="#F6EBD2" />
            </Pressable>
          </View>
          {visible && Platform.OS === 'web' && React.createElement('iframe', {
            src: 'https://www.youtube.com/embed/culCToPiSwg?autoplay=1&playsinline=1',
            title: 'Chanson de la quête 1',
            allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen',
            allowFullScreen: true,
            style: { width: '100%', aspectRatio: '16 / 9', border: 0 },
          })}
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL(SONG_URL)} style={styles.link}>
            <Text style={styles.linkText}>Écouter sur YouTube</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(8,5,3,0.96)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: { width: '100%', maxWidth: 720, borderWidth: 1, borderColor: '#C9A86A', borderRadius: 12, overflow: 'hidden', backgroundColor: '#2A1E17' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 16 },
  title: { color: '#F6EBD2', fontSize: 18, fontWeight: '700' },
  close: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  link: { padding: 16, alignItems: 'center' },
  linkText: { color: '#F6EBD2', textDecorationLine: 'underline' },
});
