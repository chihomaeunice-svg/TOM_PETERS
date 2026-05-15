import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SellerDashboard } from '../screens/seller/SellerDashboard';
import { SellerProductsScreen } from '../screens/seller/SellerProductsScreen';
import { AddProductScreen } from '../screens/seller/AddProductScreen';
import { SellerOrdersScreen } from '../screens/seller/SellerOrdersScreen';
import { Colors } from '../theme';
import { sharedTabBarStyles } from '../styles/navigationStyles';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SellerDashboard" component={SellerDashboard} />
  </Stack.Navigator>
);

const ProductsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SellerProducts" component={SellerProductsScreen} />
    <Stack.Screen name="AddProduct" component={AddProductScreen} />
  </Stack.Navigator>
);

const OrdersStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SellerOrders" component={SellerOrdersScreen} />
  </Stack.Navigator>
);

export const SellerNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: Colors.gold,
      tabBarInactiveTintColor: Colors.muted,
      tabBarLabelStyle: styles.tabLabel,
      tabBarIcon: ({ focused, color }) => {
        const icons: Record<string, { active: any; inactive: any }> = {
          DashboardTab: { active: 'grid', inactive: 'grid-outline' },
          ProductsTab: { active: 'cube', inactive: 'cube-outline' },
          OrdersTab: { active: 'receipt', inactive: 'receipt-outline' },
        };
        const iconSet = icons[route.name];
        return <Ionicons name={focused ? iconSet.active : iconSet.inactive} size={22} color={color} />;
      },
    })}
  >
    <Tab.Screen name="DashboardTab" component={DashboardStack} options={{ title: 'Dashboard' }} />
    <Tab.Screen name="ProductsTab" component={ProductsStack} options={{ title: 'Products' }} />
    <Tab.Screen name="OrdersTab" component={OrdersStack} options={{ title: 'Orders' }} />
  </Tab.Navigator>
);

const styles = sharedTabBarStyles;
