import { View, Text } from "react-native";
import React, { useEffect } from "react";
import {
  BackgroundComponent,
  ButtonComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { globalStyle } from "../../styles/globalStyle";

const MaintenanceDetail = ({ route, navigation }: any) => {
  const { id } = route?.params || {};
  useEffect(() => {
    console.log("MaintenanceDetail id:", id);
  }, [id]);

  const handleSchedule = () => {
    console.log("Schedule maintenance:", id);
    // TODO: navigate to scheduling screen or show modal
  };

  const footerComponent = (
    <SectionComponent>
      <ButtonComponent
        text="Đặt lịch bảo dưỡng"
        type="primary"
        onPress={handleSchedule}
      />
    </SectionComponent>
  );

  return (
    <BackgroundComponent
      isScroll
      title="Chi tiết"
      back
      footer={footerComponent}
    >
      <SectionComponent>
        <TextComponent
          text="Chi tiết đợt bảo dưỡng"
          size={20}
          color={appColor.text}
          font={fontFamilies.roboto_bold}
          styles={{ textAlign: "center", marginTop: 12 }}
        />
      </SectionComponent>
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            padding: 16,
            borderRadius: 8,
            marginTop: 16,
            backgroundColor: appColor.white,
            borderWidth: 0.5,
            borderColor: appColor.gray,
          },
        ]}
      >
        <TextComponent
          text="Bảo dưỡng đợt 1"
          size={18}
          color={appColor.text}
          font={fontFamilies.roboto_medium}
        />
        <SpaceComponent height={8} />
        <RowComponent justify="flex-start">
          <TextComponent
            text="Áp dụng: "
            size={18}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
          />
          <TextComponent
            text="2500 - 6000 km"
            size={18}
            color={appColor.text}
            font={fontFamilies.roboto_regular}
            styles={{ marginLeft: 4 }}
          />
        </RowComponent>
      </SectionComponent>
      <SpaceComponent height={16} />
      <TextComponent
        text="Thông tin xe"
        size={18}
        color={appColor.primary}
        font={fontFamilies.roboto_medium}
      />
      <SpaceComponent height={8} />
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            padding: 16,
            borderRadius: 8,
            backgroundColor: appColor.white,
            borderWidth: 0.5,
            borderColor: appColor.gray,
          },
        ]}
      >
        <RowComponent justify="space-between">
          <TextComponent
            text="Kiểu xe: "
            size={18}
            color={appColor.text}
            font={fontFamilies.roboto_regular}
          />
          <TextComponent
            text="EV200"
            size={18}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
          />
        </RowComponent>
        <SpaceComponent height={8} />
        <RowComponent justify="space-between">
          <TextComponent
            text="Tình trạng bảo hành: "
            size={18}
            color={appColor.text}
            font={fontFamilies.roboto_regular}
          />
          <TextComponent
            text="Còn"
            size={18}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
          />
        </RowComponent>
      </SectionComponent>
    </BackgroundComponent>
  );
};

export default MaintenanceDetail;
