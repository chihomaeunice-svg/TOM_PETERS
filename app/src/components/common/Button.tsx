import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<Props> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const heights = { sm: 40, md: 50, lg: 58 };
  const fontSizes = { sm: 12, md: 13, lg: 14 };

  if (variant === 'gold') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={[fullWidth && { alignSelf: 'stretch' }, style]}
      >
        <LinearGradient
          colors={[Colors.gold, Colors.goldDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.base,
            { height: heights[size] },
            Shadow.gold,
            disabled && styles.disabled,
          ]}
        >
          {loading
            ? <ActivityIndicator color={Colors.white} size="small" />
            : <Text style={[styles.goldText, { fontSize: fontSizes[size] }, textStyle]}>{label}</Text>
          }
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const bgMap = {
    primary: Colors.charcoal,
    secondary: Colors.beige,
    ghost: 'transparent',
  };

  const textColorMap = {
    primary: Colors.white,
    secondary: Colors.charcoal,
    ghost: Colors.charcoal,
  };

  const borderMap = {
    primary: undefined,
    secondary: undefined,
    ghost: { borderWidth: 1, borderColor: Colors.charcoal },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        { height: heights[size], backgroundColor: bgMap[variant] },
        variant === 'ghost' && borderMap.ghost,
        disabled && styles.disabled,
        Shadow.sm,
        fullWidth && { alignSelf: 'stretch' },
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator color={variant === 'primary' ? Colors.white : Colors.charcoal} size="small" />
        : <Text style={[styles.text, { color: textColorMap[variant], fontSize: fontSizes[size] }, textStyle]}>
            {label}
          </Text>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
  },
  text: {
    ...Typography.labelLG,
    color: Colors.white,
  },
  goldText: {
    ...Typography.labelLG,
    color: Colors.white,
  },
  disabled: {
    opacity: 0.45,
  },
});
