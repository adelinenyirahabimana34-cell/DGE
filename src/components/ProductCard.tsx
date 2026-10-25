import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../types';
import { Colors, formatRWF } from '../constants';

interface Props {
  product: Product;
  onPress: () => void;
  style?: any;
}

export default function ProductCard({ product, onPress, style }: Props) {
  const imageUri =
    product.image_url ||
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=60';

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.88}>
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      <View style={styles.body}>
        <Text style={styles.category} numberOfLines={1}>
          {product.category_name || 'General'}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{formatRWF(product.price)}</Text>
          <Text style={[styles.stock, product.stock === 0 && styles.outOfStock]} numberOfLines={1}>
            {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 135,
    backgroundColor: Colors.border,
  },
  body: {
    padding: 10,
  },
  category: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
    lineHeight: 18,
    minHeight: 36,
  },
  footer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.primary,
  },
  stock: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.success,
  },
  outOfStock: {
    color: Colors.danger,
  },
});
