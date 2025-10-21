import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import {
  CreateMaintenance,
  HomeScreen,
  MaintenanceDetailScreen,
} from "../screens";

const ExploreNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen
        name="MaintenanceDetail"
        component={MaintenanceDetailScreen}
      />
      <Stack.Screen name="CreateMaintenance" component={CreateMaintenance} />
    </Stack.Navigator>
  );
};

export default ExploreNavigator;
