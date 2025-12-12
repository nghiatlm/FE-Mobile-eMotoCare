import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { BatteryCurrent, BatteryScreen } from "../screens";

const BatteryNavigator = () => {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BatteryScreen" component={BatteryScreen} />
      <Stack.Screen name="BatteryCurrent  " component={BatteryCurrent} />
    </Stack.Navigator>
  );
};

export default BatteryNavigator;
