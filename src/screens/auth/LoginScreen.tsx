import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Colors } from '../../constants';

type Props = NativeStackScreenProps<any, 'Login'>;

export default function LoginScreen({ route, navigation }: Props) {
  const { login } = useAuth();
  const initialRole = (route.params as any)?.initialRole as 'client' | 'seller' | undefined;
  const returnTo = (route.params as any)?.returnTo as string | undefined;

  const [activeTab, setActiveTab] = useState<'client' | 'seller'>(initialRole === 'seller' ? 'seller' : 'client');
  const [email, setEmail] = useState(initialRole === 'seller' ? 'seller@dg.rw' : 'client@dg.rw');
  const [password, setPassword] = useState(initialRole === 'seller' ? 'seller123' : 'client123');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'seller') {
      setEmail('seller@dg.rw');
      setPassword('seller123');
    } else {
      setEmail('client@dg.rw');
      setPassword('client123');
    }
    setErrors({});
  }, [activeTab]);

  function validate(): boolean {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim(), password);

      // If user is client, handle redirection
      if (returnTo === 'Checkout') {
        navigation.replace('Checkout');
      } else if (returnTo === 'Orders') {
        navigation.navigate('ClientRoot', { screen: 'Orders' });
      } else {
        navigation.navigate('ClientRoot', { screen: 'Home' });
      }
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.backText}>← Back to Store</Text>
            </TouchableOpacity>

            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>D&G</Text>
            </View>
            <Text style={styles.heading}>
              {activeTab === 'seller' ? 'Seller & Store Portal' : 'Welcome to D&G'}
            </Text>
            <Text style={styles.subheading}>
              {returnTo === 'Checkout'
                ? 'Sign in to confirm delivery and complete checkout'
                : activeTab === 'seller'
                ? 'Sign in to manage inventory & fulfill orders'
                : 'Sign in to your account'}
            </Text>
          </View>

          {/* Role Switcher Tabs */}
          <View style={styles.roleTabsContainer}>
            <TouchableOpacity
              style={[styles.roleTab, activeTab === 'client' && styles.roleTabActive]}
              onPress={() => setActiveTab('client')}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleTabText, activeTab === 'client' && styles.roleTabTextActive]}>
                🛍️ Client / Shopper
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleTab, activeTab === 'seller' && styles.roleTabActive]}
              onPress={() => setActiveTab('seller')}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleTabText, activeTab === 'seller' && styles.roleTabTextActive]}>
                🏬 Store Seller
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Email Address"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry
            />

            <Button
              title={
                activeTab === 'seller'
                  ? 'Sign In as Seller'
                  : returnTo === 'Checkout'
                  ? 'Sign In & Proceed to Checkout'
                  : 'Sign In'
              }
              onPress={handleLogin}
              loading={loading}
              style={activeTab === 'seller' ? styles.sellerSignInBtn : undefined}
            />

            {/* Demo credentials hint */}
            <View style={styles.demoBox}>
              <Text style={styles.demoTitle}>Quick Demo Login (Tap to autofill):</Text>
              <TouchableOpacity
                onPress={() => {
                  setActiveTab('client');
                  setEmail('client@dg.rw');
                  setPassword('client123');
                  setErrors({});
                }}
                style={styles.demoRow}
              >
                <Text style={styles.demoTextBold}>🛍️ Client:</Text>
                <Text style={styles.demoText}> client@dg.rw / client123</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setActiveTab('seller');
                  setEmail('seller@dg.rw');
                  setPassword('seller123');
                  setErrors({});
                }}
                style={styles.demoRow}
              >
                <Text style={styles.demoTextBold}>🏬 Seller:</Text>
                <Text style={styles.demoText}> seller@dg.rw / seller123</Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'client' && (
              <View style={styles.registerRow}>
                <Text style={styles.registerLabel}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.registerLink}>Create one</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: 32 },
  header: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  backText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '700',
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 4,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primary,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  roleTabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#E5EBE7',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  roleTabActive: {
    backgroundColor: Colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  roleTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  roleTabTextActive: {
    fontWeight: '800',
    color: Colors.primary,
  },
  form: {
    paddingHorizontal: 20,
  },
  sellerSignInBtn: {
    backgroundColor: '#4338CA',
  },
  demoBox: {
    backgroundColor: Colors.primary + '11',
    borderWidth: 1,
    borderColor: Colors.primary + '33',
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
    marginBottom: 18,
  },
  demoTitle: {
    fontWeight: '700',
    color: Colors.primary,
    fontSize: 12,
    marginBottom: 6,
  },
  demoRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    alignItems: 'center',
  },
  demoTextBold: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginRight: 4,
  },
  demoText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  registerLabel: { color: Colors.textSecondary, fontSize: 14 },
  registerLink: { color: Colors.primary, fontSize: 14, fontWeight: '700' },
});
