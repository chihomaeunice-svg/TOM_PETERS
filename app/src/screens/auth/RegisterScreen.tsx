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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { registerCustomer } from '../../services/auth';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof typeof form) => (val: string) =>
    setForm(f => ({ ...f, [key]: val }));

  const handleRegister = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await registerCustomer(form.email.trim().toLowerCase(), form.password, form.name.trim());
    } catch (e: any) {
      setError(e.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={[Colors.cream, Colors.silk, Colors.beige]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={Colors.charcoal} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Join the inner circle.</Text>
            <Text style={styles.subtitle}>Create your TOM PETERS account</Text>
          </View>

          <View style={styles.card}>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Input
              label="Full Name"
              value={form.name}
              onChangeText={set('name')}
              autoCapitalize="words"
              leftIcon="person-outline"
              placeholder="Your name"
            />
            <Input
              label="Email Address"
              value={form.email}
              onChangeText={set('email')}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              value={form.password}
              onChangeText={set('password')}
              isPassword
              leftIcon="lock-closed-outline"
              placeholder="Min. 6 characters"
            />
            <Input
              label="Confirm Password"
              value={form.confirm}
              onChangeText={set('confirm')}
              isPassword
              leftIcon="lock-closed-outline"
              placeholder="Repeat your password"
            />

            <Button
              label="CREATE ACCOUNT"
              onPress={handleRegister}
              loading={loading}
              variant="gold"
              fullWidth
              style={styles.btn}
            />

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginLinkText}>
                Already a member?{' '}
                <Text style={styles.loginLinkAccent}>Sign In</Text>
              </Text>
            </TouchableOpacity>

            <Text style={styles.terms}>
              By creating an account you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
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
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.displayLG,
    marginBottom: 6,
  },
  subtitle: {
    ...Typography.bodyMD,
    color: Colors.taupe,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
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
  btn: { marginTop: Spacing.sm },
  loginLink: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  loginLinkText: {
    ...Typography.bodyMD,
    color: Colors.taupe,
  },
  loginLinkAccent: {
    color: Colors.gold,
    fontWeight: '600',
  },
  terms: {
    ...Typography.bodySM,
    color: Colors.muted,
    textAlign: 'center',
    marginTop: Spacing.lg,
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.gold,
  },
});
