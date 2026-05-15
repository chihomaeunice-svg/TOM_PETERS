import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  FlatList,
  StatusBar,
  Alert,
} from 'react-native';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SizeSelector } from '../../components/customer/SizeSelector';
import { Button } from '../../components/common/Button';
import { useCart } from '../../hooks/useCart';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<any, 'ProductDetail'>;

export const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { product } = route.params as any;
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const heartScale = useRef(new Animated.Value(1)).current;

  const images = product.images?.length ? product.images : [''];
  const totalStock = product.sizes
    ? Object.values(product.sizes as Record<string, number>).reduce((a, b) => a + b, 0)
    : 0;
  const isLow = totalStock > 0 && totalStock < 10;

  const handleAddToCart = () => {
    if (!selectedSize) { Alert.alert('Select a size', 'Please choose your size before adding to cart.'); return; }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: images[0],
      size: selectedSize,
      qty: 1,
      sellerId: product.sellerId,
    });
    Alert.alert('Added to Bag', `${product.name} (${selectedSize}) added to your bag.`, [
      { text: 'View Bag', onPress: () => navigation.navigate('Cart') },
      { text: 'Continue Shopping', style: 'cancel' },
    ]);
  };

  const toggleWishlist = () => {
    setWishlist(v => !v);
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.4, useNativeDriver: true }),
      Animated.spring(heartScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false} bounces>
        {/* Image Carousel */}
        <View style={styles.imagesContainer}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e =>
              setActiveImage(Math.round(e.nativeEvent.contentOffset.x / width))
            }
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item }) => (
              <View style={styles.imageSlide}>
                <Image
                  source={item ? { uri: item } : require('../../../assets/placeholder.png')}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              </View>
            )}
          />

          {/* Image dots */}
          <View style={styles.dots}>
            {images.map((_: any, i: number) => (
              <View key={i} style={[styles.dot, activeImage === i && styles.dotActive]} />
            ))}
          </View>

          {/* Back button */}
          <TouchableOpacity
            style={[styles.backBtn, { top: insets.top + 12 }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.charcoal} />
          </TouchableOpacity>

          {/* Wishlist */}
          <TouchableOpacity
            style={[styles.wishlistBtn, { top: insets.top + 12 }]}
            onPress={toggleWishlist}
          >
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Ionicons
                name={wishlist ? 'heart' : 'heart-outline'}
                size={22}
                color={wishlist ? '#C0392B' : Colors.charcoal}
              />
            </Animated.View>
          </TouchableOpacity>

          {/* Badges */}
          {product.isLimitedDrop && (
            <View style={styles.limitedBadge}>
              <Ionicons name="flash" size={12} color={Colors.white} />
              <Text style={styles.limitedBadgeText}>LIMITED DROP</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.info}>
          <View style={styles.topRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category?.toUpperCase()}</Text>
            </View>
            {isLow && (
              <View style={styles.lowBadge}>
                <Text style={styles.lowBadgeText}>ONLY {totalStock} LEFT</Text>
              </View>
            )}
          </View>

          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.sellerName}>by {product.sellerName}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price?.toFixed(2)}</Text>
            {product.originalPrice && product.originalPrice > product.price && (
              <Text style={styles.originalPrice}>${product.originalPrice?.toFixed(2)}</Text>
            )}
          </View>

          <View style={styles.divider} />

          {/* Size Selector */}
          <SizeSelector
            sizes={product.sizes || {}}
            selected={selectedSize}
            onSelect={setSelectedSize}
          />

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.descLabel}>DESCRIPTION</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <View style={styles.tagsRow}>
              {product.tags.map((tag: string) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Details */}
          <View style={styles.detailsCard}>
            {[
              { icon: 'cube-outline', label: 'Material', value: 'Premium cotton blend' },
              { icon: 'resize-outline', label: 'Fit', value: 'Regular fit, true to size' },
              { icon: 'refresh-outline', label: 'Care', value: 'Machine wash cold, lay flat to dry' },
              { icon: 'earth-outline', label: 'Origin', value: 'Ethically manufactured' },
            ].map(d => (
              <View key={d.label} style={styles.detailRow}>
                <Ionicons name={d.icon as any} size={16} color={Colors.gold} />
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>{d.label}</Text>
                  <Text style={styles.detailValue}>{d.value}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Fixed Add to Cart */}
      <View style={styles.addToCartContainer}>
        <LinearGradient
          colors={['transparent', Colors.cream]}
          style={styles.cartGrad}
          pointerEvents="none"
        />
        <View style={styles.cartActions}>
          <Button
            label="ADD TO BAG"
            onPress={handleAddToCart}
            variant="gold"
            size="lg"
            style={styles.addBtn}
            fullWidth
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  imagesContainer: {
    height: width * 1.2,
    backgroundColor: Colors.beige,
  },
  imageSlide: {
    width,
    height: width * 1.2,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  dots: {
    position: 'absolute',
    bottom: Spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    width: 20,
    backgroundColor: Colors.white,
  },
  backBtn: {
    position: 'absolute',
    left: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  wishlistBtn: {
    position: 'absolute',
    right: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  limitedBadge: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    gap: 5,
  },
  limitedBadgeText: {
    ...Typography.labelMD,
    color: Colors.white,
    fontSize: 9,
    letterSpacing: 1.5,
  },
  info: {
    padding: Spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    backgroundColor: Colors.beige,
    borderRadius: Radius.full,
  },
  categoryText: {
    ...Typography.labelMD,
    fontSize: 9,
    color: Colors.taupe,
  },
  lowBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    backgroundColor: '#FFF0E0',
    borderRadius: Radius.full,
  },
  lowBadgeText: {
    ...Typography.labelMD,
    fontSize: 9,
    color: Colors.warning,
  },
  name: {
    ...Typography.displayLG,
    marginBottom: 4,
  },
  sellerName: {
    ...Typography.bodySM,
    color: Colors.taupe,
    marginBottom: Spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  price: {
    ...Typography.price,
    fontSize: 26,
  },
  originalPrice: {
    ...Typography.bodyMD,
    color: Colors.muted,
    textDecorationLine: 'line-through',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  descLabel: {
    ...Typography.labelMD,
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.bodyLG,
    color: Colors.mid,
    lineHeight: 26,
    marginBottom: Spacing.md,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    backgroundColor: Colors.silk,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    ...Typography.bodySM,
    color: Colors.taupe,
  },
  detailsCard: {
    backgroundColor: Colors.silk,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  detailInfo: { flex: 1 },
  detailLabel: {
    ...Typography.labelMD,
    fontSize: 9,
    marginBottom: 2,
  },
  detailValue: {
    ...Typography.bodySM,
    color: Colors.mid,
  },
  addToCartContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  cartGrad: {
    height: 40,
  },
  cartActions: {
    backgroundColor: Colors.cream,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  addBtn: { height: 56 },
});
