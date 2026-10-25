import React, { useState } from 'react';
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

type Props = NativeStackScreenProps<any, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function setField(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password, form.phone, form.address);
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Could not create account. Please try again.');
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
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>D&G</Text>
            </View>
            <Text style={styles.heading}>Create Account</Text>
            <Text style={styles.subheading}>Register as a client to start shopping</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Full Name *"
              placeholder="e.g. Keza Divine"
              value={form.name}
              onChangeText={v => setField('name', v)}
              error={errors.name}
              autoCapitalize="words"
            />
            <Input
              label="Email Address *"
              placeholder="your@email.com"
              value={form.email}
              onChangeText={v => setField('email', v)}
              error={errors.email}
              keyboardType="email-address"
            />
            <Input
              label="Password *"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChangeText={v => setField('password', v)}
              error={errors.password}
              secureTextEntry
            />
            <Input
              label="Confirm Password *"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChangeText={v => setField('confirmPassword', v)}
              error={errors.confirmPassword}
              secureTextEntry
            />
            <Input
              label="Phone Number (optional)"
              placeholder="+250 7XX XXX XXX"
              value={form.phone}
              onChangeText={v => setField('phone', v)}
              keyboardType="phone-pad"
              autoCapitalize="none"
            />
            <Input
              label="Delivery Address (optional)"
              placeholder="e.g. Rwamagana, Sector Muhazi"
              value={form.address}
              onChangeText={v => setField('address', v)}
              autoCapitalize="sentences"
            />

            <Button title="Create Account" onPress={handleRegister} loading={loading} />

            <View style={styles.loginRow}>
              <Text style={styles.loginLabel}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: 40,
    paddingBottom: 36,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 28,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    elevation: 4,
  },
  logoText: { fontSize: 20, fontWeight: '900', color: Colors.primary },
  heading: { fontSize: 24, fontWeight: '800', color: Colors.white },
  subheading: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  form: { paddingHorizontal: 24 },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginLabel: { color: Colors.textSecondary, fontSize: 14 },
  loginLink: { color: Colors.primary, fontSize: 14, fontWeight: '700' },
});
