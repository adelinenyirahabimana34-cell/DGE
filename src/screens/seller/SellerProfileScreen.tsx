import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Colors } from '../../constants';
import Button from '../../components/Button';

type Props = NativeStackScreenProps<any, 'SellerProfile'>;

export default function SellerProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

  const handleLogout = () => {
    Alert.alert(t('logout'), 'Are you sure you want to log out of your seller account?', [
      { text: 'Cancel', style: 'cancel' },
      { text: t('logout'), style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Avatar and name */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name
                ?.split(' ')
                .map(n => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase() || 'S'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Seller'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>STORE SELLER / ADMIN</Text>
          </View>
        </View>

        {/* Store Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Business Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Store Name:</Text>
            <Text style={styles.infoValue}>D&G E-Commerce</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>Rwamagana, Eastern Province, Rwanda</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{user?.phone || '+250 788 000 000'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Currency:</Text>
            <Text style={styles.infoValue}>Rwandan Franc (RWF)</Text>
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Management</Text>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate('SellerProducts')}
          >
            <Text style={styles.menuIcon}>📦</Text>
            <Text style={styles.menuText}>Product Inventory</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate('SellerOrders')}
          >
            <Text style={styles.menuIcon}>📋</Text>
            <Text style={styles.menuText}>Customer Orders</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate('AddProduct', {})}
          >
            <Text style={styles.menuIcon}>➕</Text>
            <Text style={styles.menuText}>Add New Product</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Language Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('language')}</Text>
          <TouchableOpacity
            style={styles.langBtn}
            onPress={toggleLanguage}
            activeOpacity={0.7}
          >
            <Text style={styles.langFlag}>
              {language === 'en' ? '🇺🇸' : '🇷🇼'}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.langName}>
                {language === 'en' ? 'English' : 'Ikinyarwanda'}
              </Text>
              <Text style={styles.langHint}>
                {language === 'en'
                  ? 'Tap to switch to Ikinyarwanda'
                  : 'Kanda hano uhindure mu Cyongereza (English)'}
              </Text>
            </View>
            <Text style={styles.langSwitchBadge}>⇄</Text>
          </TouchableOpacity>
        </View>

        {/* About App */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About Application</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version:</Text>
            <Text style={styles.infoValue}>1.0.0 (Academic Project)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Stack:</Text>
            <Text style={styles.infoValue}>React Native CLI + Node.js + Neon Postgres</Text>
          </View>
        </View>

        <Button
          title={t('logout')}
          variant="danger"
          onPress={handleLogout}
          style={{ marginTop: 8 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: {
    padding: 16,
    paddingBottom: 36,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 16,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 24,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: Colors.white,
    fontSize: 26,
    fontWeight: '800',
  },
  name: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  email: { fontSize: 14, color: Colors.textSecondary, marginTop: 2, marginBottom: 8 },
  roleBadge: {
    backgroundColor: '#EBF3EE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary + '44',
  },
  roleText: { fontSize: 11, fontWeight: '700', color: Colors.primary },
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
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: { fontSize: 13, color: Colors.textSecondary },
  infoValue: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, flex: 1, textAlign: 'right' },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuIcon: { fontSize: 18, marginRight: 12 },
  menuText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, flex: 1 },
  chevron: { fontSize: 18, color: Colors.textLight },
  divider: { height: 1, backgroundColor: '#F0F0F0' },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAF8',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langFlag: { fontSize: 24, marginRight: 12 },
  langName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  langHint: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  langSwitchBadge: { fontSize: 18, color: Colors.primary, fontWeight: '800' },
});
