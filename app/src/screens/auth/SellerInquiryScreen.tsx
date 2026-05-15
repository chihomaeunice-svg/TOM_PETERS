import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { submitSellerInquiry } from '../../services/auth';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'SellerInquiry'>;

const BUSINESS_TYPES = ['Clothing Brand', 'Boutique', 'Designer', 'Manufacturer', 'Other'];

export const SellerInquiryScreen: React.FC<Props> = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const set = (key: keyof typeof form) => (val: string) =>
    setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.businessName.trim() || !selectedType) {
      setError('Please complete all required fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await submitSellerInquiry({ ...form, businessType: selectedType });
      Alert.alert(
        'Application Received',
        'Thank you for your interest. Our team will review your application and reach out within 2-3 business days.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (e: any) {
      setError(e.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1C1C1E', '#2C2416']}
        style={styles.heroGrad}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={Colors.cream} />
          </TouchableOpacity>

          {/* Hero */}
          <View style={styles.hero}>
            <Text style={styles.heroLabel}>SELLER ACCESS</Text>
            <Text style={styles.heroTitle}>
              Sell with{'\n'}TOM PETERS.
            </Text>
            <Text style={styles.heroSubtitle}>
              Join an exclusive network of premium brands. Complete the form below — our team reviews every application personally.
            </Text>
          </View>

          {/* Perks */}
          <View style={styles.perksRow}>
            {[
              { icon: 'storefront-outline', text: 'Your own seller profile' },
              { icon: 'analytics-outline', text: 'Sales analytics & insights' },
              { icon: 'shield-checkmark-outline', text: 'Verified seller badge' },
            ].map(p => (
              <View key={p.icon} style={styles.perk}>
                <Ionicons name={p.icon as any} size={20} color={Colors.gold} />
                <Text style={styles.perkText}>{p.text}</Text>
              </View>
            ))}
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.formTitle}>Your Application</Text>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Input label="Full Name *" value={form.name} onChangeText={set('name')}
              autoCapitalize="words" leftIcon="person-outline" placeholder="Your full name" />
            <Input label="Email Address *" value={form.email} onChangeText={set('email')}
              keyboardType="email-address" autoCapitalize="none" leftIcon="mail-outline"
              placeholder="Business email" />
            <Input label="Phone Number" value={form.phone} onChangeText={set('phone')}
              keyboardType="phone-pad" leftIcon="call-outline" placeholder="+1 (000) 000-0000" />
            <Input label="Business Name *" value={form.businessName} onChangeText={set('businessName')}
              autoCapitalize="words" leftIcon="business-outline" placeholder="Your brand name" />

            <Text style={styles.typeLabel}>BUSINESS TYPE *</Text>
            <View style={styles.typesGrid}>
              {BUSINESS_TYPES.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeChip, selectedType === t && styles.typeChipSelected]}
                  onPress={() => setSelectedType(t)}
                >
                  <Text style={[styles.typeChipText, selectedType === t && styles.typeChipTextSelected]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label="Tell us about your brand"
              value={form.description}
              onChangeText={set('description')}
              multiline
              numberOfLines={4}
              placeholder="Describe your brand, products, target market, and why you want to partner with TOM PETERS..."
              style={styles.textarea}
            />

            <Button
              label="SUBMIT APPLICATION"
              onPress={handleSubmit}
              loading={loading}
              variant="gold"
              fullWidth
              style={styles.btn}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.charcoal },
  heroGrad: {
    ...StyleSheet.absoluteFillObject,
    height: 380,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  back: {
    paddingTop: 56,
    paddingBottom: Spacing.md,
    alignSelf: 'flex-start',
  },
  hero: {
    paddingBottom: Spacing.xl,
  },
  heroLabel: {
    ...Typography.labelMD,
    color: Colors.gold,
    marginBottom: Spacing.sm,
    letterSpacing: 4,
  },
  heroTitle: {
    fontFamily: 'serif',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 46,
    color: Colors.cream,
    marginBottom: Spacing.md,
  },
  heroSubtitle: {
    ...Typography.bodyMD,
    color: Colors.tan,
    lineHeight: 22,
  },
  perksRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  perk: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  perkText: {
    ...Typography.bodySM,
    color: Colors.tan,
    textAlign: 'center',
    lineHeight: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 8,
  },
  formTitle: {
    ...Typography.displayMD,
    marginBottom: Spacing.lg,
  },
  errorBox: {
    backgroundColor: '#FDECEA',
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
  },
  errorText: {
    ...Typography.bodySM,
    color: Colors.error,
  },
  typeLabel: {
    ...Typography.labelMD,
    color: Colors.taupe,
    marginBottom: Spacing.sm,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  typeChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.silk,
  },
  typeChipSelected: {
    backgroundColor: Colors.charcoal,
    borderColor: Colors.charcoal,
  },
  typeChipText: {
    ...Typography.bodySM,
    color: Colors.charcoal,
    fontWeight: '500',
  },
  typeChipTextSelected: {
    color: Colors.white,
  },
  textarea: {
    height: 120,
    paddingTop: Spacing.sm,
  },
  btn: { marginTop: Spacing.sm },
});
