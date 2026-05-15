import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CartItemRow } from '../../components/customer/CartItem';
import { Button } from '../../components/common/Button';
import { useCart } from '../../hooks/useCart';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'Cart'>;

export const CartScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { items, totalItems, totalPrice, addItem, removeItem, updateQty } = useCart();

  const SHIPPING = totalPrice >= 200 ? 0 : 15;
  const TOTAL = totalPrice + SHIPPING;

  if (items.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.charcoal} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MY BAG</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="bag-outline" size={48} color={Colors.tan} />
          </View>
          <Text style={styles.emptyTitle}>Your bag is empty</Text>
          <Text style={styles.emptyText}>
            Add some pieces to your collection
          </Text>
          <Button
            label="EXPLORE SHOP"
            onPress={() => navigation.navigate('Shop')}
            variant="gold"
            style={{ marginTop: Spacing.xl }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.charcoal} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>MY BAG</Text>
          <Text style={styles.itemCount}>{totalItems} items</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {items.map(item => (
          <CartItemRow
            key={`${item.productId}-${item.size}`}
            item={item}
            onIncrease={() => updateQty(item.productId, item.size, item.qty + 1)}
            onDecrease={() => updateQty(item.productId, item.size, item.qty - 1)}
            onRemove={() => removeItem(item.productId, item.size)}
          />
        ))}

        {/* Free shipping banner */}
        {SHIPPING > 0 && (
          <View style={styles.shippingBanner}>
            <Ionicons name="car-outline" size={16} color={Colors.gold} />
            <Text style={styles.shippingBannerText}>
              Add ${(200 - totalPrice).toFixed(2)} more for free shipping
            </Text>
          </View>
        )}
        {SHIPPING === 0 && (
          <View style={[styles.shippingBanner, styles.shippingFree]}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
            <Text style={[styles.shippingBannerText, { color: Colors.success }]}>
              You qualify for free shipping!
            </Text>
          </View>
        )}

        {/* Order Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>ORDER SUMMARY</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>
              {SHIPPING === 0 ? 'FREE' : `$${SHIPPING.toFixed(2)}`}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${TOTAL.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <Button
          label={`CHECKOUT — $${TOTAL.toFixed(2)}`}
          onPress={() => navigation.navigate('Checkout')}
          variant="gold"
          size="lg"
          fullWidth
        />
        <TouchableOpacity
          style={styles.continueShopping}
          onPress={() => navigation.navigate('Shop')}
        >
          <Text style={styles.continueText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
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
  backBtn: { padding: Spacing.xs },
  headerTitle: {
    ...Typography.labelLG,
    letterSpacing: 4,
    color: Colors.charcoal,
    textAlign: 'center',
  },
  itemCount: {
    ...Typography.bodySM,
    color: Colors.taupe,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.beige,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.displayMD,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    ...Typography.bodyMD,
    color: Colors.taupe,
    textAlign: 'center',
  },
  list: {
    padding: Spacing.lg,
  },
  shippingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.silk,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shippingFree: {
    backgroundColor: '#F0FFF4',
    borderColor: Colors.success + '40',
  },
  shippingBannerText: {
    ...Typography.bodySM,
    color: Colors.mid,
    flex: 1,
  },
  summary: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryTitle: {
    ...Typography.labelMD,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    ...Typography.bodyMD,
    color: Colors.mid,
  },
  summaryValue: {
    ...Typography.bodyMD,
    fontWeight: '600',
    color: Colors.charcoal,
  },
  totalRow: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: 0,
  },
  totalLabel: {
    ...Typography.labelLG,
    color: Colors.charcoal,
  },
  totalValue: {
    ...Typography.price,
    fontSize: 22,
    color: Colors.charcoal,
  },
  checkoutContainer: {
    backgroundColor: Colors.cream,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  continueShopping: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  continueText: {
    ...Typography.bodyMD,
    color: Colors.taupe,
    textDecorationLine: 'underline',
  },
});
