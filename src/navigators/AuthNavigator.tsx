import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import {
  ForgotPassword,
  LoginScreen,
  OnbroadingScreen,
  RegisterScreen,
  Verification,
} from "../screens";

const AuthNavigator = () => {

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnbroadingScreen" component={OnbroadingScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="Verification" component={Verification} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
