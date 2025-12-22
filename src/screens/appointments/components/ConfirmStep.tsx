import React, { useEffect } from "react";
import { View } from "react-native";
import { SectionComponent, SpaceComponent, TextComponent } from "../../../components";
import ConfirmCard from "../../../components/ConfirmCard";
import { appColor } from "../../../constants/appColor";
import { fontFamilies } from "../../../constants/fontFamilies";
import { formatSlotTime } from "../../../utils/formatSlotTime";
import { formatDateDDMMYYYY } from "../../../utils/formatDate";

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
      <SectionComponent styles={{ marginTop: 20, alignItems: "center", paddingHorizontal: 12 }}>
        <TextComponent
          text="Xác nhận thông tin đặt lịch"
          size={20}
          color={appColor.text}
          font={fontFamilies.roboto_medium}
        />
        <SpaceComponent height={6} />
        <TextComponent
          text="Vui lòng kiểm tra thông tin trước khi xác nhận"
          size={14}
          color={appColor.gray2}
          font={fontFamilies.roboto_regular}
          styles={{ textAlign: "center" }}
        />
      </SectionComponent>

      <SpaceComponent height={8} />

      <ConfirmCard
        icon="map-marker"
        title="Trung tâm bảo dưỡng"
        line1={center?.name || "Chưa chọn trung tâm"}
        line2={center?.address ? `Địa chỉ: ${center.address}` : ""}
      />

      <ConfirmCard
        icon="motorcycle"
        title="Thông tin xe"
        line1={vehicle?.licensePlate || "Chưa có biển số"}
        line2={vehicle?.modelName ? `Loại xe: ${vehicle.modelName}` : ""}
      />

      <ConfirmCard
        icon="clock-o"
        title="Thời gian đặt lịch"
        line1={
          timeSlot
            ? `Ngày: ${formatDateDDMMYYYY(timeSlot.date)}`
            : "Chưa chọn thời gian"
        }
        line2={
          timeSlot?.time
            ? `Khung giờ: ${formatSlotTime(timeSlot.time)}`
            : ""
        }
      />
      
      <SpaceComponent height={12} />
    </View>
  );
};

export default ConfirmStep;
