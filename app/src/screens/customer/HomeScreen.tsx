import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VideoHero } from '../../components/common/VideoHero';
import { ProductCard } from '../../components/customer/ProductCard';
import { DropCountdown } from '../../components/customer/DropCountdown';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { getProducts, getLimitedDrops, Product } from '../../services/firestore';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<any, 'Home'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { profile } = useAuth();
  const { totalItems } = useCart();
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<Product[]>([]);
  const [drops, setDrops] = useState<Product[]>([]);

  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, { toValue: 1, duration: 900, delay: 200, useNativeDriver: true }),
      Animated.timing(heroSlide, { toValue: 0, duration: 900, delay: 200, useNativeDriver: true }),
    ]).start();

    Promise.all([getProducts(), getLimitedDrops()]).then(([p, d]) => {
      setProducts(p.slice(0, 6));
      setDrops(d.slice(0, 3));
    }).catch(() => {});
  }, []);

  const categories = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Accessories'];
  const [activeCategory, setActiveCategory] = useState('All');
  const visibleProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Cart badge in corner */}
      <View style={[styles.cartFab, { top: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => navigation.navigate('Cart')}
        >
          <Ionicons name="bag-outline" size={22} color={Colors.charcoal} />
          {totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces>
        {/* Full-screen Cinematic Hero */}
        <VideoHero height={height * 0.88}>
          <Animated.View
            style={[
              styles.heroContent,
              { opacity: heroOpacity, transform: [{ translateY: heroSlide }] },
            ]}
          >
            <Text style={styles.heroEst}>EST. MMXXIV</Text>
            <Text style={styles.heroTitle}>Built for{'\n'}those who{'\n'}move different.</Text>
            <View style={styles.heroLine} />
            <TouchableOpacity
              style={styles.shopNowBtn}
              onPress={() => navigation.navigate('Shop')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[Colors.gold, Colors.goldDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.shopNowGrad}
              >
                <Text style={styles.shopNowText}>SHOP NOW</Text>
                <Ionicons name="arrow-forward" size={14} color={Colors.white} style={{ marginLeft: 8 }} />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </VideoHero>

        {/* Marquee Brand Strip */}
        <View style={styles.marqueeStrip}>
          {['PREMIUM', '✦', 'EXCLUSIVE', '✦', 'LIMITED', '✦', 'TOM PETERS', '✦', 'PREMIUM', '✦', 'EXCLUSIVE', '✦'].map((t, i) => (
            <Text key={i} style={styles.marqueeText}>{t}  </Text>
          ))}
        </View>

        {/* Greeting */}
        <View style={styles.section}>
          <Text style={styles.greetLabel}>WELCOME BACK</Text>
          <Text style={styles.greetName}>{profile?.displayName?.split(' ')[0] || 'Valued Member'}</Text>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* New Arrivals Grid */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionLabel}>NEW ARRIVALS</Text>
            <Text style={styles.sectionTitle}>The Latest</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
            <Text style={styles.seeAll}>See All →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productsGrid}>
          {visibleProducts.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onPress={() => navigation.navigate('ProductDetail', { product: p })}
            />
          ))}
          {visibleProducts.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={40} color={Colors.border} />
              <Text style={styles.emptyText}>Products coming soon</Text>
            </View>
          )}
        </View>

        {/* Limited Drops Section */}
        {drops.length > 0 && (
          <View style={styles.dropsSection}>
            <LinearGradient
              colors={['#1C1C1E', '#2A1F0F']}
              style={styles.dropsGrad}
            >
              <Text style={styles.dropsLabel}>EXCLUSIVE ACCESS</Text>
              <Text style={styles.dropsTitle}>Limited Drops</Text>
              <Text style={styles.dropsSubtitle}>
                Once they're gone, they're gone forever.
              </Text>
              {drops[0]?.dropDate && (
                <View style={styles.countdownWrap}>
                  <DropCountdown dropDate={drops[0].dropDate.toDate()} />
                </View>
              )}
              <TouchableOpacity
                style={styles.dropsBtn}
                onPress={() => navigation.navigate('LimitedDrops')}
              >
                <Text style={styles.dropsBtnText}>VIEW DROPS</Text>
                <Ionicons name="flash-outline" size={14} color={Colors.charcoal} style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {/* Members Only Teaser */}
        <TouchableOpacity
          onPress={() => navigation.navigate('MembersOnly')}
          activeOpacity={0.92}
          style={styles.membersTeaser}
        >
          <LinearGradient
            colors={[Colors.tan, Colors.gold, Colors.goldDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.membersTeaserGrad}
          >
            <View style={styles.membersTeaserContent}>
              <View style={styles.lockCircle}>
                <Ionicons name="lock-closed" size={22} color={Colors.gold} />
              </View>
              <View style={styles.membersTeaserText}>
                <Text style={styles.membersTeaserLabel}>EXCLUSIVE</Text>
                <Text style={styles.membersTeaserTitle}>Members Only</Text>
                <Text style={styles.membersTeaserSub}>
                  Unlock early access, private drops &amp; member-only pricing.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.white} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Footer spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  cartFab: {
    position: 'absolute',
    right: Spacing.lg,
    zIndex: 100,
  },
  cartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  cartBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.white,
  },
  heroContent: {
    paddingBottom: 60,
    paddingHorizontal: 28,
  },
  heroEst: {
    fontSize: 10,
    letterSpacing: 4,
    color: Colors.tan,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    fontFamily: 'serif',
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 54,
    color: Colors.white,
    marginBottom: Spacing.xl,
  },
  heroLine: {
    width: 56,
    height: 2,
    backgroundColor: Colors.gold,
    marginBottom: Spacing.xl,
  },
  shopNowBtn: {
    alignSelf: 'flex-start',
  },
  shopNowGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
  },
  shopNowText: {
    ...Typography.labelLG,
    color: Colors.white,
    fontSize: 12,
    letterSpacing: 2,
  },
  marqueeStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.charcoal,
    paddingVertical: 10,
    paddingLeft: Spacing.md,
    overflow: 'hidden',
  },
  marqueeText: {
    ...Typography.labelMD,
    color: Colors.tan,
    fontSize: 9,
    letterSpacing: 2,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  greetLabel: {
    ...Typography.labelMD,
    color: Colors.taupe,
    marginBottom: 4,
  },
  greetName: {
    ...Typography.displayMD,
    color: Colors.charcoal,
  },
  categoriesRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  catChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginRight: Spacing.sm,
  },
  catChipActive: {
    backgroundColor: Colors.charcoal,
    borderColor: Colors.charcoal,
  },
  catText: {
    ...Typography.labelMD,
    fontSize: 10,
    color: Colors.charcoal,
  },
  catTextActive: {
    color: Colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    ...Typography.labelMD,
    color: Colors.gold,
    marginBottom: 4,
  },
  sectionTitle: {
    ...Typography.displayMD,
    fontSize: 20,
  },
  seeAll: {
    ...Typography.bodySM,
    color: Colors.gold,
    fontWeight: '600',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    justifyContent: 'space-between',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.md,
  },
  emptyText: {
    ...Typography.bodyMD,
    color: Colors.muted,
  },
  dropsSection: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  dropsGrad: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  dropsLabel: {
    ...Typography.labelMD,
    color: Colors.gold,
    letterSpacing: 3,
    marginBottom: Spacing.sm,
  },
  dropsTitle: {
    fontFamily: 'serif',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  dropsSubtitle: {
    ...Typography.bodyMD,
    color: Colors.tan,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  countdownWrap: {
    marginBottom: Spacing.xl,
  },
  dropsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cream,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
  },
  dropsBtnText: {
    ...Typography.labelLG,
    color: Colors.charcoal,
    fontSize: 12,
    letterSpacing: 2,
  },
  membersTeaser: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadow.gold,
  },
  membersTeaserGrad: {
    padding: Spacing.lg,
  },
  membersTeaserContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  membersTeaserText: {
    flex: 1,
  },
  membersTeaserLabel: {
    ...Typography.labelMD,
    color: Colors.white,
    opacity: 0.8,
    fontSize: 9,
    letterSpacing: 2,
    marginBottom: 3,
  },
  membersTeaserTitle: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  membersTeaserSub: {
    ...Typography.bodySM,
    color: Colors.white,
    opacity: 0.85,
    lineHeight: 16,
  },
});
