import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import Button from '../../components/Button';
import LoadingView from '../../components/LoadingView';
import ErrorView from '../../components/ErrorView';
import { Colors, formatRWF } from '../../constants';

type Props = NativeStackScreenProps<any, 'ProductDetail'>;

export default function ProductDetailScreen({ route, navigation }: Props) {
  const { productId } = (route.params || {}) as { productId: number };
  const { addItem, items } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  const cartItem = items.find(i => i.product.id === productId);

  useEffect(() => {
    productService.getById(productId)
      .then(p => setProduct(p))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) return <LoadingView />;
  if (error || !product) return <ErrorView message={error || 'Product not found'} onRetry={() => navigation.goBack()} />;

  const maxQty = product.stock;
  const inStock = product.stock > 0;

  function handleAddToCart() {
    if (!product) return;
    if (!inStock) {
      Alert.alert('Out of Stock', 'This product is currently unavailable.');
      return;
    }
    addItem(product, qty);
    Alert.alert('Added to Cart ✓', `${product.title} (${qty}) added to your cart.`, [
      { text: 'Continue Shopping', style: 'cancel' },
      { text: 'View Cart', onPress: () => navigation.navigate('ClientRoot', { screen: 'Cart' }) },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image
          source={{
            uri: product.image_url ||
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
          }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.body}>
          {/* Category tag */}
          {product.category_name && (
            <Text style={styles.category}>{product.category_name}</Text>
          )}
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>{formatRWF(product.price)}</Text>

          {/* Stock info */}
          <View style={[styles.stockBadge, !inStock && styles.outBadge]}>
            <Text style={[styles.stockText, !inStock && styles.outText]}>
              {inStock ? `✓  ${product.stock} items in stock` : '✕  Out of stock'}
            </Text>
          </View>

          {/* Description */}
          {product.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          ) : null}

          {/* Seller info */}
          {product.seller_name ? (
            <View style={styles.sellerRow}>
              <Text style={styles.sellerLabel}>Seller:</Text>
              <Text style={styles.sellerName}>{product.seller_name}</Text>
            </View>
          ) : null}

          {/* Quantity selector */}
          {inStock && (
            <View style={styles.qtySection}>
              <Text style={styles.sectionTitle}>Quantity</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQty(q => Math.max(1, q - 1))}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{qty}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQty(q => Math.min(maxQty, q + 1))}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {cartItem && (
            <Text style={styles.inCartHint}>
              ✓ You already have {cartItem.quantity} in your cart
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Bottom action */}
      <View style={styles.footer}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={styles.footerPrice}>{formatRWF(parseFloat(String(product.price)) * qty)}</Text>
        </View>
        <Button
          title={inStock ? 'Add to Cart' : 'Out of Stock'}
          onPress={handleAddToCart}
          disabled={!inStock}
          style={styles.addBtn}
          fullWidth={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 90 },
  image: { width: '100%', height: 280, backgroundColor: Colors.border },
  body: { padding: 20 },
  category: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
    lineHeight: 30,
  },
  price: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.primary,
    marginBottom: 12,
  },
  stockBadge: {
    backgroundColor: Colors.success + '18',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  outBadge: { backgroundColor: Colors.danger + '18' },
  stockText: { fontSize: 13, fontWeight: '600', color: Colors.success },
  outText: { color: Colors.danger },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  sellerRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  sellerLabel: { fontSize: 13, color: Colors.textSecondary, marginRight: 6 },
  sellerName: { fontSize: 13, color: Colors.primary, fontWeight: '700' },
  qtySection: { marginBottom: 16 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { color: Colors.white, fontSize: 22, fontWeight: '700', lineHeight: 26 },
  qtyValue: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, minWidth: 30, textAlign: 'center' },
  inCartHint: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: '600',
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    elevation: 8,
  },
  footerTotal: { flex: 1 },
  footerLabel: { fontSize: 12, color: Colors.textSecondary },
  footerPrice: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  addBtn: { minWidth: 150 },
});
