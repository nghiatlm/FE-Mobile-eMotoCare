import React, { useState } from "react";
import {
  BackgroundComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import appointmentData from "../../services/contants/appointments.json";
import { formatDateDDMMYYYY } from "../../utils/formatDate";
const VehicleHistorySreen = ({ navigation, route }: any) => {
  const [appointments, setAppointments] = useState<any[]>(appointmentData.data);
  const slotToRange = (slot?: string) => {
    if (!slot) return "";
    const m = slot.match(/H(\d+)_?(\d+)?/i);
    if (m) {
      const start = m[1].padStart(2, "0") + ":00";
      const end =
        (m[2]
          ? m[2].padStart(2, "0")
          : String(Number(m[1]) + 1).padStart(2, "0")) + ":00";
      return `${start} - ${end}`;
    }
    return slot;
  };

  const statusLabel = (status?: string) => {
    if (!status) return "Chưa rõ";
    switch (status) {
      case "COMPLETED":
      case "REPAIR_COMPLETED":
        return "Hoàn thành";
      case "UPCOMING":
        return "Sắp tới";
      case "NO_START":
        return "Chưa thực hiện";
      default:
        return status;
    }
  };

  const statusColor = (status?: string) => {
    if (!status) return appColor.gray3;
    switch (status) {
      case "COMPLETED":
      case "REPAIR_COMPLETED":
        return appColor.primary;
      case "UPCOMING":
        return appColor.warning;
      case "NO_START":
        return appColor.gray3;
      default:
        return appColor.gray3;
    }
  };

  return (
    <BackgroundComponent title="Lịch sử" back isScroll>
      <TextComponent
        text="Lịch sử hoạt động"
        size={18}
        flex={1}
        color={appColor.text}
        font={fontFamilies.roboto_bold}
        styles={{ textAlign: "center", marginTop: 10 }}
      />
      <SpaceComponent height={20} />

      {appointments.map((appt) => {
        const centerName =
          appt.serviceCenter?.name ?? appt.serviceCenterId ?? "Trung tâm";
        const title =
          appt.maintenanceStage?.name ??
          (appt.type === "MAINTENANCE_TYPE"
            ? "Kiểm tra định kỳ"
            : "Bảo dưỡng/sửa chữa");
        const dateStr = formatDateDDMMYYYY(
          appt.appointmentDate || appt.createdAt
        ).replace(/-/g, "/");
        const timeRange = slotToRange(appt.slotTime);
        const statusTxt = statusLabel(appt.status);
        const color = statusColor(appt.status);

        return (
          <SectionComponent
            key={appt.id}
            styles={{
              marginVertical: 8,
              backgroundColor: appColor.white,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: appColor.gray,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          >
            <RowComponent
              justify="flex-start"
              styles={{ alignItems: "flex-start" }}
            >
              <FontAwesome name="calendar" size={24} color={appColor.primary} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <TextComponent
                  text={title}
                  size={17}
                  color={appColor.text}
                  font={fontFamilies.roboto_medium}
                  flex={1}
                />
                <SpaceComponent height={6} />
                <RowComponent justify="flex-start">
                  <TextComponent
                    text="Trung tâm: "
                    size={16}
                    font={fontFamilies.roboto_regular}
                    color={appColor.text}
                  />
                  <TextComponent
                    text={centerName}
                    size={16}
                    font={fontFamilies.roboto_medium}
                    color={appColor.text}
                  />
                </RowComponent>
                <SpaceComponent height={6} />
                <TextComponent
                  text={`${dateStr} ${timeRange}`}
                  size={16}
                  font={fontFamilies.roboto_medium}
                  color={appColor.text}
                />
                <SpaceComponent height={6} />
                <TextComponent
                  text={statusTxt}
                  size={16}
                  font={fontFamilies.roboto_medium}
                  color={color}
                />
              </View>
            </RowComponent>
          </SectionComponent>
        );
      })}
    </BackgroundComponent>
  );
};

export default VehicleHistorySreen;
