import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { SettingScreen } from "../screens";

const SettingNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
    </Stack.Navigator>
  );
};

export default SettingNavigator;
