import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { Colors, formatRWF } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import LoadingView from '../../components/LoadingView';
import Button from '../../components/Button';

type Props = NativeStackScreenProps<any, 'SellerProducts'>;

export default function SellerProductsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      if (user?.id) {
        const data = await productService.getSellerProducts(user.id);
        setProducts(data);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to load products');
    }
  }, [user?.id]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProducts().finally(() => setLoading(false));
    });
    return unsubscribe;
  }, [navigation, fetchProducts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const handleDelete = (product: Product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await productService.delete(product.id);
              setProducts(prev => prev.filter(p => p.id !== product.id));
              Alert.alert('Success', 'Product deleted successfully');
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete product');
            }
          },
        },
      ]
    );
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const imageUri =
      item.image_url ||
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=60';

    return (
      <View style={styles.card}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        <View style={styles.cardBody}>
          <View style={styles.headerRow}>
            <Text style={styles.category} numberOfLines={1}>
              {item.category_name || 'General'}
            </Text>
            <Text style={[styles.stockBadge, item.stock === 0 && styles.outOfStockBadge]}>
              {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
            </Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.price}>{formatRWF(item.price)}</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => navigation.navigate('AddProduct', { product: item })}
            >
              <Text style={styles.editBtnText}>✏️ Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item)}
            >
              <Text style={styles.deleteBtnText}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) return <LoadingView message="Loading your products..." />;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Inventory</Text>
          <Text style={styles.headerSub}>{products.length} products listed</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddProduct', {})}
        >
          <Text style={styles.addBtnText}>+ Add New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={item => String(item.id)}
        renderItem={renderProductItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySub}>
              You have not added any products yet. Tap the button below to add your first product.
            </Text>
            <Button
              title="Add Your First Product"
              onPress={() => navigation.navigate('AddProduct', {})}
              style={{ marginTop: 16 }}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 14,
    paddingBottom: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  headerSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  addBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  list: { padding: 16, paddingBottom: 32 },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 14,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  image: { width: 110, height: '100%', minHeight: 120, backgroundColor: Colors.border },
  cardBody: { flex: 1, padding: 12, justifyContent: 'space-between' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  category: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  stockBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  outOfStockBadge: {
    color: Colors.danger,
    backgroundColor: '#FFEBEE',
  },
  title: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginVertical: 4 },
  price: { fontSize: 15, fontWeight: '800', color: Colors.primaryDark },
  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#EBF3EE',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  editBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 12 },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#FFEBEE',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteBtnText: { color: Colors.danger, fontWeight: '700', fontSize: 12 },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 40,
  },
  emptyIcon: { fontSize: 50, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  emptySub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});
