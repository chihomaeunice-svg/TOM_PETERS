import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { getSellerProducts, updateProduct, deleteProduct, Product } from '../../services/firestore';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';

export const SellerProductsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    if (!profile) return;
    getSellerProducts(profile.uid).then(p => {
      setProducts(p);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [profile]);

  const handleToggleActive = async (product: Product) => {
    if (!product.id) return;
    await updateProduct(product.id, { isActive: !product.isActive });
    fetchProducts();
  };

  const handleDelete = (product: Product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (product.id) {
              await deleteProduct(product.id);
              fetchProducts();
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Product }) => {
    const stock = Object.values(item.sizes || {}).reduce((a, b) => a + b, 0);
    return (
      <View style={styles.row}>
        <Image
          source={item.images?.[0] ? { uri: item.images[0] } : require('../../../assets/placeholder.png')}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.price}>${item.price?.toFixed(2)}</Text>
            <Text style={[styles.stock, stock < 5 && styles.stockLow]}>
              {stock} in stock
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, item.isActive ? styles.activeBtn : styles.inactiveBtn]}
            onPress={() => handleToggleActive(item)}
          >
            <Ionicons
              name={item.isActive ? 'eye-outline' : 'eye-off-outline'}
              size={16}
              color={item.isActive ? Colors.success : Colors.muted}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash-outline" size={16} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MY PRODUCTS</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Ionicons name="add" size={22} color={Colors.charcoal} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.gold} style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={p => p.id || p.name}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="cube-outline" size={48} color={Colors.border} />
              <Text style={styles.emptyTitle}>No products yet</Text>
              <TouchableOpacity
                style={styles.emptyAction}
                onPress={() => navigation.navigate('AddProduct')}
              >
                <Text style={styles.emptyActionText}>Add your first product →</Text>
              </TouchableOpacity>
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
  addBtn: { padding: Spacing.xs },
  list: { padding: Spacing.lg },
  row: {
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
  thumbnail: {
    width: 64,
    height: 72,
    borderRadius: Radius.sm,
    backgroundColor: Colors.beige,
  },
  info: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  productName: {
    ...Typography.bodyMD,
    fontWeight: '600',
    color: Colors.charcoal,
    marginBottom: 2,
  },
  productCategory: {
    ...Typography.bodySM,
    color: Colors.taupe,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  price: { ...Typography.price, fontSize: 15 },
  stock: { ...Typography.bodySM, color: Colors.success },
  stockLow: { color: Colors.error },
  actions: {
    gap: Spacing.sm,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.silk,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeBtn: { backgroundColor: '#F0FFF4', borderColor: Colors.success + '40' },
  inactiveBtn: { backgroundColor: Colors.silk },
  empty: {
    alignItems: 'center',
    paddingVertical: 80,
    gap: Spacing.md,
  },
  emptyTitle: { ...Typography.bodyMD, color: Colors.muted },
  emptyAction: { paddingVertical: Spacing.sm },
  emptyActionText: { ...Typography.bodyMD, color: Colors.gold, fontWeight: '600' },
});
