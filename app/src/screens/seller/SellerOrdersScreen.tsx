import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { getSellerOrders, updateOrderStatus, Order } from '../../services/firestore';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import { ORDER_STATUS_COLOR as STATUS_COLORS, ORDER_STATUS_ICON as STATUS_ICONS } from '../../utils/orderStatus';

const NEXT_STATUS: Record<string, Order['status']> = {
  pending: 'confirmed',
  confirmed: 'shipped',
  shipped: 'delivered',
};

export const SellerOrdersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all');

  const fetchOrders = () => {
    if (!profile) return;
    getSellerOrders(profile.uid).then(o => {
      setOrders(o);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [profile]);

  const handleAdvanceStatus = (order: Order) => {
    const next = NEXT_STATUS[order.status];
    if (!next || !order.id) return;
    Alert.alert(
      'Update Status',
      `Mark this order as "${next}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: async () => {
            await updateOrderStatus(order.id!, next);
            fetchOrders();
          },
        },
      ]
    );
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ORDERS</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Filter tabs */}
      <View style={styles.filtersRow}>
        {(['all', 'pending', 'confirmed', 'shipped', 'delivered'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.gold} style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={o => o.id || ''}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <View style={styles.orderCardHeader}>
                <View style={[styles.statusIcon, { backgroundColor: STATUS_COLORS[item.status] + '20' }]}>
                  <Ionicons
                    name={STATUS_ICONS[item.status] as any}
                    size={18}
                    color={STATUS_COLORS[item.status]}
                  />
                </View>
                <View style={styles.orderHeaderInfo}>
                  <Text style={styles.orderId}>#{item.id?.slice(-8).toUpperCase()}</Text>
                  <Text style={[styles.orderStatus, { color: STATUS_COLORS[item.status] }]}>
                    {item.status.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
              </View>

              <View style={styles.orderDivider} />

              <View style={styles.orderDetails}>
                <View style={styles.orderDetailRow}>
                  <Ionicons name="person-outline" size={14} color={Colors.taupe} />
                  <Text style={styles.orderDetailText}>{item.customerName}</Text>
                </View>
                <View style={styles.orderDetailRow}>
                  <Ionicons name="mail-outline" size={14} color={Colors.taupe} />
                  <Text style={styles.orderDetailText}>{item.customerEmail}</Text>
                </View>
                <View style={styles.orderDetailRow}>
                  <Ionicons name="cube-outline" size={14} color={Colors.taupe} />
                  <Text style={styles.orderDetailText}>{item.items.length} item(s)</Text>
                </View>
                <View style={styles.orderDetailRow}>
                  <Ionicons name="location-outline" size={14} color={Colors.taupe} />
                  <Text style={styles.orderDetailText} numberOfLines={1}>
                    {item.shippingAddress.city}, {item.shippingAddress.state}
                  </Text>
                </View>
              </View>

              {NEXT_STATUS[item.status] && (
                <TouchableOpacity
                  style={styles.advanceBtn}
                  onPress={() => handleAdvanceStatus(item)}
                >
                  <Text style={styles.advanceBtnText}>
                    Mark as {NEXT_STATUS[item.status]?.toUpperCase()}
                  </Text>
                  <Ionicons name="arrow-forward" size={14} color={Colors.gold} />
                </TouchableOpacity>
              )}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="receipt-outline" size={48} color={Colors.border} />
              <Text style={styles.emptyText}>No orders found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { ...Typography.labelLG, letterSpacing: 3 },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  filterTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  filterTabActive: {
    backgroundColor: Colors.charcoal,
  },
  filterText: {
    ...Typography.labelMD,
    fontSize: 10,
    color: Colors.taupe,
  },
  filterTextActive: { color: Colors.white },
  list: { padding: Spacing.lg },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  orderCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  orderHeaderInfo: { flex: 1 },
  orderId: { ...Typography.labelLG, fontSize: 12, color: Colors.charcoal },
  orderStatus: { ...Typography.labelMD, fontSize: 9, marginTop: 2 },
  orderTotal: { ...Typography.price, fontSize: 18 },
  orderDivider: { height: 1, backgroundColor: Colors.border },
  orderDetails: { padding: Spacing.md, gap: 8 },
  orderDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  orderDetailText: { ...Typography.bodySM, color: Colors.mid, flex: 1 },
  advanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.silk,
  },
  advanceBtnText: {
    ...Typography.labelLG,
    color: Colors.gold,
    fontSize: 11,
    letterSpacing: 1.5,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 80,
    gap: Spacing.md,
  },
  emptyText: { ...Typography.bodyMD, color: Colors.muted },
});
