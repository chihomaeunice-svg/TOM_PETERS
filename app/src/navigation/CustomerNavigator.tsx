import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sharedTabBarStyles } from '../styles/navigationStyles';
import { HomeScreen } from '../screens/customer/HomeScreen';
import { ShopScreen } from '../screens/customer/ShopScreen';
import { ProductDetailScreen } from '../screens/customer/ProductDetailScreen';
import { CartScreen } from '../screens/customer/CartScreen';
import { CheckoutScreen } from '../screens/customer/CheckoutScreen';
import { LimitedDropsScreen } from '../screens/customer/LimitedDropsScreen';
import { MembersOnlyScreen } from '../screens/customer/MembersOnlyScreen';
import { ProfileScreen } from '../screens/customer/ProfileScreen';
import { useCart } from '../hooks/useCart';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Shop" component={ShopScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="Cart" component={CartScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
    <Stack.Screen name="LimitedDrops" component={LimitedDropsScreen} />
    <Stack.Screen name="MembersOnly" component={MembersOnlyScreen} />
  </Stack.Navigator>
);

const ExploreStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Shop" component={ShopScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="Cart" component={CartScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
  </Stack.Navigator>
);

const DropsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LimitedDrops" component={LimitedDropsScreen} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="Cart" component={CartScreen} />
  </Stack.Navigator>
);

export const CustomerNavigator = () => {
  const { totalItems } = useCart();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.muted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, { active: any; inactive: any }> = {
            HomeTab: { active: 'home', inactive: 'home-outline' },
            ExploreTab: { active: 'grid', inactive: 'grid-outline' },
            DropsTab: { active: 'flash', inactive: 'flash-outline' },
            ProfileTab: { active: 'person', inactive: 'person-outline' },
          };
          const iconSet = icons[route.name];
          return <Ionicons name={focused ? iconSet.active : iconSet.inactive} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="ExploreTab" component={ExploreStack} options={{ title: 'Shop' }} />
      <Tab.Screen
        name="DropsTab"
        component={DropsStack}
        options={{
          title: 'Drops',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? 'flash' : 'flash-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

const styles = sharedTabBarStyles;
