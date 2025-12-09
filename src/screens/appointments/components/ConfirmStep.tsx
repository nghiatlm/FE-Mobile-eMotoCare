import React, { useEffect } from "react";
import { View } from "react-native";
import { SectionComponent, SpaceComponent, TextComponent } from "../../../components";
import ConfirmCard from "../../../components/ConfirmCard";
import { appColor } from "../../../constants/appColor";
import { fontFamilies } from "../../../constants/fontFamilies";

interface Props {
  center?: any;
  vehicle?: any;
  timeSlot?: { date: string; time: string } | null;
  appointmentRequest?: any;
}

const ConfirmStep = (props: Props) => {
  const { center, vehicle, timeSlot, appointmentRequest } = props;

  useEffect(() => {
    console.log("Thông tin xác nhận:", {
      center,
      vehicle,
      timeSlot,
      appointmentRequest,
    });
  }, [center, vehicle, timeSlot, appointmentRequest]);

  return (
    <View style={{ gap: 14 }}>
      <SectionComponent styles={{ marginTop: 20, alignItems: "center" }}>
        <TextComponent
          text="Xác nhận thông tin đặt lịch"
          size={20}
          color={appColor.text}
          font={fontFamilies.roboto_medium}
        />
        <SpaceComponent height={6} />
        <TextComponent
          text="Vui lòng kiểm tra thông tin trước khi xác nhận"
          size={15}
          color={appColor.gray2}
          font={fontFamilies.roboto_light}
        />
      </SectionComponent>

      <ConfirmCard
        icon="map-marker"
        title="Trung tâm bảo dưỡng"
        line1={center?.name || "Trung tâm A"}
        line2={`Địa chỉ: ${center?.address || "123 Đường ABC, Quận 1, TP.HCM"}`}
      />

      <ConfirmCard
        icon="motorcycle"
        title="Thông tin xe"
        line1={vehicle?.licensePlate || "51A-123.45"}
        line2={`Loại xe: ${vehicle?.modelName || "Xe máy ABC"}`}
      />

      <ConfirmCard
        icon="clock-o"
        title="Thời gian đặt lịch"
        line1={
          timeSlot
            ? `${timeSlot.date} • ${timeSlot.time}`
            : "2024-07-01 • 10:00 AM"
        }
      />
    </View>
  );
};

export default ConfirmStep;
