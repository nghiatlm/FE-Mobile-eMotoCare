import { View, Text } from "react-native";
import React from "react";
import { BackgroundComponent } from "../../components";

const BatteryCurrent = () => {
  return (
    <BackgroundComponent back title="Tình trạng pin hiện tại">
      <View>
        <Text>BatteryCurrent</Text>
      </View>
    </BackgroundComponent>
  );
};

export default BatteryCurrent;
