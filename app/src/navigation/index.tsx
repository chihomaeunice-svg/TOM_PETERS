import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { SellerInquiryScreen } from '../screens/auth/SellerInquiryScreen';
import { CustomerNavigator } from './CustomerNavigator';
import { SellerNavigator } from './SellerNavigator';
import { AdminNavigator } from './AdminNavigator';
import { LoadingScreen } from '../components/common/LoadingScreen';
import { useAuth } from '../hooks/useAuth';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  const getMainApp = () => {
    if (!profile) return null;
    switch (profile.role) {
      case 'admin': return <Stack.Screen name="AdminApp" component={AdminNavigator} />;
      case 'seller': return <Stack.Screen name="SellerApp" component={SellerNavigator} />;
      default: return <Stack.Screen name="CustomerApp" component={CustomerNavigator} />;
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {!user || !profile ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="SellerInquiry" component={SellerInquiryScreen} />
          </>
        ) : (
          getMainApp()
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
