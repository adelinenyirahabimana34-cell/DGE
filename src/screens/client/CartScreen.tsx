import React from 'react';
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
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { CartItem } from '../../types';
import Button from '../../components/Button';
import { Colors, formatRWF } from '../../constants';

type Props = NativeStackScreenProps<any, 'Cart'>;

function CartRow({ item, onIncrease, onDecrease, onRemove }: {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}) {
  const img = item.product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=60';

  return (
    <View style={styles.row}>
      <Image source={{ uri: img }} style={styles.img} resizeMode="cover" />
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle} numberOfLines={2}>{item.product.title}</Text>
        <Text style={styles.rowPrice}>{formatRWF(item.product.price)}</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={onDecrease}>
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qty}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={onIncrease}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.subtotal}>{formatRWF(parseFloat(String(item.product.price)) * item.quantity)}</Text>
    </View>
  );
}

export default function CartScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { items, count, totalPrice, addItem, updateQty, removeItem, clearCart } = useCart();

  function handleClearCart() {
    Alert.alert('Clear Cart', 'Are you sure you want to remove all items?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearCart },
    ]);
  }

  function handleCheckout() {
    if (!user) {
      navigation.navigate('Login', { returnTo: 'Checkout' });
    } else {
      navigation.navigate('Checkout');
    }
  }

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Browse products and add items to your cart</Text>
          <Button title="Start Shopping" onPress={() => navigation.navigate('Home')} style={styles.shopBtn} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={items}
        keyExtractor={item => String(item.product.id)}
        renderItem={({ item }) => (
          <CartRow
            item={item}
            onIncrease={() => updateQty(item.product.id, item.quantity + 1)}
            onDecrease={() => updateQty(item.product.id, item.quantity - 1)}
            onRemove={() => removeItem(item.product.id)}
          />
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            {!user && (
              <View style={styles.guestBanner}>
                <Text style={styles.guestBannerText}>
                  👤 Shopping as Guest · Sign in required at checkout
                </Text>
              </View>
            )}
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderTitle}>{count} item{count !== 1 ? 's' : ''} in cart</Text>
              <TouchableOpacity onPress={handleClearCart}>
                <Text style={styles.clearText}>Clear all</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />

      {/* Footer summary */}
      <View style={styles.footer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatRWF(totalPrice)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatRWF(totalPrice)}</Text>
        </View>
        <Button
          title={user ? 'Proceed to Checkout' : 'Sign In & Checkout'}
          onPress={handleCheckout}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  list: {
    padding: 16,
    paddingBottom: 8,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 16,
  },
  guestBanner: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  guestBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listHeaderTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  clearText: { fontSize: 13, color: Colors.danger, fontWeight: '600' },
  row: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'flex-start',
  },
  img: { width: 80, height: 80, borderRadius: 8, backgroundColor: Colors.border },
  rowBody: { flex: 1, marginHorizontal: 12 },
  rowTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4, lineHeight: 20 },
  rowPrice: { fontSize: 13, color: Colors.primary, fontWeight: '700', marginBottom: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { color: Colors.white, fontSize: 18, fontWeight: '700', lineHeight: 22 },
  qty: { fontSize: 15, fontWeight: '700', minWidth: 24, textAlign: 'center', color: Colors.textPrimary },
  removeBtn: { marginLeft: 4 },
  removeText: { fontSize: 12, color: Colors.danger, fontWeight: '600' },
  subtotal: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary, alignSelf: 'flex-end' },
  footer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    elevation: 8,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: Colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  totalRow: { marginBottom: 16 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  totalValue: { fontSize: 18, fontWeight: '900', color: Colors.primary },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 24 },
  shopBtn: { width: 200 },
});
