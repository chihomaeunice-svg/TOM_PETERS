import { StyleSheet } from 'react-native';
import { Colors, Typography } from '../theme';

export const sharedTabBarStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 10,
  },
  tabLabel: {
    ...Typography.labelMD,
    fontSize: 9,
    letterSpacing: 1,
  },
});
