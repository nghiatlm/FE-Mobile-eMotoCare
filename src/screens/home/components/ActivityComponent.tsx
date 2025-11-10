import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import {
  ButtonComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from "../../../components";
import { appColor } from "../../../constants/appColor";
import { fontFamilies } from "../../../constants/fontFamilies";
import { useNavigation } from "@react-navigation/native";

interface Props {
  activities?: any[];
}

const parseISOToDate = (iso?: string): Date | null => {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
};
const formatDateDDMMYYYY = (iso?: string) => {
  const d = parseISOToDate(iso);
  if (!d) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};
const slotCodeToTimeLabel = (code?: string) => {
  if (!code) return "";
  const m = String(code).match(/(\d{1,2})[_\-](\d{1,2})/);
  if (m) {
    const a = m[1].padStart(2, "0");
    const b = m[2].padStart(2, "0");
    return `${a}:00 - ${b}:00`;
  }
  return String(code);
};

const ActivityComponent = ({ route, activities }: any) => {
  const list: any[] = Array.isArray(activities) ? activities : [];

  const navigation = useNavigation<any>();

  return (
    <View>
      {list.length > 0 ? (
        list.map((activity: any, index: number) => {
          const serviceCenterName =
            activity?.serviceCenter?.name ||
            (typeof activity.serviceCenter === "string"
              ? activity.serviceCenter
              : "Trung tâm chưa rõ");
          const timeLabel =
            (activity.appointmentDate
              ? `${formatDateDDMMYYYY(activity.appointmentDate)} `
              : "") +
            (activity.slotTime
              ? slotCodeToTimeLabel(activity.slotTime)
              : activity.time || "");

          const statusText =
            typeof activity.status === "string"
              ? activity.status
              : JSON.stringify(activity.status);

          return (
            <View key={activity.id ?? index} style={{ marginBottom: 20 }}>
              <View
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 8,
                }}
              >
                <RowComponent justify="flex-start">
                  <FontAwesome6
                    name="calendar"
                    size={20}
                    color={appColor.text}
                  />
                  <TextComponent
                    text={activity.type || "Kiểm tra định kỳ"}
                    size={15}
                    font={fontFamilies.roboto_medium}
                    flex={1}
                    color={appColor.text}
                    styles={{ marginLeft: 10 }}
                  />
                </RowComponent>
                <SpaceComponent height={8} />
                <RowComponent justify="flex-start" styles={{ marginLeft: 12 }}>
                  <TextComponent
                    text="Trung tâm dịch vụ: "
                    size={13}
                    font={fontFamilies.roboto_regular}
                    color={appColor.text}
                  />
                  <TextComponent
                    text={serviceCenterName}
                    size={13}
                    font={fontFamilies.roboto_medium}
                    color={appColor.text}
                  />
                </RowComponent>
                <SpaceComponent height={4} />
                <RowComponent justify="flex-start" styles={{ marginLeft: 12 }}>
                  <TextComponent
                    text="Thời gian: "
                    size={13}
                    font={fontFamilies.roboto_regular}
                    color={appColor.text}
                  />
                  <TextComponent
                    text={timeLabel || "Chưa có thời gian"}
                    size={13}
                    font={fontFamilies.roboto_medium}
                    color={appColor.text}
                  />
                </RowComponent>
                <SpaceComponent height={4} />
                <RowComponent justify="flex-start" styles={{ marginLeft: 12 }}>
                  <TextComponent
                    text="Trạng thái: "
                    size={13}
                    font={fontFamilies.roboto_regular}
                    color={appColor.text}
                  />
                  <TextComponent
                    text={statusText || "Chưa có"}
                    size={13}
                    font={fontFamilies.roboto_medium}
                    color={
                      String(statusText).toLowerCase().includes("hoàn thành")
                        ? appColor.primary
                        : appColor.text
                    }
                  />
                </RowComponent>
                <SpaceComponent height={15} />
                <ButtonComponent
                  text="Xem chi tiết"
                  onPress={() =>
                    navigation.navigate("MaintenanceProcess", { id: activity.id })
                  }
                />
              </View>
            </View>
          );
        })
      ) : (
        <TextComponent
          text="Không có hoạt động nào."
          size={15}
          font={fontFamilies.roboto_medium}
          color={appColor.text}
          styles={{ textAlign: "center", marginTop: 20 }}
        />
      )}
    </View>
  );
};

export default ActivityComponent;
