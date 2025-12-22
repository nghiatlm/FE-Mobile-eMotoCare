import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { AppointmentDetail, CreateRepairScreen, ServiceScreen, WaitConfirm } from "../screens";
import AppointmentNavigator from "./AppointmentNavigator";

const ServiceNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ServiceScreen" component={ServiceScreen} />
      <Stack.Screen name="CreateRepairScreen" component={CreateRepairScreen} />
      <Stack.Screen name="WaitConfirm" component={WaitConfirm} />
      <Stack.Screen name="Appointments" component={AppointmentNavigator} />
    </Stack.Navigator>
  );
};

export default ServiceNavigator;
