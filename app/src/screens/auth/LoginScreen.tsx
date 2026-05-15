import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { loginUser, resetPassword } from '../../services/auth';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const slideY = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(slideY, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password) { setError('Please fill in all fields.'); return; }
    setError('');
    setLoading(true);
    try {
      await loginUser(email.trim().toLowerCase(), password);
      // Navigation happens via auth state listener in root navigator
    } catch (e: any) {
      setError(e.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) { setError('Enter your email first.'); return; }
    try {
      await resetPassword(email.trim());
      setError('');
      alert('Password reset email sent.');
    } catch {
      setError('Could not send reset email.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={[Colors.cream, Colors.silk, Colors.beige]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.brandMark}>TP</Text>
            <Text style={styles.brandName}>TOM PETERS</Text>
          </View>

          <Animated.View style={[styles.card, { opacity, transform: [{ translateY: slideY }] }]}>
            <Text style={styles.title}>Welcome back.</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              isPassword
              leftIcon="lock-closed-outline"
              placeholder="••••••••"
            />

            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotRow}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              label="SIGN IN"
              onPress={handleLogin}
              loading={loading}
              variant="gold"
              fullWidth
              style={styles.signInBtn}
            />

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              label="CREATE ACCOUNT"
              onPress={() => navigation.navigate('Register')}
              variant="ghost"
              fullWidth
            />

            <TouchableOpacity
              style={styles.sellerLink}
              onPress={() => navigation.navigate('SellerInquiry')}
            >
              <Text style={styles.sellerLinkText}>
                Interested in selling?{' '}
                <Text style={styles.sellerLinkAccent}>Request Access →</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
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
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: Spacing.xxl,
  },
  brandMark: {
    fontFamily: 'serif',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 4,
    color: Colors.charcoal,
    marginBottom: 4,
  },
  brandName: {
    ...Typography.labelLG,
    letterSpacing: 6,
    color: Colors.taupe,
    fontSize: 10,
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
  title: {
    ...Typography.displayMD,
    marginBottom: 6,
  },
  subtitle: {
    ...Typography.bodyMD,
    color: Colors.taupe,
    marginBottom: Spacing.xl,
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
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
    marginTop: -Spacing.xs,
  },
  forgotText: {
    ...Typography.bodySM,
    color: Colors.gold,
    fontWeight: '500',
  },
  signInBtn: {
    marginBottom: Spacing.lg,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    ...Typography.labelMD,
    color: Colors.muted,
    marginHorizontal: Spacing.md,
    fontSize: 10,
  },
  sellerLink: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  sellerLinkText: {
    ...Typography.bodySM,
    color: Colors.taupe,
    textAlign: 'center',
  },
  sellerLinkAccent: {
    color: Colors.gold,
    fontWeight: '600',
  },
});
