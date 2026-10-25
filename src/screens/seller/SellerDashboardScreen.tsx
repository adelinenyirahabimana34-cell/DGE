import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { orderService } from '../../services/orderService';
import { SellerSummary } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import LoadingView from '../../components/LoadingView';
import { Colors, formatRWF } from '../../constants';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<any, 'SellerDashboard'>;

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <View style={[styles.statCard, color ? { borderLeftColor: color } : null]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function SellerDashboardScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [summary, setSummary] = useState<SellerSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const s = await orderService.getSellerSummary();
      setSummary(s);
    } catch (err) {
      // Silent fail — show zero data gracefully
    }
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, []);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  if (loading) return <LoadingView message="Loading dashboard..." />;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back, {user?.name?.split(' ')[0]}</Text>
            <Text style={styles.headerTitle}>Seller Dashboard</Text>
          </View>
          <Text style={styles.storeName}>D&G</Text>
        </View>

        {/* Quick actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: Colors.primary }]}
            onPress={() => navigation.navigate('SellerProducts')}
          >
            <Text style={styles.quickIcon}>📦</Text>
            <Text style={styles.quickLabel}>Products</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: Colors.accent }]}
            onPress={() => navigation.navigate('SellerOrders')}
          >
            <Text style={styles.quickIcon}>📋</Text>
            <Text style={styles.quickLabel}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: Colors.primaryDark }]}
            onPress={() => navigation.navigate('AddProduct', {})}
          >
            <Text style={styles.quickIcon}>➕</Text>
            <Text style={styles.quickLabel}>Add Product</Text>
          </TouchableOpacity>
        </View>

        {/* Summary stats */}
        {summary && (
          <>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsGrid}>
              <StatCard label="Total Orders" value={summary.total_orders} color={Colors.primary} />
              <StatCard label="Revenue" value={formatRWF(summary.total_revenue)} color={Colors.success} />
              <StatCard label="My Products" value={summary.total_products} color={Colors.accent} />
              <StatCard label="Total Stock" value={summary.total_stock} color={Colors.primaryDark} />
            </View>

            <Text style={styles.sectionTitle}>Orders by Status</Text>
            <View style={styles.statusGrid}>
              {[
                { label: 'Pending', count: summary.pending_count, color: Colors.statusPending },
                { label: 'Confirmed', count: summary.confirmed_count, color: Colors.statusConfirmed },
                { label: 'Shipped', count: summary.shipped_count, color: Colors.statusShipped },
                { label: 'Delivered', count: summary.delivered_count, color: Colors.statusDelivered },
              ].map(s => (
                <View key={s.label} style={[styles.statusChip, { borderColor: s.color + '55', backgroundColor: s.color + '11' }]}>
                  <Text style={[styles.statusCount, { color: s.color }]}>{s.count}</Text>
                  <Text style={[styles.statusLabel, { color: s.color }]}>{s.label}</Text>
                </View>
              ))}
            </View>

            {summary.recent_orders.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Orders</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('SellerOrders')}>
                    <Text style={styles.viewAll}>View all →</Text>
                  </TouchableOpacity>
                </View>
                {summary.recent_orders.map(o => (
                  <View key={o.id} style={styles.recentCard}>
                    <View style={styles.recentRow}>
                      <Text style={styles.recentId}>Order #{o.id}</Text>
                      <StatusBadge status={o.status} />
                    </View>
                    <View style={styles.recentRow}>
                      <Text style={styles.recentClient}>{o.client_name}</Text>
                      <Text style={styles.recentTotal}>{formatRWF(o.total_amount)}</Text>
                    </View>
                  </View>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: {
    padding: 16,
    paddingBottom: 32,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 16,
  },
  header: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.white, marginTop: 2 },
  storeName: {
    fontSize: 30,
    fontWeight: '900',
    color: Colors.white,
    opacity: 0.2,
    letterSpacing: 2,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  quickBtn: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    elevation: 2,
  },
  quickIcon: { fontSize: 22, marginBottom: 4 },
  quickLabel: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, marginBottom: 12 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAll: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    width: '47%',
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    elevation: 2,
  },
  statValue: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary, marginBottom: 4 },
  statLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statusChip: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    width: '47%',
    alignItems: 'center',
  },
  statusCount: { fontSize: 22, fontWeight: '900', marginBottom: 2 },
  statusLabel: { fontSize: 12, fontWeight: '700' },
  recentCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    elevation: 2,
  },
  recentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  recentId: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  recentClient: { fontSize: 13, color: Colors.textSecondary },
  recentTotal: { fontSize: 14, fontWeight: '700', color: Colors.primary },
});
