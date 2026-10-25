import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  RefreshControl,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { productService } from '../../services/productService';
import { Product, Category } from '../../types';
import ProductCard from '../../components/ProductCard';
import LoadingView from '../../components/LoadingView';
import ErrorView from '../../components/ErrorView';
import { Colors } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

type Props = NativeStackScreenProps<any, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { count } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [prods, cats] = await Promise.all([
        productService.getAll({
          search: search.trim() || undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
        }),
        categories.length === 0 ? productService.getCategories() : Promise.resolve(categories),
      ]);
      setProducts(prods);
      if (categories.length === 0) setCategories(cats);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    }
  }, [search, selectedCategory, categories.length]);

  useEffect(() => {
    setLoading(true);
    loadData().finally(() => setLoading(false));
  }, [selectedCategory]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      loadData();
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading && products.length === 0) {
    return <LoadingView message="Loading D&G catalog..." />;
  }

  if (error && products.length === 0) {
    return (
      <ErrorView
        message={error}
        onRetry={() => {
          setLoading(true);
          loadData().finally(() => setLoading(false));
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      {/* Top Brand & Action Bar */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          {/* Logo badge */}
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>D&G</Text>
          </View>
          <View style={styles.brandInfo}>
            <Text style={styles.appName}>D&G E-COMMERCE</Text>
            <Text style={styles.appTagline}>
              {user ? `Hi, ${user.name.split(' ')[0]} 👋 · Rwamagana` : 'Rwamagana · Eastern Province'}
            </Text>
          </View>
        </View>

        {/* Action icons: Cart & Account */}
        <View style={styles.headerActions}>
          {/* Cart Icon */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.8}
            accessibilityLabel="Shopping Cart"
          >
            <Text style={styles.headerIcon}>🛒</Text>
            {count > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{count > 99 ? '99+' : count}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Profile / Account Icon */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
            accessibilityLabel="User Account"
          >
            {user ? (
              <View style={styles.avatarMini}>
                <Text style={styles.avatarMiniText}>
                  {user.name.substring(0, 1).toUpperCase()}
                </Text>
              </View>
            ) : (
              <Text style={styles.headerIcon}>👤</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products in Rwamagana..."
            placeholderTextColor={Colors.textLight}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter Chips */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          <TouchableOpacity
            style={[styles.catChip, selectedCategory === 'all' && styles.catChipActive]}
            onPress={() => setSelectedCategory('all')}
            activeOpacity={0.8}
          >
            <Text style={[styles.catText, selectedCategory === 'all' && styles.catTextActive]}>
              ✨ All Products
            </Text>
          </TouchableOpacity>

          {categories.map(cat => {
            const isSelected = selectedCategory === String(cat.id);
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catChip, isSelected && styles.catChipActive]}
                onPress={() => setSelectedCategory(String(cat.id))}
                activeOpacity={0.8}
              >
                <Text style={[styles.catText, isSelected && styles.catTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Product Grid (2 columns) */}
      <FlatList
        key="product-grid-2"
        data={products}
        keyExtractor={item => String(item.id)}
        numColumns={2}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>
              {search ? `No results for "${search}"` : 'No products available'}
            </Text>
            <Text style={styles.emptySubtitle}>
              Try searching with different keywords or switch category filter.
            </Text>
            {(search.length > 0 || selectedCategory !== 'all') && (
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setSearch('');
                  setSelectedCategory('all');
                }}
              >
                <Text style={styles.resetBtnText}>Clear Filters & Show All</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 14,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    elevation: 3,
  },
  logoText: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  brandInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  appTagline: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerIcon: {
    fontSize: 18,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.accent,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  cartBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMiniText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  searchContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary, paddingVertical: 0 },
  clearIcon: { fontSize: 13, color: Colors.textLight, padding: 4 },
  categoryContainer: {
    paddingVertical: 12,
    backgroundColor: Colors.background,
  },
  categoryScroll: {
    paddingHorizontal: 12,
    gap: 6,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 6,
  },
  catChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  catText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  catTextActive: {
    color: Colors.white,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 28,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  resetBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resetBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
