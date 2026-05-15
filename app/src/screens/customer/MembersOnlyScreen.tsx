import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any, 'MembersOnly'>;

const PERKS = [
  { icon: 'flash-outline', title: 'Early Access', desc: '24hr early access to every new drop' },
  { icon: 'pricetag-outline', title: 'Member Pricing', desc: 'Exclusive discounts on all products' },
  { icon: 'cube-outline', title: 'Secret Drops', desc: 'Products never listed publicly' },
  { icon: 'people-outline', title: 'Private Community', desc: 'Inner circle events & previews' },
];

const PLANS = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: '$19',
    period: '/mo',
    savings: null,
    popular: false,
  },
  {
    id: 'yearly',
    label: 'Annual',
    price: '$149',
    period: '/yr',
    savings: 'Save $79',
    popular: true,
  },
];

export const MembersOnlyScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const isMember = profile?.isMember;

  const handleJoin = () => {
    Alert.alert(
      'Join Members Club',
      `You selected the ${selectedPlan === 'yearly' ? 'Annual ($149/yr)' : 'Monthly ($19/mo)'} plan. Payment integration coming soon.`,
      [{ text: 'Got it' }]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} bounces>
        {/* Hero */}
        <LinearGradient
          colors={['#1C1C1E', '#2A1F0F', '#C9A96E']}
          locations={[0, 0.6, 1]}
          style={styles.hero}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.cream} />
          </TouchableOpacity>

          <View style={styles.crownWrap}>
            <View style={styles.crownCircle}>
              <Ionicons name="diamond-outline" size={36} color={Colors.gold} />
            </View>
          </View>
          <Text style={styles.heroLabel}>EXCLUSIVE</Text>
          <Text style={styles.heroTitle}>Members Only</Text>
          <Text style={styles.heroSub}>
            Not everyone gets in.{'\n'}Join the inner circle.
          </Text>
        </LinearGradient>

        <View style={styles.content}>
          {isMember ? (
            /* Active member view */
            <View style={styles.memberCard}>
              <LinearGradient
                colors={[Colors.gold, Colors.goldDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.memberCardGrad}
              >
                <View style={styles.memberCardRow}>
                  <View>
                    <Text style={styles.memberCardLabel}>TOM PETERS MEMBER</Text>
                    <Text style={styles.memberCardName}>{profile?.displayName}</Text>
                  </View>
                  <Ionicons name="diamond" size={32} color="rgba(255,255,255,0.4)" />
                </View>
                <Text style={styles.memberCardSince}>
                  Member since {profile?.memberSince?.toDate?.()?.getFullYear() || '2024'}
                </Text>
              </LinearGradient>
            </View>
          ) : (
            /* Non-member: upgrade prompt */
            <>
              {/* Perks */}
              <Text style={styles.sectionTitle}>What You Unlock</Text>
              <View style={styles.perksGrid}>
                {PERKS.map(p => (
                  <View key={p.title} style={styles.perkCard}>
                    <View style={styles.perkIcon}>
                      <Ionicons name={p.icon as any} size={22} color={Colors.gold} />
                    </View>
                    <Text style={styles.perkTitle}>{p.title}</Text>
                    <Text style={styles.perkDesc}>{p.desc}</Text>
                  </View>
                ))}
              </View>

              {/* Plans */}
              <Text style={styles.sectionTitle}>Choose Your Plan</Text>
              <View style={styles.plansRow}>
                {PLANS.map(plan => (
                  <TouchableOpacity
                    key={plan.id}
                    style={[
                      styles.planCard,
                      selectedPlan === plan.id && styles.planCardSelected,
                      plan.popular && styles.planCardPopular,
                    ]}
                    onPress={() => setSelectedPlan(plan.id)}
                    activeOpacity={0.85}
                  >
                    {plan.popular && (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularBadgeText}>BEST VALUE</Text>
                      </View>
                    )}
                    <Text style={[styles.planLabel, selectedPlan === plan.id && styles.planLabelSelected]}>
                      {plan.label}
                    </Text>
                    <View style={styles.planPriceRow}>
                      <Text style={[styles.planPrice, selectedPlan === plan.id && styles.planPriceSelected]}>
                        {plan.price}
                      </Text>
                      <Text style={[styles.planPeriod, selectedPlan === plan.id && styles.planPeriodSelected]}>
                        {plan.period}
                      </Text>
                    </View>
                    {plan.savings && (
                      <Text style={styles.planSavings}>{plan.savings}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <Button
                label="JOIN THE CIRCLE"
                onPress={handleJoin}
                variant="gold"
                fullWidth
                size="lg"
                style={styles.joinBtn}
              />

              <Text style={styles.disclaimer}>
                Cancel anytime. No hidden fees. Exclusive access guaranteed.
              </Text>
            </>
          )}

          {/* Locked content preview */}
          <Text style={styles.sectionTitle}>
            {isMember ? 'Member Exclusives' : 'Preview (Members Only)'}
          </Text>
          <View style={styles.lockedGrid}>
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={styles.lockedCard}>
                <View style={styles.lockedImage} />
                {!isMember && (
                  <BlurView intensity={80} style={StyleSheet.absoluteFill}>
                    <View style={styles.lockedOverlay}>
                      <Ionicons name="lock-closed" size={20} color={Colors.white} />
                    </View>
                  </BlurView>
                )}
                <View style={styles.lockedInfo}>
                  <Text style={styles.lockedName}>
                    {isMember ? `Exclusive Piece #${i}` : '•••••••'}
                  </Text>
                  <Text style={styles.lockedPrice}>
                    {isMember ? '$120.00' : '???'}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={{ height: 60 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  hero: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.md,
    padding: Spacing.xs,
  },
  crownWrap: { marginTop: Spacing.xl, marginBottom: Spacing.lg },
  crownCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(201,169,110,0.15)',
    borderWidth: 1,
    borderColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLabel: {
    ...Typography.labelMD,
    color: Colors.tan,
    letterSpacing: 4,
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    fontFamily: 'serif',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: Colors.cream,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  heroSub: {
    ...Typography.bodyMD,
    color: Colors.tan,
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    padding: Spacing.lg,
  },
  memberCard: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
    ...Shadow.gold,
  },
  memberCardGrad: {
    padding: Spacing.xl,
  },
  memberCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  memberCardLabel: {
    ...Typography.labelMD,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 9,
    letterSpacing: 2,
    marginBottom: 4,
  },
  memberCardName: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
  },
  memberCardSince: {
    ...Typography.bodySM,
    color: 'rgba(255,255,255,0.6)',
  },
  sectionTitle: {
    ...Typography.displayMD,
    fontSize: 18,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  perksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  perkCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  perkIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    backgroundColor: Colors.silk,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  perkTitle: {
    ...Typography.labelLG,
    fontSize: 12,
    marginBottom: 4,
  },
  perkDesc: {
    ...Typography.bodySM,
    color: Colors.taupe,
    lineHeight: 17,
  },
  plansRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  planCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    ...Shadow.sm,
    overflow: 'hidden',
  },
  planCardSelected: {
    borderColor: Colors.charcoal,
    backgroundColor: Colors.charcoal,
  },
  planCardPopular: {
    borderColor: Colors.gold,
  },
  popularBadge: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginBottom: Spacing.sm,
  },
  popularBadgeText: {
    ...Typography.labelMD,
    color: Colors.white,
    fontSize: 8,
    letterSpacing: 1.5,
  },
  planLabel: {
    ...Typography.labelMD,
    marginBottom: 4,
    color: Colors.taupe,
  },
  planLabelSelected: { color: Colors.tan },
  planPriceRow: { flexDirection: 'row', alignItems: 'flex-end' },
  planPrice: {
    fontFamily: 'serif',
    fontSize: 32,
    fontWeight: '800',
    color: Colors.charcoal,
  },
  planPriceSelected: { color: Colors.white },
  planPeriod: {
    ...Typography.bodyMD,
    color: Colors.taupe,
    marginBottom: 6,
  },
  planPeriodSelected: { color: Colors.tan },
  planSavings: {
    ...Typography.bodySM,
    color: Colors.success,
    fontWeight: '600',
    marginTop: 4,
  },
  joinBtn: { marginBottom: Spacing.md },
  disclaimer: {
    ...Typography.bodySM,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.xl,
  },
  lockedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  lockedCard: {
    width: '48%',
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  lockedImage: {
    height: 140,
    backgroundColor: Colors.beige,
  },
  lockedOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedInfo: {
    padding: Spacing.sm,
  },
  lockedName: {
    ...Typography.bodyMD,
    fontWeight: '600',
    color: Colors.charcoal,
    marginBottom: 2,
  },
  lockedPrice: {
    ...Typography.bodySM,
    color: Colors.taupe,
  },
});
