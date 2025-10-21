import { View, Text } from "react-native";
import React from "react";
import {
  BackgroundComponent,
  ButtonComponent,
  SectionComponent,
} from "../../components";
import { fontFamilies } from "../../constants/fontFamilies";

const ServiceScreen = () => {
  return (
    <BackgroundComponent title="Dịch vụ">
      <SectionComponent>
        <ButtonComponent
          text="Bảo dưỡng"
          textStyle={{ fontFamily: fontFamilies.roboto_bold, fontSize: 20 }}
        />
        <ButtonComponent
          text="Bảo dưỡng"
          textStyle={{ fontFamily: fontFamilies.roboto_bold, fontSize: 20 }}
        />
      </SectionComponent>
    </BackgroundComponent>
  );
};

export default ServiceScreen;
