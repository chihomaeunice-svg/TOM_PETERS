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
import {
  getSellerInquiries,
  updateInquiryStatus,
  SellerInquiry,
} from '../../services/firestore';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';

const STATUS_CONFIG: Record<string, { color: string; icon: string; bg: string }> = {
  pending: { color: Colors.warning, icon: 'time-outline', bg: Colors.warning + '15' },
  approved: { color: Colors.success, icon: 'checkmark-circle-outline', bg: Colors.success + '15' },
  rejected: { color: Colors.error, icon: 'close-circle-outline', bg: Colors.error + '15' },
};

export const SellersManagement: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const [inquiries, setInquiries] = useState<SellerInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SellerInquiry['status'] | 'all'>('all');

  const fetchInquiries = () => {
    getSellerInquiries().then(d => {
      setInquiries(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchInquiries(); }, []);

  const handleApprove = (inquiry: SellerInquiry) => {
    Alert.alert(
      'Approve Seller',
      `Approve ${inquiry.businessName} (${inquiry.email})?\n\nThis will create a seller account for them.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            if (!inquiry.id || !profile) return;
            await updateInquiryStatus(inquiry.id, 'approved', profile.uid);
            fetchInquiries();
            Alert.alert('Approved', `${inquiry.businessName} has been approved as a seller.`);
          },
        },
      ]
    );
  };

  const handleReject = (inquiry: SellerInquiry) => {
    Alert.alert(
      'Reject Application',
      `Reject ${inquiry.businessName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            if (!inquiry.id || !profile) return;
            await updateInquiryStatus(inquiry.id, 'rejected', profile.uid);
            fetchInquiries();
          },
        },
      ]
    );
  };

  const filtered =
    filter === 'all' ? inquiries : inquiries.filter(i => i.status === filter);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SELLER APPLICATIONS</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Filter tabs */}
      <View style={styles.filtersRow}>
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'pending' && ` (${inquiries.filter(i => i.status === 'pending').length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.gold} style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={i => i.id || ''}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const statusCfg = STATUS_CONFIG[item.status];
            return (
              <View style={styles.card}>
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View style={[styles.statusIcon, { backgroundColor: statusCfg.bg }]}>
                    <Ionicons name={statusCfg.icon as any} size={20} color={statusCfg.color} />
                  </View>
                  <View style={styles.cardHeaderInfo}>
                    <Text style={styles.businessName}>{item.businessName}</Text>
                    <Text style={[styles.statusText, { color: statusCfg.color }]}>
                      {item.status.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.businessType}>{item.businessType}</Text>
                </View>

                <View style={styles.divider} />

                {/* Details */}
                <View style={styles.details}>
                  {[
                    { icon: 'person-outline', label: item.name },
                    { icon: 'mail-outline', label: item.email },
                    { icon: 'call-outline', label: item.phone || 'No phone' },
                  ].map(d => (
                    <View key={d.label} style={styles.detailRow}>
                      <Ionicons name={d.icon as any} size={13} color={Colors.taupe} />
                      <Text style={styles.detailText}>{d.label}</Text>
                    </View>
                  ))}
                </View>

                {item.description && (
                  <View style={styles.descWrap}>
                    <Text style={styles.descText} numberOfLines={3}>{item.description}</Text>
                  </View>
                )}

                {/* Actions */}
                {item.status === 'pending' && (
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.rejectBtn]}
                      onPress={() => handleReject(item)}
                    >
                      <Ionicons name="close" size={16} color={Colors.error} />
                      <Text style={[styles.actionBtnText, { color: Colors.error }]}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.approveBtn]}
                      onPress={() => handleApprove(item)}
                    >
                      <Ionicons name="checkmark" size={16} color={Colors.white} />
                      <Text style={[styles.actionBtnText, { color: Colors.white }]}>Approve</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={48} color={Colors.border} />
              <Text style={styles.emptyText}>No applications found</Text>
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
  headerTitle: { ...Typography.labelLG, letterSpacing: 2 },
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
  filterTabActive: { backgroundColor: Colors.charcoal },
  filterText: { ...Typography.labelMD, fontSize: 10, color: Colors.taupe },
  filterTextActive: { color: Colors.white },
  list: { padding: Spacing.lg },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  cardHeaderInfo: { flex: 1 },
  businessName: {
    ...Typography.bodyMD,
    fontWeight: '700',
    color: Colors.charcoal,
    marginBottom: 2,
  },
  statusText: { ...Typography.labelMD, fontSize: 9, letterSpacing: 1.5 },
  businessType: {
    ...Typography.bodySM,
    color: Colors.taupe,
    backgroundColor: Colors.silk,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  divider: { height: 1, backgroundColor: Colors.border },
  details: { padding: Spacing.md, gap: 8 },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailText: { ...Typography.bodySM, color: Colors.mid, flex: 1 },
  descWrap: {
    backgroundColor: Colors.silk,
    margin: Spacing.md,
    marginTop: 0,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  descText: { ...Typography.bodySM, color: Colors.mid, lineHeight: 18, fontStyle: 'italic' },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    paddingTop: 0,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: Radius.sm,
  },
  rejectBtn: {
    borderWidth: 1,
    borderColor: Colors.error,
  },
  approveBtn: {
    backgroundColor: Colors.success,
  },
  actionBtnText: {
    ...Typography.labelLG,
    fontSize: 11,
    letterSpacing: 1,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 80,
    gap: Spacing.md,
  },
  emptyText: { ...Typography.bodyMD, color: Colors.muted },
});
