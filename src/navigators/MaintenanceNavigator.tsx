import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { MaintenanceDetail } from "../screens";

const MaintenanceNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MaintenanceDetail" component={MaintenanceDetail} />
    </Stack.Navigator>
  );
};

export default MaintenanceNavigator;
