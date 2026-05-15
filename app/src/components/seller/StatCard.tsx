import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';

interface Props {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  trend?: number;
  accent?: string;
}

export const StatCard: React.FC<Props> = ({
  label,
  value,
  icon,
  trend,
  accent = Colors.gold,
}) => (
  <View style={[styles.card, Shadow.md]}>
    <View style={[styles.iconWrap, { backgroundColor: accent + '18' }]}>
      <Ionicons name={icon} size={20} color={accent} />
    </View>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
    {trend !== undefined && (
      <View style={styles.trendRow}>
        <Ionicons
          name={trend >= 0 ? 'trending-up' : 'trending-down'}
          size={12}
          color={trend >= 0 ? Colors.success : Colors.error}
        />
        <Text style={[styles.trend, { color: trend >= 0 ? Colors.success : Colors.error }]}>
          {' '}{Math.abs(trend)}%
        </Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  value: {
    ...Typography.displayMD,
    fontSize: 24,
    color: Colors.charcoal,
    marginBottom: 2,
  },
  label: {
    ...Typography.labelMD,
    color: Colors.taupe,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trend: {
    ...Typography.bodySM,
    fontWeight: '600',
  },
});
