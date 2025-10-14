import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { ServiceScreen } from "../screens";

const ServiceNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ServiceScreen" component={ServiceScreen} />
    </Stack.Navigator>
  );
};

export default ServiceNavigator;
