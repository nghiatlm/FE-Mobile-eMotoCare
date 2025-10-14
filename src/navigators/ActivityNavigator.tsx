import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { ActivityScreen } from "../screens";

const ActivityNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
    </Stack.Navigator>
  );
};

export default ActivityNavigator;
