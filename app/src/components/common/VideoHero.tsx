import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme';

const { width, height } = Dimensions.get('window');

interface Props {
  videoUri?: string;
  children?: React.ReactNode;
  height?: number;
  gradientColors?: string[];
  style?: ViewStyle;
}

export const VideoHero: React.FC<Props> = ({
  videoUri,
  children,
  height: heroHeight = height,
  gradientColors = [
    'transparent',
    'rgba(28,28,30,0.3)',
    'rgba(28,28,30,0.75)',
    'rgba(28,28,30,0.92)',
  ],
  style,
}) => {
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    if (videoRef.current && videoUri) {
      videoRef.current.playAsync();
    }
  }, [videoUri]);

  return (
    <View style={[styles.container, { height: heroHeight }, style]}>
      {videoUri ? (
        <Video
          ref={videoRef}
          source={{ uri: videoUri }}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.COVER}
          isLooping
          isMuted
          shouldPlay
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.placeholder]} />
      )}
      <LinearGradient
        colors={gradientColors}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />
      {children && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    overflow: 'hidden',
  },
  placeholder: {
    backgroundColor: Colors.charcoal,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    paddingBottom: 60,
    paddingHorizontal: 28,
  },
});
