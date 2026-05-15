import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import type { CartItem as CartItemType } from '../../hooks/useCart';

interface Props {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export const CartItemRow: React.FC<Props> = ({ item, onIncrease, onDecrease, onRemove }) => (
  <View style={styles.row}>
    <Image
      source={item.image ? { uri: item.image } : require('../../../assets/placeholder.png')}
      style={styles.image}
      resizeMode="cover"
    />
    <View style={styles.info}>
      <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.meta}>Size: {item.size}</Text>
      <Text style={styles.price}>${(item.price * item.qty).toFixed(2)}</Text>
      <View style={styles.qtyRow}>
        <TouchableOpacity style={styles.qtyBtn} onPress={onDecrease}>
          <Ionicons name="remove" size={14} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.qty}>{item.qty}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={onIncrease}>
          <Ionicons name="add" size={14} color={Colors.charcoal} />
        </TouchableOpacity>
      </View>
    </View>
    <TouchableOpacity onPress={onRemove} style={styles.remove}>
      <Ionicons name="trash-outline" size={18} color={Colors.taupe} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: 80,
    height: 96,
    borderRadius: Radius.sm,
    backgroundColor: Colors.beige,
  },
  info: {
    flex: 1,
    paddingLeft: Spacing.md,
  },
  name: {
    ...Typography.bodyMD,
    fontWeight: '600',
    color: Colors.charcoal,
    marginBottom: 4,
  },
  meta: {
    ...Typography.bodySM,
    color: Colors.taupe,
    marginBottom: 4,
  },
  price: {
    ...Typography.price,
    fontSize: 16,
    marginBottom: Spacing.sm,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.beige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    ...Typography.labelLG,
    marginHorizontal: Spacing.md,
    minWidth: 20,
    textAlign: 'center',
  },
  remove: {
    padding: Spacing.xs,
    alignSelf: 'flex-start',
  },
});
