import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Colors } from '../constants';
import LoadingView from '../components/LoadingView';

// Auth screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Client screens
import HomeScreen from '../screens/client/HomeScreen';
import ProductDetailScreen from '../screens/client/ProductDetailScreen';
import CartScreen from '../screens/client/CartScreen';
import CheckoutScreen from '../screens/client/CheckoutScreen';
import OrdersScreen from '../screens/client/OrdersScreen';
import OrderDetailScreen from '../screens/client/OrderDetailScreen';
import ProfileScreen from '../screens/client/ProfileScreen';

// Seller screens
import SellerDashboardScreen from '../screens/seller/SellerDashboardScreen';
import SellerProductsScreen from '../screens/seller/SellerProductsScreen';
import AddEditProductScreen from '../screens/seller/AddEditProductScreen';
import SellerOrdersScreen from '../screens/seller/SellerOrdersScreen';
import SellerOrderDetailScreen from '../screens/seller/SellerOrderDetailScreen';
import SellerProfileScreen from '../screens/seller/SellerProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- Client Bottom Tabs ---
function ClientTabs() {
  const { count } = useCart();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '🛍️' : '🏬'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarBadge: count > 0 ? count : undefined,
          tabBarBadgeStyle: {
            backgroundColor: Colors.accent,
            color: Colors.white,
            fontSize: 10,
            fontWeight: '700',
          },
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '🛒' : '🛒'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'My Orders',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '📑' : '📋'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '👤' : '👥'}</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// --- Seller Bottom Tabs ---
function SellerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="SellerDashboard"
        component={SellerDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '📈' : '📊'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="SellerProducts"
        component={SellerProductsScreen}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '📦' : '🏷️'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="SellerOrders"
        component={SellerOrdersScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '📑' : '📋'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="SellerProfile"
        component={SellerProfileScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '⚙️' : '🔧'}</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// --- Main Root Navigator ---
export default function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingView message="Loading D&G E-Commerce..." />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user?.role === 'seller' ? (
        // Seller Protected Stack
        <Stack.Group>
          <Stack.Screen name="SellerRoot" component={SellerTabs} />
          <Stack.Screen
            name="AddProduct"
            component={AddEditProductScreen}
            options={{
              headerShown: true,
              headerTitle: 'Manage Product',
              headerStyle: { backgroundColor: Colors.primary },
              headerTintColor: Colors.white,
              headerTitleStyle: { fontWeight: '700' },
            }}
          />
          <Stack.Screen
            name="SellerOrderDetail"
            component={SellerOrderDetailScreen}
            options={{
              headerShown: true,
              headerTitle: 'Order Details',
              headerStyle: { backgroundColor: Colors.primary },
              headerTintColor: Colors.white,
              headerTitleStyle: { fontWeight: '700' },
            }}
          />
        </Stack.Group>
      ) : (
        // Public / Client Stack — Product-First Launch for all users
        <Stack.Group>
          <Stack.Screen name="ClientRoot" component={ClientTabs} />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{
              headerShown: true,
              headerTitle: 'Product Details',
              headerStyle: { backgroundColor: Colors.primary },
              headerTintColor: Colors.white,
              headerTitleStyle: { fontWeight: '700' },
            }}
          />
          <Stack.Screen
            name="Checkout"
            component={CheckoutScreen}
            options={{
              headerShown: true,
              headerTitle: 'Checkout & Delivery',
              headerStyle: { backgroundColor: Colors.primary },
              headerTintColor: Colors.white,
              headerTitleStyle: { fontWeight: '700' },
            }}
          />
          <Stack.Screen
            name="OrderDetail"
            component={OrderDetailScreen}
            options={{
              headerShown: true,
              headerTitle: 'Track Order',
              headerStyle: { backgroundColor: Colors.primary },
              headerTintColor: Colors.white,
              headerTitleStyle: { fontWeight: '700' },
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: true,
              headerTitle: 'Sign In',
              headerStyle: { backgroundColor: Colors.primary },
              headerTintColor: Colors.white,
              headerTitleStyle: { fontWeight: '700' },
            }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              headerShown: true,
              headerTitle: 'Create Account',
              headerStyle: { backgroundColor: Colors.primary },
              headerTintColor: Colors.white,
              headerTitleStyle: { fontWeight: '700' },
            }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
