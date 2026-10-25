import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../../constants';

type Props = NativeStackScreenProps<any, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Top green header section */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>D&G</Text>
          </View>
          <Text style={styles.appName}>D&G E-Commerce</Text>
          <Text style={styles.tagline}>Your trusted shop in Rwamagana, Rwanda</Text>
        </View>

        {/* Illustration area */}
        <View style={styles.illustrationBox}>
          <Text style={styles.illustrationEmoji}>🛍️</Text>
          <Text style={styles.illustrationTitle}>Shop Smart, Live Better</Text>
          <Text style={styles.illustrationSub}>
            Browse products, place orders, and manage your store — all in one place.
          </Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnOutlineText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          © 2026 D&G Commerce · Rwamagana, Rwanda
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 1,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
  },
  illustrationBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  illustrationEmoji: { fontSize: 80, marginBottom: 20 },
  illustrationTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  illustrationSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 10,
  },
  btnPrimaryText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  btnOutline: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  btnOutlineText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    textAlign: 'center',
    color: Colors.textLight,
    fontSize: 11,
    paddingBottom: 16,
  },
});
