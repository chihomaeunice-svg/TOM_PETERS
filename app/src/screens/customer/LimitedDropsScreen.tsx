import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DropCountdown } from '../../components/customer/DropCountdown';
import { getLimitedDrops, Product } from '../../services/firestore';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'LimitedDrops'>;

export const LimitedDropsScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [drops, setDrops] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLimitedDrops()
      .then(d => { setDrops(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const isDropLive = (p: Product) => {
    if (!p.dropDate) return true;
    return p.dropDate.toDate() <= new Date();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1C1C1E', '#2A1F0F', '#1C1C1E']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.cream} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>EXCLUSIVE</Text>
          <Text style={styles.headerTitle}>LIMITED DROPS</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.subheader}>
        Pieces crafted in limited quantities. Once sold, they're gone.
      </Text>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={Colors.gold} size="large" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {drops.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="flash-outline" size={48} color={Colors.taupe} />
              <Text style={styles.emptyTitle}>Next Drop Coming Soon</Text>
              <Text style={styles.emptyText}>
                Follow us to be the first to know when exclusive pieces drop.
              </Text>
            </View>
          )}

          {drops.map(product => {
            const live = isDropLive(product);
            const dropDate = product.dropDate?.toDate() || new Date();

            return (
              <View key={product.id} style={styles.dropCard}>
                {/* Image */}
                <View style={styles.dropImageWrap}>
                  <Image
                    source={
                      product.images?.[0]
                        ? { uri: product.images[0] }
                        : require('../../../assets/placeholder.png')
                    }
                    style={styles.dropImage}
                    resizeMode="cover"
                  />
                  {!live && (
                    <BlurView intensity={50} style={StyleSheet.absoluteFill}>
                      <View style={styles.blurContent}>
                        <Ionicons name="lock-closed" size={32} color={Colors.white} />
                        <Text style={styles.blurText}>REVEAL AT DROP</Text>
                      </View>
                    </BlurView>
                  )}
                  <LinearGradient
                    colors={['transparent', 'rgba(28,28,30,0.9)']}
                    style={styles.dropGrad}
                  />
                  {live && (
                    <View style={styles.liveBadge}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveBadgeText}>LIVE NOW</Text>
                    </View>
                  )}
                </View>

                {/* Info */}
                <View style={styles.dropInfo}>
                  {!live && (
                    <View style={styles.countdownSection}>
                      <DropCountdown dropDate={dropDate} />
                    </View>
                  )}

                  <Text style={styles.dropName}>{live ? product.name : '???'}</Text>
                  <Text style={styles.dropPrice}>
                    {live ? `$${product.price?.toFixed(2)}` : 'Price Revealed at Drop'}
                  </Text>
                  <Text style={styles.dropDesc} numberOfLines={2}>
                    {live ? product.description : 'Details will be revealed when the drop goes live.'}
                  </Text>

                  {live ? (
                    <TouchableOpacity
                      style={styles.shopDropBtn}
                      onPress={() => navigation.navigate('ProductDetail', { product })}
                    >
                      <LinearGradient
                        colors={[Colors.gold, Colors.goldDark]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.shopDropGrad}
                      >
                        <Text style={styles.shopDropText}>SHOP THIS DROP</Text>
                        <Ionicons name="arrow-forward" size={14} color={Colors.white} />
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.notifyBtn}
                      onPress={() => Alert.alert('Notify Me', 'You will be notified when this drop goes live!')}
                    >
                      <Ionicons name="notifications-outline" size={16} color={Colors.gold} />
                      <Text style={styles.notifyBtnText}>GET NOTIFIED</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}

          <View style={{ height: 60 }} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backBtn: { padding: Spacing.xs },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerLabel: {
    ...Typography.labelMD,
    color: Colors.gold,
    letterSpacing: 3,
    fontSize: 9,
  },
  headerTitle: {
    ...Typography.labelLG,
    letterSpacing: 3,
    color: Colors.cream,
    fontSize: 14,
  },
  subheader: {
    ...Typography.bodyMD,
    color: Colors.tan,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    gap: Spacing.md,
  },
  emptyTitle: {
    ...Typography.displayMD,
    color: Colors.cream,
    textAlign: 'center',
  },
  emptyText: {
    ...Typography.bodyMD,
    color: Colors.taupe,
    textAlign: 'center',
    lineHeight: 22,
  },
  dropCard: {
    marginBottom: Spacing.xl,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: '#252525',
    borderWidth: 1,
    borderColor: 'rgba(201,169,110,0.2)',
  },
  dropImageWrap: {
    height: 280,
    position: 'relative',
  },
  dropImage: {
    width: '100%',
    height: '100%',
  },
  blurContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  blurText: {
    ...Typography.labelLG,
    color: Colors.white,
    letterSpacing: 4,
  },
  dropGrad: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  liveBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.white,
  },
  liveBadgeText: {
    ...Typography.labelMD,
    color: Colors.white,
    fontSize: 9,
  },
  dropInfo: {
    padding: Spacing.lg,
  },
  countdownSection: {
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  dropName: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.cream,
    marginBottom: 4,
  },
  dropPrice: {
    ...Typography.price,
    color: Colors.gold,
    marginBottom: Spacing.sm,
  },
  dropDesc: {
    ...Typography.bodyMD,
    color: Colors.taupe,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  shopDropBtn: { overflow: 'hidden', borderRadius: Radius.sm },
  shopDropGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  shopDropText: {
    ...Typography.labelLG,
    color: Colors.white,
    fontSize: 12,
    letterSpacing: 2,
  },
  notifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.gold,
    gap: Spacing.sm,
  },
  notifyBtnText: {
    ...Typography.labelLG,
    color: Colors.gold,
    fontSize: 12,
    letterSpacing: 2,
  },
});
