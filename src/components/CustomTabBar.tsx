import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Motorbike } from '../assets/svg';
import { appColor } from '../constants/appColor';

const labels: Record<string, string> = {
  Activity: 'Hoạt động',
  Notification: 'Thông báo',
  Service: 'Dịch vụ',
  Setting: 'Cài đặt',
  Home: '',
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottom = (insets?.bottom ?? 0) + 6;

  // If the focused screen requests the tab bar hidden via tabBarStyle.display = 'none', don't render
  const focusedRoute = state.routes[state.index];
  const focusedOptions = descriptors[focusedRoute.key]?.options || {};
  if (focusedOptions.tabBarStyle && (focusedOptions.tabBarStyle as any).display === 'none') {
    return null;
  }

  const handlePress = (routeName: string, index: number) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes[index].key,
      canPreventDefault: true,
    });
    if (!event.defaultPrevented) {
      navigation.navigate(routeName as never);
    }
  };

  const renderIcon = (name: string, focused: boolean) => {
    const color = focused ? appColor.primary : appColor.gray2;
    const size = 22;
    switch (name) {
      case 'Home':
        return (
          <View style={[styles.homeBubble, focused ? styles.homeBubbleActive : null]}>
            <Motorbike width={34} height={36} />
          </View>
        );
      case 'Notification':
        return <MaterialCommunityIcons name="message-text-outline" size={size} color={color} />;
      case 'Service':
        return <MaterialIcons name="miscellaneous-services" size={size} color={color} />;
      case 'Setting':
        return <Ionicons name="settings-outline" size={size} color={color} />;
      case 'Activity':
        return <MaterialCommunityIcons name="chart-timeline-variant" size={size} color={color} />;
      default:
        return <View />;
    }
  };

  return (
    <View style={[styles.container, { bottom }] } pointerEvents="box-none">
      <View style={styles.back} />
      <View style={[styles.row]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const routeLabel = labels[route.name] ?? route.name;
          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              key={route.key}
              onPress={() => handlePress(route.name, index)}
              activeOpacity={0.8}
              style={styles.tabItem}
            >
              <View style={styles.iconWrap}>{renderIcon(route.name, focused)}</View>
              {route.name !== 'Home' ? (
                <Text style={[styles.label, { color: focused ? appColor.primary : appColor.gray2 }]}>
                  {routeLabel}
                </Text>
              ) : (
                // reserve label space to keep alignment
                <View style={{ height: Platform.OS === 'ios' ? 20 : 18 }} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    // bottom is set dynamically
    alignItems: 'center',
    zIndex: 20,
  },
  back: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 68,
    borderRadius: 16,
    backgroundColor: appColor.white,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 12 },
      android: { elevation: 6 },
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    height: 68,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
  homeBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: appColor.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? -18 : -20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 12 },
      android: { elevation: 6 },
    }),
  },
  homeBubbleActive: {
    backgroundColor: appColor.primary,
  },
});
