import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { ReactNode } from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Motorbike } from "../assets/svg";
import { TextComponent } from "../components";
import { appColor } from "../constants/appColor";
import { globalStyle } from "../styles/globalStyle";
import ActivityNavigator from "./ActivityNavigator";
import HomeNavigator from "./HomeNavigator";
import NotificationNavigator from "./NotificationNavigator";
import ServiceNavigator from "./ServiceNavigator";
import SettingNavigator from "./SettingNavigator";
import CustomTabBar from "../components/CustomTabBar";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const TabsNavigator = () => {
  const Tab = createBottomTabNavigator();
  const insets = useSafeAreaInsets();
  const tabBarBottom = (insets?.bottom ?? 0) + 6;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Service"
        component={ServiceNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "";
          return {
            headerShown: false,
            tabBarStyle: ["CreateRepairScreen"].includes(
              routeName
            )
              ? { display: "none" }
              : undefined,
          };
        }}
      />
      <Tab.Screen name="Activity" component={ActivityNavigator} />
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "";
          return {
            headerShown: false,
            tabBarStyle: [
              "MaintenanceDetail",
              "CreateMaintenance",
              "SuccessScreen",
              "AppointmentDetail",
              "MaintenanceProcess",
              "WaitConfirm",
              "InspectionResult",
              "PaymentInvoice",
            ].includes(routeName)
              ? { display: "none" }
              : undefined,
          };
        }}
      />
      <Tab.Screen name="Notification" component={NotificationNavigator} />
      <Tab.Screen name="Setting" component={SettingNavigator} />
    </Tab.Navigator>
  );
};

export default TabsNavigator;
