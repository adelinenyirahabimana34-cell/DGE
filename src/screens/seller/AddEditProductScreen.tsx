import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { productService } from '../../services/productService';
import { Product, Category } from '../../types';
import { Colors } from '../../constants';
import Input from '../../components/Input';
import Button from '../../components/Button';
import LoadingView from '../../components/LoadingView';

type Props = NativeStackScreenProps<any, 'AddProduct'>;

export default function AddEditProductScreen({ route, navigation }: Props) {
  const existingProduct: Product | undefined = route.params?.product;
  const isEditing = Boolean(existingProduct);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState(existingProduct?.title || '');
  const [description, setDescription] = useState(existingProduct?.description || '');
  const [price, setPrice] = useState(existingProduct ? String(existingProduct.price) : '');
  const [stock, setStock] = useState(existingProduct ? String(existingProduct.stock) : '');
  const [categoryId, setCategoryId] = useState<number | null>(existingProduct?.category_id || null);
  const [imageUrl, setImageUrl] = useState(existingProduct?.image_url || '');

  // Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await productService.getCategories();
        setCategories(cats);
        if (!isEditing && cats.length > 0 && !categoryId) {
          setCategoryId(cats[0].id);
        }
      } catch (err: any) {
        Alert.alert('Error', 'Failed to load product categories');
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, [isEditing]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      errs.price = 'Please enter a valid price in RWF';
    }
    if (!stock.trim() || isNaN(Number(stock)) || Number(stock) < 0) {
      errs.stock = 'Please enter a valid stock quantity (0 or more)';
    }
    if (!categoryId) {
      errs.category = 'Please select a category';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload: Partial<Product> = {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        stock: parseInt(stock, 10),
        category_id: categoryId!,
        image_url:
          imageUrl.trim() ||
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=60',
      };

      if (isEditing && existingProduct) {
        await productService.update(existingProduct.id, payload);
        Alert.alert('Success', 'Product updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await productService.create(payload);
        Alert.alert('Success', 'Product created successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingView message="Loading form..." />;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.screenTitle}>{isEditing ? 'Edit Product' : 'Add New Product'}</Text>
        <Text style={styles.screenSub}>
          {isEditing
            ? 'Update the product details below.'
            : 'Fill in the information to list a new product in your store.'}
        </Text>

        <View style={styles.formCard}>
          <Input
            label="Product Title *"
            placeholder="e.g. Inyange Milk 500ml"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
          />

          <Input
            label="Description"
            placeholder="Detailed description of the product"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Input
                label="Price (RWF) *"
                placeholder="e.g. 1200"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                error={errors.price}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Input
                label="Stock Quantity *"
                placeholder="e.g. 50"
                value={stock}
                onChangeText={setStock}
                keyboardType="numeric"
                error={errors.stock}
              />
            </View>
          </View>

          {/* Category selection */}
          <View style={styles.categorySection}>
            <Text style={styles.fieldLabel}>Category *</Text>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            <View style={styles.categoryPills}>
              {categories.map(c => {
                const isSelected = categoryId === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.catPill, isSelected && styles.catPillSelected]}
                    onPress={() => setCategoryId(c.id)}
                  >
                    <Text style={[styles.catPillText, isSelected && styles.catPillTextSelected]}>
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <Input
            label="Image URL"
            placeholder="https://... (leave empty for default)"
            value={imageUrl}
            onChangeText={setImageUrl}
          />

          {imageUrl ? (
            <View style={styles.previewContainer}>
              <Text style={styles.previewLabel}>Image Preview:</Text>
              <Image source={{ uri: imageUrl }} style={styles.previewImage} resizeMode="cover" />
            </View>
          ) : null}

          <Button
            title={isEditing ? 'Save Changes' : 'Create Product'}
            onPress={handleSubmit}
            loading={submitting}
            style={{ marginTop: 12 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16, paddingBottom: 36 },
  screenTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  screenSub: { fontSize: 13, color: Colors.textSecondary, marginBottom: 16 },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  categorySection: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginBottom: 6,
  },
  categoryPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  catPillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  catPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  catPillTextSelected: {
    color: Colors.white,
  },
  previewContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    backgroundColor: Colors.border,
  },
});
