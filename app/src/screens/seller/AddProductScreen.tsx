import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { addProduct } from '../../services/firestore';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';

const CATEGORIES = ['Tops', 'Bottoms', 'Outerwear', 'Accessories', 'Footwear'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const AddProductScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [isLimitedDrop, setIsLimitedDrop] = useState(false);
  const [sizes, setSizes] = useState<Record<string, string>>({});

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.85,
      aspect: [3, 4],
    });
    if (!result.canceled) {
      const uris = result.assets.map(a => a.uri);
      setImages(prev => [...prev, ...uris].slice(0, 5));
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !price || !category) {
      Alert.alert('Missing Fields', 'Please fill in name, price, and category.');
      return;
    }
    if (!profile) return;
    setLoading(true);
    try {
      const sizesQty: Record<string, number> = {};
      Object.entries(sizes).forEach(([k, v]) => {
        sizesQty[k] = parseInt(v) || 0;
      });

      await addProduct({
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        images,
        category,
        sizes: sizesQty,
        sellerId: profile.uid,
        sellerName: profile.businessName || profile.displayName,
        isLimitedDrop,
        isActive: true,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });

      Alert.alert('Product Added', 'Your product has been published successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to add product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ADD PRODUCT</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Images */}
          <Text style={styles.sectionLabel}>PRODUCT IMAGES</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            <TouchableOpacity style={styles.addImageBtn} onPress={pickImage}>
              <Ionicons name="camera-outline" size={28} color={Colors.gold} />
              <Text style={styles.addImageText}>Add Photos</Text>
            </TouchableOpacity>
            {images.map((img, i) => (
              <View key={i} style={styles.imageThumb}>
                <Image source={{ uri: img }} style={styles.thumbImg} resizeMode="cover" />
                <TouchableOpacity
                  style={styles.removeImg}
                  onPress={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                >
                  <Ionicons name="close-circle" size={20} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Basic Info */}
          <Input label="Product Name *" value={name} onChangeText={setName}
            placeholder="e.g. TP Signature Tee" leftIcon="cube-outline" />
          <Input label="Description" value={description} onChangeText={setDescription}
            placeholder="Describe the fit, material, and feel..." multiline numberOfLines={4}
            style={styles.textarea} />
          <Input label="Price (USD) *" value={price} onChangeText={setPrice}
            keyboardType="decimal-pad" placeholder="0.00" leftIcon="pricetag-outline" />

          {/* Category */}
          <Text style={styles.sectionLabel}>CATEGORY *</Text>
          <View style={styles.chipsRow}>
            {CATEGORIES.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.chip, category === c && styles.chipActive]}
                onPress={() => setCategory(c)}
              >
                <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sizes & Stock */}
          <Text style={styles.sectionLabel}>SIZES & STOCK QUANTITY</Text>
          <View style={styles.sizesGrid}>
            {SIZES.map(size => (
              <View key={size} style={styles.sizeInput}>
                <Text style={styles.sizeLabel}>{size}</Text>
                <Input
                  value={sizes[size] || ''}
                  onChangeText={v => setSizes(s => ({ ...s, [size]: v }))}
                  keyboardType="numeric"
                  placeholder="0"
                  containerStyle={styles.sizeField}
                />
              </View>
            ))}
          </View>

          {/* Tags */}
          <Input label="Tags (comma separated)" value={tags} onChangeText={setTags}
            placeholder="streetwear, premium, casual" leftIcon="pricetags-outline" />

          {/* Limited Drop Toggle */}
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Limited Drop</Text>
              <Text style={styles.toggleSub}>Mark as an exclusive limited edition product</Text>
            </View>
            <Switch
              value={isLimitedDrop}
              onValueChange={setIsLimitedDrop}
              trackColor={{ true: Colors.gold, false: Colors.border }}
              thumbColor={Colors.white}
            />
          </View>

          <Button
            label="PUBLISH PRODUCT"
            onPress={handleSubmit}
            loading={loading}
            variant="gold"
            fullWidth
            size="lg"
            style={styles.submitBtn}
          />

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { padding: Spacing.xs },
  headerTitle: { ...Typography.labelLG, letterSpacing: 3, color: Colors.charcoal },
  scroll: { padding: Spacing.lg },
  sectionLabel: {
    ...Typography.labelMD,
    color: Colors.taupe,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  imageScroll: { marginBottom: Spacing.md },
  addImageBtn: {
    width: 100,
    height: 120,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    borderStyle: 'dashed',
    backgroundColor: Colors.silk,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginRight: Spacing.sm,
  },
  addImageText: { ...Typography.labelMD, color: Colors.gold, fontSize: 9 },
  imageThumb: {
    width: 100,
    height: 120,
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginRight: Spacing.sm,
    position: 'relative',
  },
  thumbImg: { width: '100%', height: '100%' },
  removeImg: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  textarea: { height: 100, paddingTop: Spacing.sm },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipActive: {
    backgroundColor: Colors.charcoal,
    borderColor: Colors.charcoal,
  },
  chipText: { ...Typography.labelMD, fontSize: 10, color: Colors.charcoal },
  chipTextActive: { color: Colors.white },
  sizesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sizeInput: {
    width: '30%',
    alignItems: 'center',
  },
  sizeLabel: { ...Typography.labelLG, fontSize: 12, marginBottom: 4 },
  sizeField: { marginBottom: 0 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleLabel: { ...Typography.bodyMD, fontWeight: '600', color: Colors.charcoal },
  toggleSub: { ...Typography.bodySM, color: Colors.taupe, marginTop: 2 },
  submitBtn: { marginTop: Spacing.sm },
});
