import React from "react";
import { BackgroundComponent, TextComponent } from "../../components";

const ActivityScreen = () => {
  return (
    <BackgroundComponent title="Hoạt động gần đây" back isScroll>
      <TextComponent text="Activity Screen" />
    </BackgroundComponent>
  );
};

export default ActivityScreen;
