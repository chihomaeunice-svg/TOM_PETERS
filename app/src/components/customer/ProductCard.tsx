import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import type { Product } from '../../services/firestore';

const { width } = Dimensions.get('window');
const CARD_W = (width - Spacing.md * 3) / 2;

interface Props {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<Props> = ({ product, onPress }) => {
  const totalStock = product.sizes
    ? Object.values(product.sizes).reduce((a, b) => a + b, 0)
    : 0;
  const isLow = totalStock > 0 && totalStock < 10;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageWrap}>
        <Image
          source={
            product.images?.[0]
              ? { uri: product.images[0] }
              : require('../../../assets/placeholder.png')
          }
          style={styles.image}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(28,28,30,0.35)']}
          style={styles.imgGradient}
        />
        {product.isLimitedDrop && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>DROP</Text>
          </View>
        )}
        {isLow && !product.isLimitedDrop && (
          <View style={[styles.badge, styles.lowBadge]}>
            <Text style={styles.badgeText}>LOW STOCK</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.category} numberOfLines={1}>
          {product.category?.toUpperCase()}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>${product.price?.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  imageWrap: {
    width: CARD_W,
    height: CARD_W * 1.25,
    backgroundColor: Colors.beige,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imgGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  badge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  lowBadge: {
    backgroundColor: Colors.taupe,
  },
  badgeText: {
    ...Typography.labelMD,
    color: Colors.white,
    fontSize: 9,
    letterSpacing: 1.2,
  },
  info: {
    padding: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  category: {
    ...Typography.labelMD,
    fontSize: 9,
    color: Colors.taupe,
    marginBottom: 3,
  },
  name: {
    ...Typography.bodyMD,
    fontWeight: '600',
    color: Colors.charcoal,
    marginBottom: 4,
    lineHeight: 19,
  },
  price: {
    ...Typography.price,
    fontSize: 16,
    color: Colors.charcoal,
  },
});
