import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface Props {
  sizes: Record<string, number>;
  selected: string | null;
  onSelect: (size: string) => void;
}

export const SizeSelector: React.FC<Props> = ({ sizes, selected, onSelect }) => (
  <View style={styles.container}>
    <Text style={styles.label}>SELECT SIZE</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {SIZES.map(size => {
        const qty = sizes?.[size] ?? 0;
        const isAvailable = qty > 0;
        const isSelected = selected === size;

        return (
          <TouchableOpacity
            key={size}
            onPress={() => isAvailable && onSelect(size)}
            style={[
              styles.sizeBtn,
              isSelected && styles.selected,
              !isAvailable && styles.unavailable,
            ]}
            activeOpacity={isAvailable ? 0.8 : 1}
          >
            <Text
              style={[
                styles.sizeText,
                isSelected && styles.selectedText,
                !isAvailable && styles.unavailableText,
              ]}
            >
              {size}
            </Text>
            {!isAvailable && <View style={styles.strikethrough} />}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  label: {
    ...Typography.labelMD,
    marginBottom: Spacing.sm,
  },
  sizeBtn: {
    width: 52,
    height: 52,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.silk,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  selected: {
    backgroundColor: Colors.charcoal,
    borderColor: Colors.charcoal,
    ...Shadow.sm,
  },
  unavailable: {
    opacity: 0.4,
  },
  sizeText: {
    ...Typography.labelLG,
    fontSize: 12,
    color: Colors.charcoal,
  },
  selectedText: {
    color: Colors.white,
  },
  unavailableText: {
    color: Colors.muted,
  },
  strikethrough: {
    position: 'absolute',
    width: '140%',
    height: 1,
    backgroundColor: Colors.muted,
    transform: [{ rotate: '-45deg' }],
  },
});
