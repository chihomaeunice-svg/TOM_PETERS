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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatCard } from '../../components/seller/StatCard';
import { useAuth } from '../../hooks/useAuth';
import { getPlatformStats, getSellerInquiries } from '../../services/firestore';
import { logoutUser } from '../../services/auth';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';

export const AdminDashboard: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlatformStats()
      .then(s => { setStats(s); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const ADMIN_SECTIONS = [
    { icon: 'people-outline', label: 'Seller Applications', screen: 'SellersManagement', color: Colors.gold, badge: stats?.pendingInquiries },
    { icon: 'card-outline', label: 'Subscriptions', screen: 'SubscriptionsAdmin', color: Colors.sage },
    { icon: 'cube-outline', label: 'All Products', screen: 'ProductsAdmin', color: Colors.rose },
    { icon: 'receipt-outline', label: 'All Orders', screen: 'OrdersAdmin', color: Colors.taupe },
    { icon: 'analytics-outline', label: 'Analytics', screen: 'Analytics', color: '#7B6CF6' },
    { icon: 'settings-outline', label: 'Settings', screen: 'AdminSettings', color: Colors.muted },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} bounces>
        {/* Header */}
        <LinearGradient colors={['#1C1C1E', '#2A1F0F']} style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerLabel}>ADMIN PANEL</Text>
              <Text style={styles.headerName}>TOM PETERS</Text>
              <Text style={styles.headerSub}>Platform Management</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.adminBadge}>
                <Ionicons name="shield-checkmark" size={14} color={Colors.gold} />
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
              <TouchableOpacity onPress={logoutUser} style={styles.logoutBtn}>
                <Ionicons name="log-out-outline" size={20} color={Colors.tan} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator color={Colors.gold} style={{ marginTop: Spacing.xxl }} />
          ) : (
            <>
              {/* Stats */}
              <View style={styles.statsGrid}>
                <StatCard label="Total Customers" value={stats?.totalUsers || 0} icon="people-outline" />
                <StatCard label="Active Sellers" value={stats?.totalSellers || 0} icon="storefront-outline" accent={Colors.sage} />
              </View>
              <View style={styles.statsGrid}>
                <StatCard label="Total Orders" value={stats?.totalOrders || 0} icon="receipt-outline" accent={Colors.rose} />
                <StatCard label="Platform Revenue" value={`$${(stats?.totalRevenue || 0).toFixed(0)}`} icon="cash-outline" accent={Colors.gold} trend={8} />
              </View>
              <View style={styles.statsGrid}>
                <StatCard label="Total Products" value={stats?.totalProducts || 0} icon="cube-outline" accent={Colors.taupe} />
                <StatCard label="Pending Applications" value={stats?.pendingInquiries || 0} icon="time-outline" accent={Colors.warning} />
              </View>

              {/* Alert if pending inquiries */}
              {stats?.pendingInquiries > 0 && (
                <TouchableOpacity
                  style={styles.alertBanner}
                  onPress={() => navigation.navigate('SellersManagement')}
                >
                  <View style={styles.alertLeft}>
                    <Ionicons name="alert-circle" size={20} color={Colors.warning} />
                    <Text style={styles.alertText}>
                      {stats.pendingInquiries} seller application(s) awaiting review
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={Colors.warning} />
                </TouchableOpacity>
              )}

              {/* Sections Grid */}
              <Text style={styles.sectionTitle}>Platform Management</Text>
              <View style={styles.sectionsGrid}>
                {ADMIN_SECTIONS.map(sec => (
                  <TouchableOpacity
                    key={sec.label}
                    style={styles.sectionCard}
                    onPress={() => navigation.navigate(sec.screen)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.secIconWrap, { backgroundColor: sec.color + '18' }]}>
                      <Ionicons name={sec.icon as any} size={26} color={sec.color} />
                      {sec.badge ? (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{sec.badge}</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.secLabel}>{sec.label}</Text>
                    <Ionicons name="chevron-forward" size={14} color={Colors.muted} />
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <View style={{ height: 60 }} />
        </View>
      </ScrollView>
    </View>
  );
};

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
  },
  headerLabel: {
    ...Typography.labelMD,
    color: Colors.gold,
    letterSpacing: 3,
    fontSize: 9,
    marginBottom: 4,
  },
  headerName: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 4,
    color: Colors.cream,
    marginBottom: 2,
  },
  headerSub: {
    ...Typography.bodySM,
    color: Colors.taupe,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.gold + '20',
    borderWidth: 1,
    borderColor: Colors.gold,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  adminBadgeText: {
    ...Typography.labelMD,
    color: Colors.gold,
    fontSize: 9,
    letterSpacing: 1.5,
  },
  logoutBtn: {
    padding: Spacing.xs,
  },
  content: { padding: Spacing.lg },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.warning + '15',
    borderWidth: 1,
    borderColor: Colors.warning + '40',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  alertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  alertText: {
    ...Typography.bodyMD,
    color: Colors.warning,
    fontWeight: '500',
    flex: 1,
  },
  sectionTitle: {
    ...Typography.displayMD,
    fontSize: 16,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionsGrid: {
    gap: Spacing.sm,
  },
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  secIconWrap: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
  secLabel: {
    ...Typography.bodyMD,
    fontWeight: '600',
    color: Colors.charcoal,
    flex: 1,
  },
});
