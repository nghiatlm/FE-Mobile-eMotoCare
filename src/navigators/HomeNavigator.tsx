import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import {
  BatteryCurrent,
  BatteryAnalysis,
  //   AppointmentDetailScreen,
  //   CreateMaintenance,
  HomeScreen,
  InspectionResult,
  ProfileScreen,
  RepairProcess,
  //   InspectionResult,
  //   MaintenanceDetailScreen,
  //   MaintenanceProcess,
  //   PaymentInvoice,
  //   SuccessScreen,
  //   WaitConfirm,
} from "../screens";
import MaintenanceNavigator from "./MaintenanceNavigator";
import AppointmentNavigator from "./AppointmentNavigator";
import VehicleNavigator from "./VehicleNavigator";
import ActivityNavigator from "./ActivityNavigator";
// import VehicleNavigator from "./VehicleNavigator";

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="Maintenances" component={MaintenanceNavigator} />
      <Stack.Screen name="Appointments" component={AppointmentNavigator} />
      <Stack.Screen name="RepairProcess" component={RepairProcess} />
      <Stack.Screen name="InspectionResult" component={InspectionResult} />
      <Stack.Screen name="BatteryCurrent" component={BatteryCurrent} />
      <Stack.Screen name="BatteryAnalysis" component={BatteryAnalysis} />
      <Stack.Screen name="Vehicles" component={VehicleNavigator} />
      <Stack.Screen name="Activities" component={ActivityNavigator} />
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
      
      <Stack.Screen name="PaymentInvoice" component={PaymentInvoice} />
      <Stack.Screen name="Vehicles" component={VehicleNavigator} /> */}
    </Stack.Navigator>
  );
};

export default HomeNavigator;
