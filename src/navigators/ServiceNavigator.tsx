import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { CreateRepairScreen, ServiceScreen } from "../screens";

const ServiceNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ServiceScreen" component={ServiceScreen} />
      <Stack.Screen name="CreateRepairScreen" component={CreateRepairScreen} />
    </Stack.Navigator>
  );
};

export default ServiceNavigator;
