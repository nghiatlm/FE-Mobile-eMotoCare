import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { VehiclesDetailScreen } from "../screens";

const Stack = createNativeStackNavigator();

const VehicleNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VehicleDetail" component={VehiclesDetailScreen} />
    </Stack.Navigator>
  );
};

export default VehicleNavigator;