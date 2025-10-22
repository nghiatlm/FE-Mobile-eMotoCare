import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { ReactNode } from "react";
import { Platform, View } from "react-native";
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
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const TabsNavigator = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 88 : 78,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: appColor.white,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let icon: ReactNode;
          color = focused ? appColor.primary : appColor.gray;
          size = 23;
          switch (route.name) {
            case "Home":
              icon = (
                <View
                  style={[
                    globalStyle.shadow,
                    {
                      width: 64,
                      height: 64,
                      borderRadius: 100,
                      backgroundColor: focused
                        ? appColor.primary
                        : appColor.gray,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: Platform.OS === "ios" ? -50 : -60,
                    },
                  ]}
                >
                  <Motorbike width={36} height={40} />
                </View>
              );
              break;
            case "Notification":
              icon = (
                <MaterialCommunityIcons
                  name="message-text-outline"
                  size={size}
                  color={color}
                />
              );
              break;
            case "Service":
              icon = (
                <MaterialIcons
                  name="miscellaneous-services"
                  size={size}
                  color={color}
                />
              );
              break;
            case "Setting":
              icon = (
                <Ionicons name="settings-outline" size={size} color={color} />
              );
              break;
            case "Activity":
              icon = (
                <MaterialCommunityIcons
                  name="chart-timeline-variant"
                  size={size}
                  color={color}
                />
              );
              break;
          }
          return icon;
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
        tabBarLabel: ({ focused }) => {
          if (route.name === "Home") return null;
          const labels: Record<string, string> = {
            Activity: "Hoạt động",
            Notification: "Thông báo",
            Service: "Dịch vụ",
            Setting: "Cài đặt",
          };
          const label = labels[route.name] || route.name;
          return focused ? (
            <TextComponent
              text={label}
              flex={0}
              size={12}
              color={appColor.primary}
              styles={{ marginBottom: 0 }}
            />
          ) : null;
        },
      })}
    >
      <Tab.Screen name="Service" component={ServiceNavigator} />
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
