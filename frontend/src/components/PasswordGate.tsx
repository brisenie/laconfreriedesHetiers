import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, fonts, radius, spacing } from '@/src/theme';
import { normalizePassword } from '@/src/utils/password';
import { useBackClose } from '@/src/hooks/use-web-back';

// Empreinte d'un mot de passe (cyrb53) : le site ne garde que l'empreinte,
// jamais le mot de passe en clair. Majuscules et accents ne comptent pas.
export function passwordHash(value: string): string {
  const text = normalizePassword(value);
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

type Props = {
  visible: boolean;
  title: string;
  hash: string;
  onSuccess: () => void;
  onClose: () => void;
};

// Fenêtre qui demande un mot de passe avant d'ouvrir un contenu réservé
export default function PasswordGate({ visible, title, hash, onSuccess, onClose }: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const close = () => {
    setValue('');
    setError(false);
    onClose();
  };

  useBackClose(visible, close);

  const submit = () => {
    if (passwordHash(value) === hash) {
      setValue('');
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close}>
        <Pressable style={styles.card} onPress={() => {}} testID="password-gate">
          <MaterialCommunityIcons name="lock" size={30} color={colors.brandPrimary} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Accès réservé au Maître du jeu</Text>

          <TextInput
            value={value}
            onChangeText={(text) => {
              setValue(text);
              setError(false);
            }}
            onSubmitEditing={submit}
            placeholder="Mot de passe"
            placeholderTextColor="#8a6842"
            secureTextEntry
            autoFocus
            autoCapitalize="none"
            style={[styles.input, error && styles.inputError]}
            testID="password-input"
          />
          {error ? <Text style={styles.error}>Mot de passe incorrect.</Text> : null}

          <View style={styles.actions}>
            <Pressable onPress={close} style={[styles.button, styles.buttonGhost]}>
              <Text style={[styles.buttonText, styles.buttonGhostText]}>Annuler</Text>
            </Pressable>
            <Pressable onPress={submit} style={styles.button} testID="password-submit">
              <Text style={styles.buttonText}>Ouvrir</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(8, 5, 3, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: '#EAD9B5',
    borderWidth: 2,
    borderColor: colors.brandSecondary,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: '700',
    color: '#3B2718',
    textAlign: 'center',
  },
  subtitle: {
    fontStyle: 'italic',
    fontSize: 13,
    color: '#6B4E2E',
  },
  input: {
    width: '100%',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#C9A86A',
    backgroundColor: '#F6EBD2',
    color: '#2A1E17',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#A3262A',
  },
  error: {
    color: '#A3262A',
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  button: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: '#3B2718',
  },
  buttonGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3B2718',
  },
  buttonText: {
    color: '#F6EBD2',
    fontWeight: '700',
  },
  buttonGhostText: {
    color: '#3B2718',
  },
});
