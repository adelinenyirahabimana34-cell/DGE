import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, ORDER_STATUS_COLORS } from '../constants';

interface Props {
  status: string;
  style?: ViewStyle;
}

export default function StatusBadge({ status, style }: Props) {
  const color = ORDER_STATUS_COLORS[status] || Colors.textSecondary;

  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color + '55' }, style]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
