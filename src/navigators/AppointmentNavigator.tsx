import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CreateAppointment } from "../screens";

const AppointmentNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateAppointment" component={CreateAppointment} />
    </Stack.Navigator>
  );
};

export default AppointmentNavigator;
