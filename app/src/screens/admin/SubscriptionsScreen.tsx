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
  Modal,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import {
  getAllSubscriptionPlans,
  addSubscriptionPlan,
  updateSubscriptionPlan,
  SubscriptionPlan,
} from '../../services/firestore';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';

export const SubscriptionsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    billingCycle: 'monthly' as 'monthly' | 'yearly',
    productLimit: '',
    orderCommission: '',
    hasAnalytics: false,
    hasPrioritySupport: false,
    features: '',
  });

  const fetchPlans = () => {
    getAllSubscriptionPlans().then(p => {
      setPlans(p);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchPlans(); }, []);

  const openCreate = () => {
    setEditingPlan(null);
    setForm({ name: '', price: '', billingCycle: 'monthly', productLimit: '', orderCommission: '', hasAnalytics: false, hasPrioritySupport: false, features: '' });
    setModalVisible(true);
  };

  const openEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      price: String(plan.price),
      billingCycle: plan.billingCycle,
      productLimit: String(plan.productLimit),
      orderCommission: String(plan.orderCommission),
      hasAnalytics: plan.hasAnalytics,
      hasPrioritySupport: plan.hasPrioritySupport,
      features: plan.features.join(', '),
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { Alert.alert('Fill all required fields'); return; }
    const data: Omit<SubscriptionPlan, 'id'> = {
      name: form.name,
      price: parseFloat(form.price),
      billingCycle: form.billingCycle,
      productLimit: parseInt(form.productLimit) || 50,
      orderCommission: parseFloat(form.orderCommission) || 0,
      hasAnalytics: form.hasAnalytics,
      hasPrioritySupport: form.hasPrioritySupport,
      features: form.features.split(',').map(f => f.trim()).filter(Boolean),
      isActive: true,
    };
    if (editingPlan?.id) {
      await updateSubscriptionPlan(editingPlan.id, data);
    } else {
      await addSubscriptionPlan(data);
    }
    setModalVisible(false);
    fetchPlans();
  };

  const handleToggleActive = async (plan: SubscriptionPlan) => {
    if (!plan.id) return;
    await updateSubscriptionPlan(plan.id, { isActive: !plan.isActive });
    fetchPlans();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SUBSCRIPTIONS</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openCreate}>
          <Ionicons name="add" size={22} color={Colors.charcoal} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.gold} style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={plans}
          keyExtractor={p => p.id || p.name}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.planCard, !item.isActive && styles.planCardInactive]}>
              <View style={styles.planHeader}>
                <View>
                  <Text style={styles.planName}>{item.name}</Text>
                  <Text style={styles.planBilling}>{item.billingCycle}</Text>
                </View>
                <View style={styles.planPriceWrap}>
                  <Text style={styles.planPrice}>${item.price}</Text>
                  <Text style={styles.planPer}>/{item.billingCycle === 'monthly' ? 'mo' : 'yr'}</Text>
                </View>
              </View>

              <View style={styles.planFeatures}>
                {[
                  `${item.productLimit} products`,
                  `${item.orderCommission}% commission`,
                  item.hasAnalytics && 'Analytics',
                  item.hasPrioritySupport && 'Priority Support',
                  ...item.features,
                ].filter(Boolean).map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                    <Text style={styles.featureText}>{f as string}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.planActions}>
                <TouchableOpacity style={styles.planActionBtn} onPress={() => openEdit(item)}>
                  <Ionicons name="pencil-outline" size={16} color={Colors.gold} />
                  <Text style={styles.planActionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.planActionBtn} onPress={() => handleToggleActive(item)}>
                  <Ionicons
                    name={item.isActive ? 'eye-off-outline' : 'eye-outline'}
                    size={16}
                    color={item.isActive ? Colors.error : Colors.success}
                  />
                  <Text style={[styles.planActionText, { color: item.isActive ? Colors.error : Colors.success }]}>
                    {item.isActive ? 'Deactivate' : 'Activate'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="card-outline" size={48} color={Colors.border} />
              <Text style={styles.emptyText}>No subscription plans yet</Text>
              <TouchableOpacity style={styles.createBtn} onPress={openCreate}>
                <Text style={styles.createBtnText}>Create First Plan →</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* Create/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={Colors.charcoal} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{editingPlan ? 'EDIT PLAN' : 'NEW PLAN'}</Text>
            <View style={{ width: 32 }} />
          </View>
          <ScrollView contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">
            <Input label="Plan Name *" value={form.name} onChangeText={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Pro Plan" />
            <Input label="Price (USD) *" value={form.price} onChangeText={v => setForm(f => ({ ...f, price: v }))} keyboardType="decimal-pad" placeholder="29.99" />
            <Input label="Product Limit" value={form.productLimit} onChangeText={v => setForm(f => ({ ...f, productLimit: v }))} keyboardType="numeric" placeholder="50" />
            <Input label="Commission %" value={form.orderCommission} onChangeText={v => setForm(f => ({ ...f, orderCommission: v }))} keyboardType="decimal-pad" placeholder="5" />
            <Input label="Features (comma separated)" value={form.features} onChangeText={v => setForm(f => ({ ...f, features: v }))} placeholder="Custom branding, 24/7 support..." multiline />

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Sales Analytics</Text>
              <Switch value={form.hasAnalytics} onValueChange={v => setForm(f => ({ ...f, hasAnalytics: v }))} trackColor={{ true: Colors.gold }} thumbColor={Colors.white} />
            </View>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Priority Support</Text>
              <Switch value={form.hasPrioritySupport} onValueChange={v => setForm(f => ({ ...f, hasPrioritySupport: v }))} trackColor={{ true: Colors.gold }} thumbColor={Colors.white} />
            </View>

            <Button label="SAVE PLAN" onPress={handleSave} variant="gold" fullWidth size="lg" style={{ marginTop: Spacing.lg }} />
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
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
  addBtn: { padding: Spacing.xs },
  list: { padding: Spacing.lg },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  planCardInactive: { opacity: 0.55 },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  planName: { ...Typography.bodyLG, fontWeight: '700', color: Colors.charcoal },
  planBilling: { ...Typography.bodySM, color: Colors.taupe, textTransform: 'capitalize', marginTop: 2 },
  planPriceWrap: { flexDirection: 'row', alignItems: 'flex-end' },
  planPrice: { ...Typography.price, fontSize: 28, color: Colors.gold },
  planPer: { ...Typography.bodySM, color: Colors.taupe, marginBottom: 4 },
  planFeatures: { padding: Spacing.md, gap: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { ...Typography.bodySM, color: Colors.mid },
  planActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  planActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.md,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  planActionText: {
    ...Typography.labelMD,
    color: Colors.gold,
    fontSize: 10,
    letterSpacing: 1,
  },
  empty: { alignItems: 'center', paddingVertical: 80, gap: Spacing.md },
  emptyText: { ...Typography.bodyMD, color: Colors.muted },
  createBtn: { paddingVertical: Spacing.sm },
  createBtnText: { ...Typography.bodyMD, color: Colors.gold, fontWeight: '600' },
  modal: { flex: 1, backgroundColor: Colors.cream },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingTop: 56,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: { ...Typography.labelLG, letterSpacing: 3 },
  modalScroll: { padding: Spacing.lg },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleLabel: { ...Typography.bodyMD, color: Colors.charcoal, fontWeight: '500' },
});
