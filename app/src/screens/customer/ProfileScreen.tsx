import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { logoutUser } from '../../services/auth';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';

const MENU_ITEMS = [
  { icon: 'bag-outline', label: 'My Orders', screen: 'Orders' },
  { icon: 'heart-outline', label: 'Wishlist', screen: 'Wishlist' },
  { icon: 'diamond-outline', label: 'Members Club', screen: 'MembersOnly' },
  { icon: 'location-outline', label: 'Saved Addresses', screen: 'Addresses' },
  { icon: 'notifications-outline', label: 'Notifications', screen: 'Notifications' },
  { icon: 'shield-outline', label: 'Privacy & Security', screen: 'Privacy' },
  { icon: 'help-circle-outline', label: 'Help & Support', screen: 'Help' },
];

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logoutUser() },
    ]);
  };

  const initials = profile?.displayName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'TP';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero header */}
        <LinearGradient
          colors={['#1C1C1E', '#2A1F0F']}
          style={styles.hero}
        >
          <View style={styles.avatarWrap}>
            <LinearGradient
              colors={[Colors.tan, Colors.gold]}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{initials}</Text>
            </LinearGradient>
            {profile?.isMember && (
              <View style={styles.memberBadge}>
                <Ionicons name="diamond" size={10} color={Colors.white} />
              </View>
            )}
          </View>
          <Text style={styles.name}>{profile?.displayName}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
          {profile?.isMember && (
            <View style={styles.memberChip}>
              <Text style={styles.memberChipText}>MEMBER</Text>
            </View>
          )}
        </LinearGradient>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Orders', value: '0' },
            { label: 'Wishlist', value: '0' },
            { label: 'Member Since', value: '2024' },
          ].map(s => (
            <View key={s.label} style={styles.stat}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, i < MENU_ITEMS.length - 1 && styles.menuDivider]}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconWrap}>
                <Ionicons name={item.icon as any} size={20} color={Colors.gold} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.muted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.logoutSection}>
          <Button
            label="SIGN OUT"
            onPress={handleLogout}
            variant="ghost"
            fullWidth
          />
          <Text style={styles.version}>TOM PETERS v1.0.0</Text>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  hero: {
    alignItems: 'center',
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.xl,
  },
  avatarWrap: { position: 'relative', marginBottom: Spacing.md },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
  },
  memberBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.charcoal,
  },
  name: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.cream,
    marginBottom: 4,
  },
  email: {
    ...Typography.bodySM,
    color: Colors.taupe,
    marginBottom: Spacing.sm,
  },
  memberChip: {
    backgroundColor: Colors.gold + '30',
    borderWidth: 1,
    borderColor: Colors.gold,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  memberChipText: {
    ...Typography.labelMD,
    color: Colors.gold,
    fontSize: 9,
    letterSpacing: 2,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginTop: -Spacing.lg,
    borderRadius: Radius.md,
    ...Shadow.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  statValue: {
    ...Typography.displayMD,
    fontSize: 20,
    color: Colors.charcoal,
    marginBottom: 2,
  },
  statLabel: {
    ...Typography.labelMD,
    fontSize: 9,
    color: Colors.taupe,
  },
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  menuDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.silk,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  menuLabel: {
    ...Typography.bodyMD,
    color: Colors.charcoal,
    flex: 1,
    fontWeight: '500',
  },
  logoutSection: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  version: {
    ...Typography.bodySM,
    color: Colors.muted,
    marginTop: Spacing.lg,
    letterSpacing: 1,
  },
});
