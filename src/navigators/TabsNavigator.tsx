import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomTabBar from "../components/CustomTabBar";
import ActivityNavigator from "./ActivityNavigator";
import HomeNavigator from "./HomeNavigator";
import NotificationNavigator from "./NotificationNavigator";
import ServiceNavigator from "./ServiceNavigator";
import SettingNavigator from "./SettingNavigator";

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
            tabBarStyle: [
              "CreateRepairScreen",
              "Appointments",
              "WaitConfirm",
            ].includes(routeName)
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
              "Maintenances",
              "Appointments",
              "BatteryCurrent",
              "BatteryAnalysis",
              "Vehicles",
              "InspectionResult",
              "PaymentInfor",
              "Batteries",
              "RevisedMinutes",
              "RepairProcess"
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
