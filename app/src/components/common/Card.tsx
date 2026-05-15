import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Shadow, Spacing } from '../../theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'flat';
  padding?: keyof typeof Spacing;
}

export const Card: React.FC<Props> = ({
  children,
  style,
  variant = 'default',
  padding = 'md',
}) => {
  const variantStyle = {
    default: [styles.default, Shadow.sm],
    elevated: [styles.default, Shadow.md],
    flat: styles.flat,
  }[variant];

  return (
    <View style={[styles.base, variantStyle, { padding: Spacing[padding] }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
  },
  default: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  flat: {
    backgroundColor: Colors.silk,
  },
});
