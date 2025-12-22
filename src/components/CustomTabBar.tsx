import React from "react";
import { View, TouchableOpacity, StyleSheet, Text, Dimensions } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import Svg, { Path } from "react-native-svg";
import { appColor } from "../constants/appColor";

const labels: Record<string, string> = {
  Activity: "Hoạt động",
  Notification: "Thông báo",
  Service: "Dịch vụ",
  Setting: "Cài đặt",
  Home: "",
};

const tabRoots: Record<string, { screen: string }> = {
  Service: { screen: "ServiceScreen" },
  Home: { screen: "HomeScreen" },
  Activity: { screen: "ActivityScreen" },
  Notification: { screen: "NotificationScreen" },
  Setting: { screen: "SettingScreen" },
};

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const extraBottom = insets?.bottom ?? 0;
  const screenWidth = Dimensions.get("window").width;
  const barHeight = 70;
  const notchRadius = 26;
  const notchWidth = notchRadius * 2;
  const left = (screenWidth - notchWidth) / 2;
  const notchDepth = 18;
  const pathD = `M0 0 H${left} C${left + notchRadius * 0.35} 0 ${left + notchRadius * 0.65} ${notchDepth} ${left + notchRadius} ${notchDepth} C${left + notchRadius * 1.35} ${notchDepth} ${left + notchRadius * 1.65} 0 ${left + notchWidth} 0 H${screenWidth} V${barHeight + extraBottom} H0 Z`;
  const focusedRoute = state.routes[state.index];
  const focusedOptions = descriptors[focusedRoute.key]?.options || {};
  if (
    focusedOptions.tabBarStyle &&
    (focusedOptions.tabBarStyle as any).display === "none"
  ) {
    return null;
  }

  const handlePress = (routeName: string, index: number) => {
    const event = navigation.emit({
      type: "tabPress",
      target: state.routes[index].key,
      canPreventDefault: true,
    });
    if (event.defaultPrevented) return;

    const root = tabRoots[routeName];
    if (root) {
      navigation.dispatch(
        CommonActions.navigate({
          name: routeName,
          params: { screen: root.screen },
        })
      );
    } else {
      navigation.navigate(routeName as never);
    }
  };

  const renderIcon = (name: string, focused: boolean) => {
    const color = focused ? appColor.primary : appColor.gray2;
    const size = 22;
    switch (name) {
      case "Home":
        return (
          <View style={[styles.homeBubble, focused && styles.homeBubbleActive]}>
            <Fontisto
              name="motorcycle"
              size={20}
              color={focused ? appColor.white : "#000000"}
            />
          </View>
        );
      case "Notification":
        return (
          <MaterialCommunityIcons
            name="message-text-outline"
            size={size}
            color={color}
          />
        );
      case "Service":
        return (
          <MaterialIcons
            name="miscellaneous-services"
            size={size}
            color={color}
          />
        );
      case "Setting":
        return <Ionicons name="settings-outline" size={size} color={color} />;
      case "Activity":
        return (
          <MaterialCommunityIcons
            name="chart-timeline-variant"
            size={size}
            color={color}
          />
        );
      default:
        return <View />;
    }
  };

  return (
    <View
      style={[styles.container, { paddingBottom: extraBottom, height: barHeight + extraBottom }]}
      pointerEvents="box-none"
    >
      <Svg
        width={screenWidth}
        height={barHeight + extraBottom}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Path d={pathD} fill={appColor.white} />
      </Svg>
      <View style={styles.row}>
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
              <View style={styles.iconWrap}>
                {renderIcon(route.name, focused)}
              </View>
              <Text
                style={[
                  styles.label,
                  { color: focused ? appColor.primary : appColor.gray2 },
                ]}
              >
                {routeLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: appColor.white,
    borderTopWidth: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 0,
    paddingBottom: 8,
    height: 70,
    width: "100%",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  homeBubble: {
    width: 48,
    height: 48,
    borderRadius: 100,
    backgroundColor: appColor.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  homeBubbleActive: {
    backgroundColor: appColor.primary,
    borderColor: appColor.primary,
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
