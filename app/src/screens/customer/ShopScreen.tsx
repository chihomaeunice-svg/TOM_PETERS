import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductCard } from '../../components/customer/ProductCard';
import { getProducts, Product } from '../../services/firestore';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'Shop'>;

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Accessories', 'Footwear'];

export const ShopScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  useEffect(() => {
    getProducts().then(p => {
      setProducts(p);
      setFiltered(p);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...products];
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
    setFiltered(result);
  }, [products, search, activeCategory, sortBy]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SHOP</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartBtn}>
          <Ionicons name="bag-outline" size={22} color={Colors.charcoal} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color={Colors.taupe} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={Colors.muted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color={Colors.taupe} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() => {
            const opts: (typeof sortBy)[] = ['newest', 'price_asc', 'price_desc'];
            const i = opts.indexOf(sortBy);
            setSortBy(opts[(i + 1) % opts.length]);
          }}
        >
          <Ionicons name="filter-outline" size={18} color={Colors.charcoal} />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catsRow}
        keyExtractor={i => i}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.cat, activeCategory === item && styles.catActive]}
            onPress={() => setActiveCategory(item)}
          >
            <Text style={[styles.catText, activeCategory === item && styles.catTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Count */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>{filtered.length} items</Text>
        <Text style={styles.sortText}>
          {sortBy === 'newest' ? 'Newest' : sortBy === 'price_asc' ? 'Price ↑' : 'Price ↓'}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={Colors.gold} size="large" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          numColumns={2}
          keyExtractor={p => p.id || p.name}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color={Colors.border} />
              <Text style={styles.emptyText}>No products found</Text>
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backBtn: { padding: Spacing.xs },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    ...Typography.labelLG,
    letterSpacing: 4,
    color: Colors.charcoal,
  },
  cartBtn: { padding: Spacing.xs },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: { marginRight: Spacing.sm },
  searchInput: {
    flex: 1,
    ...Typography.bodyMD,
    color: Colors.charcoal,
  },
  sortBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  catsRow: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  cat: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginRight: Spacing.xs,
  },
  catActive: {
    backgroundColor: Colors.charcoal,
    borderColor: Colors.charcoal,
  },
  catText: {
    ...Typography.labelMD,
    fontSize: 10,
    color: Colors.charcoal,
  },
  catTextActive: { color: Colors.white },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  countText: {
    ...Typography.bodySM,
    color: Colors.taupe,
  },
  sortText: {
    ...Typography.bodySM,
    color: Colors.gold,
    fontWeight: '600',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 80,
    gap: Spacing.md,
  },
  emptyText: {
    ...Typography.bodyMD,
    color: Colors.muted,
  },
});
