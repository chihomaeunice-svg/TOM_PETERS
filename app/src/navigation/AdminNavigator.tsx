import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AdminDashboard } from '../screens/admin/AdminDashboard';
import { SellersManagement } from '../screens/admin/SellersManagement';
import { SubscriptionsScreen } from '../screens/admin/SubscriptionsScreen';
import { Colors } from '../theme';
import { sharedTabBarStyles } from '../styles/navigationStyles';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
  </Stack.Navigator>
);

const SellersStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SellersManagement" component={SellersManagement} />
  </Stack.Navigator>
);

const SubscriptionsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SubscriptionsAdmin" component={SubscriptionsScreen} />
  </Stack.Navigator>
);

export const AdminNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: Colors.gold,
      tabBarInactiveTintColor: Colors.muted,
      tabBarLabelStyle: styles.tabLabel,
      tabBarIcon: ({ focused, color }) => {
        const icons: Record<string, { active: any; inactive: any }> = {
          AdminDashTab: { active: 'grid', inactive: 'grid-outline' },
          SellersTab: { active: 'people', inactive: 'people-outline' },
          SubscriptionsTab: { active: 'card', inactive: 'card-outline' },
        };
        const iconSet = icons[route.name];
        return <Ionicons name={focused ? iconSet.active : iconSet.inactive} size={22} color={color} />;
      },
    })}
  >
    <Tab.Screen name="AdminDashTab" component={DashboardStack} options={{ title: 'Overview' }} />
    <Tab.Screen name="SellersTab" component={SellersStack} options={{ title: 'Sellers' }} />
    <Tab.Screen name="SubscriptionsTab" component={SubscriptionsStack} options={{ title: 'Plans' }} />
  </Tab.Navigator>
);

const styles = sharedTabBarStyles;
