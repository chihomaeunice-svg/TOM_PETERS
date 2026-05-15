import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { createOrder } from '../../services/firestore';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'Checkout'>;

const STEPS = ['Shipping', 'Review', 'Payment'];

export const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });

  const SHIPPING = totalPrice >= 200 ? 0 : 15;
  const TOTAL = totalPrice + SHIPPING;

  const setAddr = (key: keyof typeof address) => (val: string) =>
    setAddress(a => ({ ...a, [key]: val }));

  const handlePlaceOrder = async () => {
    if (!profile) return;
    if (!address.line1 || !address.city || !address.zip) {
      Alert.alert('Incomplete Address', 'Please complete your shipping address.');
      return;
    }
    setLoading(true);
    try {
      const sellerId = items[0]?.sellerId || '';
      await createOrder({
        customerId: profile.uid,
        customerEmail: profile.email,
        customerName: profile.displayName,
        items: items.map(i => ({
          productId: i.productId,
          name: i.name,
          size: i.size,
          qty: i.qty,
          price: i.price,
          image: i.image,
        })),
        total: TOTAL,
        status: 'pending',
        shippingAddress: address,
        sellerId,
      });
      clearCart();
      Alert.alert(
        'Order Placed!',
        'Your order has been confirmed. You will receive a confirmation email shortly.',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 0 ? setStep(s => s - 1) : navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CHECKOUT</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Step indicator */}
      <View style={styles.stepsRow}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, i <= step && styles.stepCircleActive]}>
                {i < step
                  ? <Ionicons name="checkmark" size={12} color={Colors.white} />
                  : <Text style={[styles.stepNum, i === step && styles.stepNumActive]}>{i + 1}</Text>
                }
              </View>
              <Text style={[styles.stepLabel, i === step && styles.stepLabelActive]}>{s}</Text>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[styles.stepLine, i < step && styles.stepLineActive]} />
            )}
          </React.Fragment>
        ))}
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {step === 0 && (
            <View>
              <Text style={styles.sectionTitle}>Shipping Address</Text>
              <Input label="Address Line 1" value={address.line1} onChangeText={setAddr('line1')}
                placeholder="123 Main Street" leftIcon="home-outline" />
              <Input label="Apartment, Suite, etc." value={address.line2} onChangeText={setAddr('line2')}
                placeholder="Optional" leftIcon="business-outline" />
              <Input label="City" value={address.city} onChangeText={setAddr('city')}
                placeholder="New York" leftIcon="location-outline" />
              <View style={styles.row}>
                <Input label="State" value={address.state} onChangeText={setAddr('state')}
                  placeholder="NY" containerStyle={styles.halfInput} />
                <Input label="ZIP Code" value={address.zip} onChangeText={setAddr('zip')}
                  placeholder="10001" keyboardType="numeric" containerStyle={styles.halfInput} />
              </View>
              <Button label="CONTINUE TO REVIEW" onPress={() => setStep(1)} variant="gold" fullWidth size="lg" />
            </View>
          )}

          {step === 1 && (
            <View>
              <Text style={styles.sectionTitle}>Review Order</Text>
              {items.map(item => (
                <View key={`${item.productId}-${item.size}`} style={styles.reviewItem}>
                  <Text style={styles.reviewName}>{item.name}</Text>
                  <Text style={styles.reviewMeta}>Size: {item.size} · Qty: {item.qty}</Text>
                  <Text style={styles.reviewPrice}>${(item.price * item.qty).toFixed(2)}</Text>
                </View>
              ))}
              <View style={styles.reviewSummary}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryVal}>${totalPrice.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Shipping</Text>
                  <Text style={styles.summaryVal}>{SHIPPING === 0 ? 'FREE' : `$${SHIPPING}`}</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalVal}>${TOTAL.toFixed(2)}</Text>
                </View>
              </View>
              <View style={styles.shippingAddr}>
                <Text style={styles.addrLabel}>SHIPPING TO</Text>
                <Text style={styles.addrText}>
                  {address.line1}{address.line2 ? `, ${address.line2}` : ''}{'\n'}
                  {address.city}, {address.state} {address.zip}
                </Text>
              </View>
              <Button label="CONTINUE TO PAYMENT" onPress={() => setStep(2)} variant="gold" fullWidth size="lg" />
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={styles.sectionTitle}>Payment</Text>
              <View style={styles.paymentCard}>
                <Ionicons name="card-outline" size={24} color={Colors.gold} />
                <Text style={styles.paymentNote}>
                  Secure payment processing via Stripe. Your card details are never stored.
                </Text>
              </View>
              <Input label="Card Number" placeholder="•••• •••• •••• ••••" keyboardType="numeric" leftIcon="card-outline" />
              <View style={styles.row}>
                <Input label="Expiry" placeholder="MM/YY" containerStyle={styles.halfInput} />
                <Input label="CVV" placeholder="•••" keyboardType="numeric" containerStyle={styles.halfInput} />
              </View>
              <Input label="Cardholder Name" placeholder="As it appears on card" autoCapitalize="words" />

              <View style={styles.totalConfirm}>
                <Text style={styles.totalConfirmLabel}>Total to charge</Text>
                <Text style={styles.totalConfirmValue}>${TOTAL.toFixed(2)}</Text>
              </View>

              <Button
                label={`PLACE ORDER · $${TOTAL.toFixed(2)}`}
                onPress={handlePlaceOrder}
                loading={loading}
                variant="gold"
                fullWidth
                size="lg"
              />
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerTitle: { ...Typography.labelLG, letterSpacing: 4 },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  stepItem: { alignItems: 'center', gap: 4 },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.silk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  stepNum: { ...Typography.bodySM, color: Colors.muted, fontWeight: '600' },
  stepNumActive: { color: Colors.white },
  stepLabel: { ...Typography.labelMD, fontSize: 9, color: Colors.muted },
  stepLabelActive: { color: Colors.gold },
  stepLine: { flex: 1, height: 1.5, backgroundColor: Colors.border, marginBottom: 16 },
  stepLineActive: { backgroundColor: Colors.gold },
  scroll: { padding: Spacing.lg },
  sectionTitle: { ...Typography.displayMD, fontSize: 20, marginBottom: Spacing.lg },
  row: { flexDirection: 'row', gap: Spacing.sm },
  halfInput: { flex: 1 },
  reviewItem: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reviewName: { ...Typography.bodyMD, fontWeight: '600', color: Colors.charcoal },
  reviewMeta: { ...Typography.bodySM, color: Colors.taupe, marginTop: 2 },
  reviewPrice: { ...Typography.price, fontSize: 16, marginTop: 4 },
  reviewSummary: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { ...Typography.bodyMD, color: Colors.mid },
  summaryVal: { ...Typography.bodyMD, fontWeight: '600' },
  totalRow: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.sm, marginBottom: 0 },
  totalLabel: { ...Typography.labelLG },
  totalVal: { ...Typography.price, fontSize: 20 },
  shippingAddr: {
    backgroundColor: Colors.silk,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addrLabel: { ...Typography.labelMD, marginBottom: 4 },
  addrText: { ...Typography.bodyMD, color: Colors.mid, lineHeight: 22 },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.silk,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paymentNote: { ...Typography.bodySM, color: Colors.taupe, flex: 1, lineHeight: 18 },
  totalConfirm: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  totalConfirmLabel: { ...Typography.labelLG, color: Colors.charcoal },
  totalConfirmValue: { ...Typography.price, fontSize: 22 },
});
