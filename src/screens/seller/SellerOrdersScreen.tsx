import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  ScrollView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';
import { Colors, formatRWF } from '../../constants';
import StatusBadge from '../../components/StatusBadge';
import LoadingView from '../../components/LoadingView';

type Props = NativeStackScreenProps<any, 'SellerOrders'>;

const STATUS_FILTERS = ['ALL', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function SellerOrdersScreen({ navigation }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (err: any) {
      // silent or handled
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchOrders().finally(() => setLoading(false));
    });
    return unsubscribe;
  }, [navigation, fetchOrders]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const filteredOrders =
    selectedFilter === 'ALL'
      ? orders
      : orders.filter(o => o.status.toLowerCase() === selectedFilter.toLowerCase());

  const renderOrderItem = ({ item }: { item: Order }) => {
    const formattedDate = item.created_at
      ? new Date(item.created_at).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Recent';

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('SellerOrderDetail', { orderId: item.id })}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderNumber}>Order #{item.id}</Text>
            <Text style={styles.orderDate}>{formattedDate}</Text>
          </View>
          <StatusBadge status={item.status} />
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardRow}>
          <Text style={styles.clientLabel}>Customer:</Text>
          <Text style={styles.clientName}>{item.client_name || 'Customer'}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.clientLabel}>Delivery to:</Text>
          <Text style={styles.addressText} numberOfLines={1}>
            {item.delivery_address}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.itemCount}>
            {item.items ? `${item.items.length} items` : 'Order details'}
          </Text>
          <Text style={styles.totalAmount}>{formatRWF(item.total_amount)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return <LoadingView message="Loading customer orders..." />;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {STATUS_FILTERS.map(filter => {
            const isSelected = selectedFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={item => String(item.id)}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptySub}>
              {selectedFilter === 'ALL'
                ? 'No client orders have been placed yet.'
                : `No orders with status "${selectedFilter}".`}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  filterBar: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 10,
    paddingBottom: 10,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  filterTextSelected: {
    color: Colors.white,
    fontWeight: '700',
  },
  list: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  orderDate: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  cardDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 12 },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  clientLabel: { fontSize: 13, color: Colors.textSecondary },
  clientName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  addressText: { fontSize: 13, color: Colors.textPrimary, flex: 1, textAlign: 'right', marginLeft: 8 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  itemCount: { fontSize: 13, color: Colors.textLight },
  totalAmount: { fontSize: 16, fontWeight: '800', color: Colors.primaryDark },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 40,
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  emptySub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
});
