import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabsNavigator = () => {
  const Tab = createBottomTabNavigator();
  const insets = useSafeAreaInsets();
  return (
    <View>
      <Text>TabsNavigator</Text>
    </View>
  );
};

export default TabsNavigator;
