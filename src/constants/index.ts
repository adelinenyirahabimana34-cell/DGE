// API base URL — change to your computer's local IP when testing on a physical device
// For Android emulator use: http://10.0.2.2:5000/api
// For iOS simulator use: http://localhost:5000/api
// For physical device: http://<YOUR_LAN_IP>:5000/api
export const API_BASE_URL = 'http://10.0.2.2:5000/api';

// App-wide color palette — D&G brand: dark green, white, light grey
export const Colors = {
  primary: '#1A5C38',       // Dark green (brand primary)
  primaryDark: '#0F3D24',   // Deeper green for headers/pressed
  primaryLight: '#2E8B57',  // Medium green for accents
  accent: '#F4A026',        // Warm amber accent
  white: '#FFFFFF',
  background: '#F7F8FA',    // Off-white background
  surface: '#FFFFFF',       // Card/surface white
  border: '#E0E5EC',        // Light grey border
  textPrimary: '#1A1A2E',   // Near-black text
  textSecondary: '#6B7280', // Medium grey secondary text
  textLight: '#9CA3AF',     // Light grey placeholder text
  danger: '#DC2626',        // Error red
  success: '#16A34A',       // Success green
  warning: '#D97706',       // Warning amber

  // Order status colors
  statusPending: '#F59E0B',
  statusConfirmed: '#3B82F6',
  statusShipped: '#8B5CF6',
  statusDelivered: '#16A34A',
  statusCancelled: '#DC2626',
};

// RWF currency formatter
export function formatRWF(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `RWF ${num.toLocaleString('en-RW', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// Order status display config
export const ORDER_STATUS_COLORS: Record<string, string> = {
  Pending: Colors.statusPending,
  Confirmed: Colors.statusConfirmed,
  Shipped: Colors.statusShipped,
  Delivered: Colors.statusDelivered,
  Cancelled: Colors.statusCancelled,
};
