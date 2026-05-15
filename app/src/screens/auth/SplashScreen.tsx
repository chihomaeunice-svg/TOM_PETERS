import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing } from '../../theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<any, 'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.88)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }),
      ]),
      Animated.delay(200),
      Animated.timing(lineWidth, { toValue: 120, duration: 600, useNativeDriver: false }),
      Animated.delay(100),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(opacity, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start(() => navigation.replace('Login'));
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#1C1C1E', '#2C2416', '#1C1C1E']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Subtle texture overlay lines */}
      <View style={styles.textureLinesContainer}>
        {Array.from({ length: 8 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.textureLine,
              {
                top: (height / 8) * i,
                opacity: 0.04 + i * 0.005,
              },
            ]}
          />
        ))}
      </View>

      <Animated.View style={[styles.centerContent, { opacity, transform: [{ scale }] }]}>
        <Text style={styles.brandPre}>EST. MMXXIV</Text>
        <Text style={styles.brand}>TOM</Text>
        <Animated.View style={[styles.divider, { width: lineWidth }]} />
        <Text style={styles.brand}>PETERS</Text>
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Built for those who move different.
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textureLinesContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  textureLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.gold,
  },
  centerContent: {
    alignItems: 'center',
  },
  brandPre: {
    fontSize: 10,
    fontWeight: '400',
    letterSpacing: 5,
    color: Colors.tan,
    marginBottom: Spacing.md,
    opacity: 0.7,
  },
  brand: {
    fontFamily: 'serif',
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: 14,
    color: Colors.cream,
    lineHeight: 70,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gold,
    marginVertical: Spacing.md,
  },
  tagline: {
    fontFamily: 'serif',
    fontSize: 13,
    fontStyle: 'italic',
    letterSpacing: 1.5,
    color: Colors.tan,
    marginTop: Spacing.xl,
    textAlign: 'center',
  },
});
