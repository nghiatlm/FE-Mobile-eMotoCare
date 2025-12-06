import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import {
  //   AppointmentDetailScreen,
  //   CreateMaintenance,
  HomeScreen,
  ProfileScreen,
  //   InspectionResult,
  //   MaintenanceDetailScreen,
  //   MaintenanceProcess,
  //   PaymentInvoice,
  //   SuccessScreen,
  //   WaitConfirm,
} from "../screens";
import MaintenanceNavigator from "./MaintenanceNavigator";
// import VehicleNavigator from "./VehicleNavigator";

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="Maintenances" component={MaintenanceNavigator} />
      {/* <Stack.Screen
        name="MaintenanceDetail"
        component={MaintenanceDetailScreen}
      />
      <Stack.Screen name="CreateMaintenance" component={CreateMaintenance} />
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
      <Stack.Screen name="MaintenanceProcess" component={MaintenanceProcess} />
      <Stack.Screen name="WaitConfirm" component={WaitConfirm} />
      <Stack.Screen
        name="AppointmentDetail"
        component={AppointmentDetailScreen}
      />
      <Stack.Screen name="InspectionResult" component={InspectionResult} />
      <Stack.Screen name="PaymentInvoice" component={PaymentInvoice} />
      <Stack.Screen name="Vehicles" component={VehicleNavigator} /> */}
    </Stack.Navigator>
  );
};

export default HomeNavigator;
