import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import LoadingView from '../../components/LoadingView';
import ErrorView from '../../components/ErrorView';
import { Colors, formatRWF } from '../../constants';

type Props = NativeStackScreenProps<any, 'OrderDetail'>;

export default function OrderDetailScreen({ route }: Props) {
  const { orderId } = (route.params || {}) as { orderId: number };
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    orderService.getById(orderId)
      .then(o => setOrder(o))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <LoadingView />;
  if (error || !order) return <ErrorView message={error || 'Order not found'} />;

  const date = order.created_at
    ? new Date(order.created_at).toLocaleDateString('en-GB', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : '';

  const steps = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
  const currentStep = steps.indexOf(order.status);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Order Header */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <Text style={styles.orderId}>Order #{order.id}</Text>
            <StatusBadge status={order.status} />
          </View>
          <Text style={styles.date}>{date}</Text>
        </View>

        {/* Progress tracker */}
        {order.status !== 'Cancelled' && (
          <View style={styles.progressCard}>
            <Text style={styles.sectionTitle}>Order Progress</Text>
            <View style={styles.track}>
              {steps.map((step, idx) => (
                <View key={step} style={styles.stepWrapper}>
                  <View style={[styles.stepDot, idx <= currentStep && styles.stepDotActive]}>
                    <Text style={styles.stepDotText}>{idx < currentStep ? '✓' : idx === currentStep ? '●' : ''}</Text>
                  </View>
                  <Text style={[styles.stepLabel, idx <= currentStep && styles.stepLabelActive]}>{step}</Text>
                  {idx < steps.length - 1 && (
                    <View style={[styles.stepLine, idx < currentStep && styles.stepLineActive]} />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items Ordered</Text>
          {(order.items || []).map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              {item.image_url && (
                <Image source={{ uri: item.image_url }} style={styles.itemImg} />
              )}
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={2}>{item.product_title}</Text>
                <Text style={styles.itemQty}>Qty: {item.quantity} × {formatRWF(item.unit_price)}</Text>
              </View>
              <Text style={styles.itemTotal}>{formatRWF(item.total_price)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>{formatRWF(order.total_amount)}</Text>
          </View>
        </View>

        {/* Delivery Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{order.phone_number}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{order.delivery_address}</Text>
          </View>
          {order.notes ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Notes</Text>
              <Text style={styles.infoValue}>{order.notes}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16, paddingBottom: 32 },
  headerCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  orderId: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  date: { fontSize: 13, color: Colors.textSecondary },
  progressCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },
  track: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  stepWrapper: { flex: 1, alignItems: 'center', position: 'relative' },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepDotActive: { backgroundColor: Colors.primary },
  stepDotText: { color: Colors.white, fontSize: 12, fontWeight: '700' },
  stepLabel: { fontSize: 10, color: Colors.textLight, textAlign: 'center' },
  stepLabelActive: { color: Colors.primary, fontWeight: '700' },
  stepLine: {
    position: 'absolute',
    top: 14,
    right: '-50%',
    width: '100%',
    height: 2,
    backgroundColor: Colors.border,
    zIndex: -1,
  },
  stepLineActive: { backgroundColor: Colors.primary },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemImg: { width: 56, height: 56, borderRadius: 8, backgroundColor: Colors.border, marginRight: 12 },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, lineHeight: 18, marginBottom: 4 },
  itemQty: { fontSize: 12, color: Colors.textSecondary },
  itemTotal: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 10 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  totalValue: { fontSize: 17, fontWeight: '900', color: Colors.primary },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: { width: 70, fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  infoValue: { flex: 1, fontSize: 13, color: Colors.textPrimary, lineHeight: 20 },
});
