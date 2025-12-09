import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { NotificationScreen, NotificationDetailScreen } from "../screens";

const NotificationNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
    </Stack.Navigator>
  );
};

export default NotificationNavigator;
