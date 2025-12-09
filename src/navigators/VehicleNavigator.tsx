import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import {
  BatteryCurrent,
  VehicleHistorySreen,
  VehiclesDetailScreen,
} from "../screens";

const Stack = createNativeStackNavigator();

const VehicleNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VehicleDetail" component={VehiclesDetailScreen} />
      <Stack.Screen name="VehicleHistory" component={VehicleHistorySreen} />
      <Stack.Screen name="BatteryCurrent" component={BatteryCurrent} />
    </Stack.Navigator>
  );
};

export default VehicleNavigator;
