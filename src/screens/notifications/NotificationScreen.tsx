import { View, Text } from "react-native";
import React from "react";
import { BackgroundComponent, TextComponent } from "../../components";

const NotificationScreen = () => {
  return (
    <BackgroundComponent title="Thông báo" back isScroll>
      <TextComponent text="Activity Screen" />
    </BackgroundComponent>
  );
};

export default NotificationScreen;
