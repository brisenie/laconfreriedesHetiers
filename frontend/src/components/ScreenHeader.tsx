import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, type, fonts } from '@/src/theme';

type Props = { title: string; subtitle?: string; icon?: any };

export default function ScreenHeader({ title, subtitle, icon }: Props) {
  return (
    <View style={styles.wrap} testID="screen-header">
      <View style={styles.row}>
        {icon && <MaterialCommunityIcons name={icon} size={22} color={colors.brandPrimary} />}
        <Text style={styles.title}>{title}</Text>
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <View style={styles.rule} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md, backgroundColor: colors.surface },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: {
    fontFamily: fonts.display, fontSize: 22, fontWeight: '700',
    color: colors.brandPrimary, letterSpacing: 3,
  },
  subtitle: { ...type.small, marginTop: 2, fontStyle: 'italic' },
  rule: {
    marginTop: spacing.sm,
    height: 1, backgroundColor: colors.brandTertiary, opacity: 0.6,
  },
});
