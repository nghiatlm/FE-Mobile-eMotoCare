import { View, Text } from "react-native";
import React from "react";
import { BackgroundComponent, TextComponent } from "../../components";

const SettingScreen = () => {
  return (
    <BackgroundComponent title="Cài đặt" back isScroll>
      <TextComponent text="Activity Screen" />
    </BackgroundComponent>
  );
};

export default SettingScreen;
