import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ORDER_STATUS_COLOR, ORDER_STATUS_ICON } from '../../utils/orderStatus';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatCard } from '../../components/seller/StatCard';
import { useAuth } from '../../hooks/useAuth';
import { getSellerOrders, getSellerProducts, Order, Product } from '../../services/firestore';
import { logoutUser } from '../../services/auth';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';

export const SellerDashboard: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    Promise.all([
      getSellerOrders(profile.uid),
      getSellerProducts(profile.uid),
    ]).then(([o, p]) => {
      setOrders(o);
      setProducts(p);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [profile]);

  const todayRevenue = orders
    .filter(o => {
      const d = o.createdAt?.toDate?.();
      return d && d.toDateString() === new Date().toDateString();
    })
    .reduce((s, o) => s + o.total, 0);

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const QUICK_ACTIONS = [
    { icon: 'add-circle-outline', label: 'Add Product', screen: 'AddProduct', color: Colors.gold },
    { icon: 'cube-outline', label: 'My Products', screen: 'SellerProducts', color: Colors.sage },
    { icon: 'receipt-outline', label: 'Orders', screen: 'SellerOrders', color: Colors.rose },
    { icon: 'person-outline', label: 'Profile', screen: 'SellerProfile', color: Colors.taupe },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} bounces>
        {/* Header */}
        <LinearGradient colors={['#1C1C1E', '#2A1F0F']} style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greetLabel}>SELLER DASHBOARD</Text>
              <Text style={styles.greetName}>{profile?.businessName || profile?.displayName}</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={22} color={Colors.cream} />
            </TouchableOpacity>
          </View>

          {/* Subscription badge */}
          <View style={styles.subBadge}>
            <Ionicons
              name={profile?.subscriptionStatus === 'active' ? 'shield-checkmark' : 'shield-outline'}
              size={14}
              color={profile?.subscriptionStatus === 'active' ? Colors.gold : Colors.taupe}
            />
            <Text style={styles.subBadgeText}>
              {profile?.subscriptionPlan || 'No Plan'} ·{' '}
              <Text style={{ color: profile?.subscriptionStatus === 'active' ? Colors.gold : Colors.error }}>
                {profile?.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
              </Text>
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator color={Colors.gold} style={{ marginTop: Spacing.xxl }} />
          ) : (
            <>
              {/* Stats Grid */}
              <View style={styles.statsGrid}>
                <StatCard label="Today's Revenue" value={`$${todayRevenue.toFixed(0)}`} icon="trending-up" trend={12} />
                <StatCard label="Total Revenue" value={`$${totalRevenue.toFixed(0)}`} icon="cash-outline" accent={Colors.sage} />
              </View>
              <View style={styles.statsGrid}>
                <StatCard label="Pending Orders" value={pendingOrders} icon="time-outline" accent={Colors.warning} />
                <StatCard label="Total Products" value={products.length} icon="cube-outline" accent={Colors.taupe} />
              </View>

              {/* Quick Actions */}
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionsGrid}>
                {QUICK_ACTIONS.map(a => (
                  <TouchableOpacity
                    key={a.label}
                    style={styles.actionCard}
                    onPress={() => navigation.navigate(a.screen)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: a.color + '15' }]}>
                      <Ionicons name={a.icon as any} size={24} color={a.color} />
                    </View>
                    <Text style={styles.actionLabel}>{a.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Recent Orders */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Orders</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SellerOrders')}>
                  <Text style={styles.seeAll}>See All →</Text>
                </TouchableOpacity>
              </View>

              {orders.slice(0, 5).map(order => (
                <View key={order.id} style={styles.orderRow}>
                  <View style={[styles.orderStatus, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                    <Ionicons
                      name={getStatusIcon(order.status) as any}
                      size={16}
                      color={getStatusColor(order.status)}
                    />
                  </View>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderId}>#{order.id?.slice(-6).toUpperCase()}</Text>
                    <Text style={styles.orderCustomer}>{order.customerName}</Text>
                  </View>
                  <View style={styles.orderRight}>
                    <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
                    <Text style={[styles.orderStatusText, { color: getStatusColor(order.status) }]}>
                      {order.status}
                    </Text>
                  </View>
                </View>
              ))}

              {orders.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons name="receipt-outline" size={40} color={Colors.border} />
                  <Text style={styles.emptyText}>No orders yet</Text>
                </View>
              )}
            </>
          )}

          <TouchableOpacity style={styles.logoutBtn} onPress={logoutUser}>
            <Ionicons name="log-out-outline" size={18} color={Colors.taupe} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          <View style={{ height: 60 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const getStatusColor = (status: string) => ORDER_STATUS_COLOR[status] || Colors.muted;
const getStatusIcon = (status: string) => ORDER_STATUS_ICON[status] || 'ellipse-outline';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  greetLabel: {
    ...Typography.labelMD,
    color: Colors.tan,
    letterSpacing: 2,
    marginBottom: 4,
    fontSize: 9,
  },
  greetName: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.cream,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  subBadgeText: {
    ...Typography.bodySM,
    color: Colors.tan,
  },
  content: {
    padding: Spacing.lg,
    marginTop: -Spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.displayMD,
    fontSize: 16,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  seeAll: {
    ...Typography.bodySM,
    color: Colors.gold,
    fontWeight: '600',
    marginTop: Spacing.lg,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  actionCard: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    ...Typography.labelMD,
    fontSize: 9,
    color: Colors.mid,
    textAlign: 'center',
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  orderStatus: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  orderInfo: { flex: 1 },
  orderId: { ...Typography.labelLG, fontSize: 11, color: Colors.charcoal, marginBottom: 2 },
  orderCustomer: { ...Typography.bodySM, color: Colors.taupe },
  orderRight: { alignItems: 'flex-end' },
  orderTotal: { ...Typography.price, fontSize: 15, marginBottom: 2 },
  orderStatusText: { ...Typography.labelMD, fontSize: 9, textTransform: 'capitalize' },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  emptyText: { ...Typography.bodyMD, color: Colors.muted },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  logoutText: { ...Typography.bodyMD, color: Colors.taupe },
});
