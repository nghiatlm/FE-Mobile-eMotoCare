import { AntDesign, Fontisto } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import {
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../../components";
import { appColor } from "../../../constants/appColor";
import { fontFamilies } from "../../../constants/fontFamilies";
import { globalStyle } from "../../../styles/globalStyle";

const ConfirmStep = ({ state, center }: any) => {
  const { appointmentDate, timeSlot, serviceCenterName, vehicleName } = state;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <View>
      <SectionComponent styles={{ alignItems: "center", marginTop: 20 }}>
        <TextComponent
          text="Xác nhận đặt lịch"
          size={20}
          font={fontFamilies.roboto_medium}
          color={appColor.text}
        />
        <TextComponent
          text="Kiểm tra lại thông tin trước khi đặt"
          color={appColor.gray2}
          size={16}
          styles={{ marginTop: 6 }}
        />
      </SectionComponent>

      <SpaceComponent height={16} />

      {/* ---- Trung tâm ---- */}
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            backgroundColor: appColor.white,
            borderWidth: 1,
            borderColor: appColor.gray,
            borderRadius: 8,
            padding: 16,
            flexDirection: "row",
          },
        ]}
      >
        <Fontisto name="map-marker-alt" size={24} color={appColor.primary} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <TextComponent
            text="Trung tâm:"
            size={18}
            color={appColor.primary}
            font={fontFamilies.roboto_medium}
          />
          <SpaceComponent height={6} />
          <TextComponent
            text={center.name || "Chưa chọn"}
            size={18}
            color={appColor.text}
          />
          <SpaceComponent height={6} />
          <TextComponent
            text={center.address || "Chưa chọn"}
            size={16}
            color={appColor.gray}
          />
        </View>
      </SectionComponent>

      {/* ---- Thời gian ---- */}
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            backgroundColor: appColor.white,
            borderWidth: 1,
            borderColor: appColor.gray,
            borderRadius: 8,
            padding: 16,
            marginTop: 12,
            flexDirection: "row",
          },
        ]}
      >
        <Fontisto name="date" size={24} color={appColor.primary} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <TextComponent
            text="Thời gian:"
            size={18}
            color={appColor.primary}
            font={fontFamilies.roboto_medium}
          />
          <SpaceComponent height={6} />
          <TextComponent
            text={formatDate(appointmentDate)}
            size={18}
            color={appColor.text}
          />
          <SpaceComponent height={4} />
          <TextComponent
            text={timeSlot || "Chưa chọn"}
            size={18}
            color={appColor.text}
          />
        </View>
      </SectionComponent>

      {/* ---- Xe ---- */}
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            backgroundColor: appColor.white,
            borderWidth: 1,
            borderColor: appColor.gray,
            borderRadius: 8,
            padding: 16,
            marginTop: 12,
            flexDirection: "row",
          },
        ]}
      >
        <AntDesign name="info-circle" size={24} color={appColor.primary} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <TextComponent
            text="Thông tin xe:"
            size={18}
            color={appColor.primary}
            font={fontFamilies.roboto_medium}
          />
          <SpaceComponent height={6} />
          <TextComponent
            text={vehicleName || "Vinfast Feliz Lite"}
            size={18}
            color={appColor.text}
          />
        </View>
      </SectionComponent>
    </View>
  );
};

export default ConfirmStep;
