import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../../components/Button';
import { Colors } from '../../constants';

type Props = NativeStackScreenProps<any, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

  async function handleLogout() {
    Alert.alert(t('logout'), 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: t('logout'),
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.navigate('Home');
        },
      },
    ]);
  }

  // --- 1. Unauthenticated Guest View ---
  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Guest Header */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, styles.guestAvatar]}>
              <Text style={styles.guestAvatarText}>👤</Text>
            </View>
            <Text style={styles.name}>Welcome to D&G E-Commerce</Text>
            <Text style={styles.guestSubtitle}>Rwamagana, Eastern Province</Text>
          </View>

          {/* Client Authentication Card */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Client Account</Text>
            <Text style={styles.cardDesc}>
              Sign in or create an account to view previous orders, save your delivery address, and track shipments in real time.
            </Text>
            <Button
              title="Sign In"
              onPress={() => navigation.navigate('Login')}
              style={styles.cardBtn}
            />
            <Button
              title="Create Account"
              variant="outline"
              onPress={() => navigation.navigate('Register')}
              style={styles.cardBtn}
            />
          </View>

          {/* Seller / Store Admin Portal Card */}
          <View style={[styles.infoCard, styles.sellerCard]}>
            <View style={styles.sellerBadgeRow}>
              <Text style={styles.sellerIcon}>🏬</Text>
              <Text style={styles.sellerTitle}>Store & Seller Portal</Text>
            </View>
            <Text style={styles.sellerDesc}>
              Are you a store manager or retail seller? Log in here to manage products, stock levels, and order fulfillment.
            </Text>
            <Button
              title="Seller Login →"
              onPress={() => navigation.navigate('Login', { initialRole: 'seller' })}
              style={styles.sellerBtn}
            />
          </View>

          {/* Language Switch Card */}
          <View style={styles.infoCard}>
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

          {/* About */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>About D&G E-Commerce</Text>
            <Text style={styles.aboutText}>
              Fast, reliable e-commerce built specifically for retail shoppers and merchants in Rwamagana, Rwanda.
            </Text>
            <Text style={styles.version}>v1.0 · Academic Project</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- 2. Authenticated Client View ---
  const initials = (user?.name || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>🛍️ Client Account</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Account Details</Text>
          <InfoRow label={t('email')} value={user?.email || '—'} />
          <InfoRow label={t('phoneNumber')} value={user?.phone || 'Not set'} />
          <InfoRow label={t('deliveryAddress')} value={user?.address || 'Not set'} />
        </View>

        {/* Language Switch Card */}
        <View style={styles.infoCard}>
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

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title={t('orders')}
            variant="outline"
            onPress={() => navigation.navigate('Orders')}
            style={styles.actionBtn}
          />
          <Button
            title={t('logout')}
            variant="danger"
            onPress={handleLogout}
            style={styles.actionBtn}
          />
        </View>

        <Text style={styles.version}>D&G E-Commerce v1.0 · Rwamagana, Rwanda</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: {
    padding: 16,
    paddingBottom: 36,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 16,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 22,
    backgroundColor: Colors.white,
    borderRadius: 16,
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
    marginBottom: 10,
  },
  guestAvatar: {
    backgroundColor: '#E8F5E9',
  },
  guestAvatarText: {
    fontSize: 34,
  },
  avatarText: { color: Colors.white, fontSize: 24, fontWeight: '800' },
  name: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  guestSubtitle: { fontSize: 13, color: Colors.textSecondary },
  roleBadge: {
    backgroundColor: '#EBF3EE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 4,
  },
  roleText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  infoCard: {
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
  cardTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  cardDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 14,
  },
  cardBtn: {
    marginBottom: 10,
  },
  sellerCard: {
    backgroundColor: '#F8F9FD',
    borderColor: '#C7D2FE',
    borderWidth: 1.5,
  },
  sellerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sellerIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sellerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3730A3',
  },
  sellerDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 19,
    marginBottom: 14,
  },
  sellerBtn: {
    backgroundColor: '#4338CA',
  },
  aboutText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoLabel: { fontSize: 13, color: Colors.textSecondary },
  infoValue: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, flex: 1, textAlign: 'right' },
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
  actions: { marginBottom: 16 },
  actionBtn: { marginBottom: 10 },
  version: { textAlign: 'center', fontSize: 12, color: Colors.textLight, marginTop: 4 },
});
