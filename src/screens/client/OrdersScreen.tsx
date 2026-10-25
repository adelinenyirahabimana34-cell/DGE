import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import LoadingView from '../../components/LoadingView';
import ErrorView from '../../components/ErrorView';
import Button from '../../components/Button';
import { Colors, formatRWF } from '../../constants';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<any, 'Orders'>;

export default function OrdersScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const data = await orderService.getAll();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      loadOrders().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, loadOrders]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  // If user is not authenticated, show protected state with login action
  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />
        <View style={styles.authRequiredContainer}>
          <Text style={styles.lockIcon}>📋</Text>
          <Text style={styles.authTitle}>Track Your Orders</Text>
          <Text style={styles.authSubtitle}>
            Sign in with your D&G account to view your past purchases and track real-time delivery progress in Rwamagana.
          </Text>
          <Button
            title="Sign In to View Orders"
            onPress={() => navigation.navigate('Login', { returnTo: 'Orders' })}
            style={styles.authBtn}
          />
          <Button
            title="Create New Account"
            variant="outline"
            onPress={() => navigation.navigate('Register')}
            style={styles.registerBtn}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (loading) return <LoadingView message="Loading your orders..." />;
  if (error) {
    return (
      <ErrorView
        message={error}
        onRetry={() => {
          setLoading(true);
          loadOrders().finally(() => setLoading(false));
        }}
      />
    );
  }

  function renderOrder({ item }: { item: Order }) {
    const date = item.created_at
      ? new Date(item.created_at).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : '';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
        activeOpacity={0.85}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <StatusBadge status={item.status} />
        </View>
        <Text style={styles.date}>{date}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.items}>
            {item.items?.length ?? '?'} item{(item.items?.length ?? 1) !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.total}>{formatRWF(item.total_amount)}</Text>
        </View>
        <Text style={styles.viewDetail}>View details →</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={orders}
        keyExtractor={o => String(o.id)}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
        ListHeaderComponent={<Text style={styles.heading}>My Orders</Text>}
        ListEmptyComponent={
          <ErrorView
            message="You haven't placed any orders yet."
            icon="📋"
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  list: {
    padding: 16,
    paddingBottom: 24,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderId: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  date: { fontSize: 12, color: Colors.textLight, marginBottom: 10 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  items: { fontSize: 13, color: Colors.textSecondary },
  total: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  viewDetail: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
  authRequiredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  lockIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  authTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  authBtn: {
    width: '100%',
    marginBottom: 12,
  },
  registerBtn: {
    width: '100%',
  },
});
