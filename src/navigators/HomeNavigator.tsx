import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import {
  AppointmentDetailScreen,
  CreateMaintenance,
  HomeScreen,
  MaintenanceDetailScreen,
  MaintenanceProcess,
  SuccessScreen,
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
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
      <Stack.Screen name="MaintenanceProcess" component={MaintenanceProcess} />
      <Stack.Screen
        name="AppointmentDetail"
        component={AppointmentDetailScreen}
      />
    </Stack.Navigator>
  );
};

export default ExploreNavigator;
