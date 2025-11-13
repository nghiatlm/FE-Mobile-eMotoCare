import { AntDesign, Fontisto } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import {
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../../components";
import { appColor } from "../../../constants/appColor";
import { fontFamilies } from "../../../constants/fontFamilies";
import { globalStyle } from "../../../styles/globalStyle";
import { getKMLabel } from "../../../utils/generateKM";

const ConfirmStep = ({ state, center, vehicle }: any) => {
  const { appointmentDate, timeSlot } = state;
  const [isWarranty, setIsWarranty] = useState(false);

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

  useEffect(() => {
    const checkWarranty = () => {
      if (!vehicle || !vehicle.warrantyExpiry) {
        setIsWarranty(false);
        return;
      }
      const exp = new Date(vehicle.warrantyExpiry);
      if (isNaN(exp.getTime())) {
        setIsWarranty(false);
        return;
      }
      const now = new Date();
      setIsWarranty(exp.getTime() >= now.getTime());
    };
    checkWarranty();
  }, [vehicle]);

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

      {/* Trung tâm */}
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
          <TextComponent text={center?.name || "Chưa chọn"} size={18} color={appColor.text} />
          <SpaceComponent height={6} />
          <TextComponent text={center?.address || "Chưa chọn"} size={16} color={appColor.gray} />
        </View>
      </SectionComponent>

      <SpaceComponent height={16} />

      {/* Thời gian */}
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
          <TextComponent text="Thời gian:" size={18} color={appColor.primary} font={fontFamilies.roboto_medium} />
          <SpaceComponent height={6} />
          <TextComponent text={formatDate(appointmentDate) || "Chưa chọn"} size={18} color={appColor.text} />
          <SpaceComponent height={4} />
          <TextComponent text={timeSlot || "Chưa chọn"} size={18} color={appColor.text} />
        </View>
      </SectionComponent>

      <SpaceComponent height={16} />

      {/* Xe */}
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
          <TextComponent text="Thông tin xe:" size={18} color={appColor.primary} font={fontFamilies.roboto_medium} />
          <SpaceComponent height={6} />

          <RowComponent justify="flex-start">
            <TextComponent text="Kiểu xe:" size={Platform.OS === "android" ? 16 : 18} font={fontFamilies.roboto_regular} styles={{ marginRight: 12 }} />
            <TextComponent text={vehicle?.modelName || "Chưa có dữ liệu"} size={Platform.OS === "android" ? 16 : 18} styles={{ marginRight: 12, flex: 1 }} />
          </RowComponent>
          <SpaceComponent height={6} />

          <RowComponent justify="flex-start">
            <TextComponent text="Số km:" size={Platform.OS === "android" ? 16 : 18} font={fontFamilies.roboto_regular} styles={{ marginRight: 12 }} />
            <TextComponent text={getKMLabel(vehicle?.mileage ?? vehicle?.km ?? null)} size={Platform.OS === "android" ? 16 : 18} styles={{ marginRight: 12 }} />
          </RowComponent>
          <SpaceComponent height={6} />

          <RowComponent justify="flex-start" styles={{ alignItems: "center" }}>
            <TextComponent text="Bảo hành:" size={Platform.OS === "android" ? 16 : 18} font={fontFamilies.roboto_regular} styles={{ marginRight: 12 }} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextComponent text={isWarranty ? "Còn bảo hành" : "Hết bảo hành"} size={Platform.OS === "android" ? 16 : 18} styles={{ marginRight: 8 }} color={isWarranty ? appColor.primary : appColor.danger} />
              <View style={{ backgroundColor: isWarranty ? appColor.primary : appColor.danger, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                <TextComponent text={isWarranty ? "Warranty" : "Expired"} size={12} color={appColor.white} />
              </View>
            </View>
          </RowComponent>
          <SpaceComponent height={6} />
        </View>
      </SectionComponent>
    </View>
  );
};

export default ConfirmStep;
