import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Colors, formatRWF } from '../../constants';

type Props = NativeStackScreenProps<any, 'Checkout'>;

export default function CheckoutScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();

  useEffect(() => {
    if (!user) {
      navigation.replace('Login', { returnTo: 'Checkout' });
    }
  }, [user]);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function setField(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.address.trim()) e.address = 'Delivery address is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handlePlaceOrder() {
    if (!validate()) return;
    setLoading(true);
    try {
      const orderItems = items.map(i => ({
        product_id: i.product.id,
        quantity: i.quantity,
      }));

      const order = await orderService.create({
        items: orderItems,
        delivery_address: form.address.trim(),
        phone_number: form.phone.trim(),
        notes: form.notes.trim() || undefined,
      });

      clearCart();
      Alert.alert(
        'Order Placed! 🎉',
        `Your order #${order.id} has been placed successfully.\nStatus: Pending`,
        [
          {
            text: 'View My Orders',
            onPress: () => {
              navigation.replace('OrderDetail', { orderId: order.id });
            },
          },
          {
            text: 'OK',
            onPress: () => navigation.navigate('ClientRoot', { screen: 'Home' }),
          },
        ],
      );
    } catch (err: any) {
      Alert.alert('Order Failed', err.message || 'Could not place order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.orderCard}>
            {items.map(item => (
              <View key={item.product.id} style={styles.orderRow}>
                <Text style={styles.orderItemName} numberOfLines={1}>{item.product.title}</Text>
                <Text style={styles.orderItemQty}>×{item.quantity}</Text>
                <Text style={styles.orderItemTotal}>
                  {formatRWF(parseFloat(String(item.product.price)) * item.quantity)}
                </Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={[styles.orderRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatRWF(totalPrice)}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <View style={styles.formCard}>
            <Input
              label="Full Name"
              value={form.name}
              onChangeText={v => setField('name', v)}
              placeholder="Your name"
              autoCapitalize="words"
            />
            <Input
              label="Phone Number *"
              value={form.phone}
              onChangeText={v => setField('phone', v)}
              error={errors.phone}
              placeholder="+250 7XX XXX XXX"
              keyboardType="phone-pad"
              autoCapitalize="none"
            />
            <Input
              label="Delivery Address *"
              value={form.address}
              onChangeText={v => setField('address', v)}
              error={errors.address}
              placeholder="e.g. Rwamagana, Sector Muhazi"
              autoCapitalize="sentences"
            />
            <Input
              label="Additional Notes (optional)"
              value={form.notes}
              onChangeText={v => setField('notes', v)}
              placeholder="e.g. Call before delivery"
              autoCapitalize="sentences"
            />
          </View>

          <View style={styles.paymentNote}>
            <Text style={styles.paymentNoteText}>
              💳 Payment on Delivery — Pay when your order arrives. Our seller will contact you to confirm.
            </Text>
          </View>

          <Button
            title="Place Order"
            onPress={handlePlaceOrder}
            loading={loading}
            style={styles.placeBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderItemName: { flex: 1, fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
  orderItemQty: { fontSize: 13, color: Colors.textSecondary, marginHorizontal: 8 },
  orderItemTotal: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 10 },
  totalRow: { marginBottom: 0 },
  totalLabel: { flex: 1, fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  totalValue: { fontSize: 18, fontWeight: '900', color: Colors.primary },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  paymentNote: {
    backgroundColor: Colors.accent + '20',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.accent + '40',
  },
  paymentNoteText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  placeBtn: { marginBottom: 16 },
});
