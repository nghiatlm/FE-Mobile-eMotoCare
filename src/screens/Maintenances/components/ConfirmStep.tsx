import React from "react";
import { View } from "react-native";
import {
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../../components";
import { fontFamilies } from "../../../constants/fontFamilies";
import { appColor } from "../../../constants/appColor";
import { Fontisto, MaterialIcons } from "@expo/vector-icons";
import { globalStyle } from "../../../styles/globalStyle";

const ConfirmStep = ({ state }: any) => {
  return (
    <View>
      <SectionComponent
        styles={{
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <TextComponent
          text="Xác nhận đặt lịch"
          size={20}
          font={fontFamilies.roboto_medium}
          color={appColor.text}
        />
        <TextComponent
          text="Kiểm tra lại thông tin trước khi đặt lịch"
          color={appColor.gray2}
          font={fontFamilies.roboto_regular}
          size={18}
          styles={{
            marginTop: 10,
          }}
        />
      </SectionComponent>
      <SpaceComponent height={22} />
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            backgroundColor: appColor.white,
            borderWidth: 1,
            borderColor: appColor.gray,
            borderRadius: 8,
            paddingVertical: 16,
            flexDirection: "row",
          },
        ]}
      >
        <Fontisto name="map-marker-alt" size={24} color={appColor.primary} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <TextComponent
            text="Trung tâm: "
            size={18}
            color={appColor.primary}
            font={fontFamilies.roboto_medium}
          />
          <SpaceComponent height={8} />
          <TextComponent
            text="eMotoCare Center Lê Văn Khương"
            size={18}
            color={appColor.text}
            font={fontFamilies.roboto_regular}
          />
          <SpaceComponent height={8} />
          <TextComponent
            text="123 Lê Lợi, Quận 1, TP.HCM"
            size={16}
            color={appColor.gray3}
            font={fontFamilies.roboto_regular}
          />
          <SpaceComponent height={8} />
          <RowComponent justify="flex-start">
            <TextComponent
              text="600m "
              size={16}
              color={appColor.gray3}
              font={fontFamilies.roboto_regular}
            />
            <TextComponent
              text="- 4.8"
              size={16}
              color={appColor.gray3}
              font={fontFamilies.roboto_regular}
            />
            <MaterialIcons name="star" size={24} color={appColor.warning} />
          </RowComponent>
        </View>
      </SectionComponent>
      <SpaceComponent height={6} />
      <TextComponent text={`Khung giờ: ${state.slot ?? "-"}`} />
      <SpaceComponent height={6} />
      <TextComponent text={`Xe: ${state.vehicleId ?? "-"}`} />
      <SpaceComponent height={6} />
      <TextComponent text={`Ghi chú: ${state.notes ?? "-"}`} />
    </View>
  );
};

export default ConfirmStep;
