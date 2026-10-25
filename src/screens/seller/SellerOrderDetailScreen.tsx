import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';
import { Colors, formatRWF } from '../../constants';
import StatusBadge from '../../components/StatusBadge';
import LoadingView from '../../components/LoadingView';
import ErrorView from '../../components/ErrorView';

type Props = NativeStackScreenProps<any, 'SellerOrderDetail'>;

const STATUSES = [
  { key: 'Pending', label: 'Pending', icon: '⏳', color: Colors.statusPending },
  { key: 'Confirmed', label: 'Confirmed', icon: '✅', color: Colors.statusConfirmed },
  { key: 'Shipped', label: 'Shipped', icon: '🚚', color: Colors.statusShipped },
  { key: 'Delivered', label: 'Delivered', icon: '📦', color: Colors.statusDelivered },
  { key: 'Cancelled', label: 'Cancelled', icon: '❌', color: Colors.statusCancelled },
];

export default function SellerOrderDetailScreen({ route, navigation }: Props) {
  const { orderId } = route.params as { orderId: number };
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    try {
      setError(null);
      const data = await orderService.getById(orderId);
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load order');
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder().finally(() => setLoading(false));
  }, [fetchOrder]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrder();
    setRefreshing(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (order?.status.toLowerCase() === newStatus.toLowerCase()) return;

    Alert.alert(
      'Update Status',
      `Change order #${orderId} status to "${newStatus.toUpperCase()}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setUpdating(true);
            try {
              const updated = await orderService.updateStatus(orderId, newStatus);
              setOrder(updated);
              Alert.alert('Status Updated', `Order is now ${newStatus}`);
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to update order status');
            } finally {
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  if (loading) return <LoadingView message="Loading order details..." />;
  if (error || !order) {
    return <ErrorView message={error || 'Order not found'} onRetry={fetchOrder} />;
  }

  const formattedDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recent';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
      >
        {/* Header Card */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.orderId}>Order #{order.id}</Text>
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
            <StatusBadge status={order.status} />
          </View>
        </View>

        {/* Status Update Actions */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Update Order Status</Text>
          <Text style={styles.sectionSubtitle}>
            Select a new status to update the customer on progress:
          </Text>
          <View style={styles.statusButtonsGrid}>
            {STATUSES.map(s => {
              const isCurrent = order.status.toLowerCase() === s.key.toLowerCase();
              return (
                <TouchableOpacity
                  key={s.key}
                  disabled={updating}
                  style={[
                    styles.statusBtn,
                    { borderColor: s.color },
                    isCurrent && { backgroundColor: s.color },
                  ]}
                  onPress={() => handleStatusChange(s.key)}
                >
                  <Text style={styles.statusIcon}>{s.icon}</Text>
                  <Text
                    style={[
                      styles.statusBtnText,
                      { color: isCurrent ? Colors.white : s.color },
                    ]}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{order.client_name || 'Customer'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{order.phone_number}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Delivery Address:</Text>
            <Text style={styles.infoValue}>{order.delivery_address}</Text>
          </View>
          {order.notes ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Notes:</Text>
              <Text style={styles.infoValue}>{order.notes}</Text>
            </View>
          ) : null}
        </View>

        {/* Order Items */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Purchased Items ({order.items?.length || 0})</Text>
          {order.items?.map(item => {
            const imageUri =
              item.image_url ||
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=60';
            return (
              <View key={item.id} style={styles.itemRow}>
                <Image source={{ uri: imageUri }} style={styles.itemImage} resizeMode="cover" />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.product_title}
                  </Text>
                  <Text style={styles.itemSubtitle}>
                    {formatRWF(item.unit_price || item.price_at_order || 0)} × {item.quantity}
                  </Text>
                </View>
                <Text style={styles.itemTotal}>
                  {formatRWF(item.total_price || item.subtotal || 0)}
                </Text>
              </View>
            );
          })}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Revenue</Text>
            <Text style={styles.totalAmount}>{formatRWF(order.total_amount)}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16, paddingBottom: 36 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  dateText: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  sectionSubtitle: { fontSize: 12, color: Colors.textSecondary, marginBottom: 12 },
  statusButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    backgroundColor: Colors.white,
  },
  statusIcon: { fontSize: 14, marginRight: 6 },
  statusBtnText: { fontSize: 13, fontWeight: '700' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: { fontSize: 13, color: Colors.textSecondary, width: 120 },
  infoValue: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, flex: 1, textAlign: 'right' },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  itemImage: { width: 50, height: 50, borderRadius: 8, backgroundColor: Colors.border, marginRight: 12 },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  itemSubtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  itemTotal: { fontSize: 14, fontWeight: '700', color: Colors.primaryDark },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 12 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  totalAmount: { fontSize: 18, fontWeight: '800', color: Colors.primary },
});
