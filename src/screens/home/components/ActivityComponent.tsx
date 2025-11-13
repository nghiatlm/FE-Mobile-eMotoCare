import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import {
  ButtonComponent,
  TextComponent
} from "../../../components";
import { appColor } from "../../../constants/appColor";
import { fontFamilies } from "../../../constants/fontFamilies";
import { statusActivities, statusColor } from "../../../utils/generateStatus";
import { generateServiceType } from '../../../utils/generateServiceType';

interface Props {
  activities?: any[];
  loading?: boolean;
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

const ActivityComponent = ({ route, activities, loading }: any) => {
  const list: any[] = Array.isArray(activities) ? activities : [];

  if (loading) {
    return (
      <View style={{ paddingVertical: 12, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={appColor.primary} />
      </View>
    );
  }

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

          const statusInfo = statusActivities(activity.status);
          const statusText = typeof statusInfo === 'string' ? statusInfo : statusInfo?.label ?? JSON.stringify(statusInfo);

          const statusTextColor = statusColor(activity.status);

          return (
            <View key={activity.id ?? index} style={styles.cardWrap}>
              <View style={styles.cardRow}>
                <View style={styles.iconWrap}>
                  <FontAwesome6
                    name="calendar"
                    size={18}
                    color={appColor.white}
                  />
                </View>

                <View style={styles.content}>
                  <TextComponent
                    text={
                      generateServiceType(activity.type) || activity.type || "Kiểm tra định kỳ"
                    }
                    size={15}
                    font={fontFamilies.roboto_medium}
                    color={appColor.text}
                  />
                  <TextComponent
                    text={serviceCenterName}
                    size={13}
                    color={appColor.gray2}
                    styles={{ marginTop: 6 }}
                  />
                  <TextComponent
                    text={timeLabel || "Chưa có thời gian"}
                    size={13}
                    color={appColor.gray2}
                    styles={{ marginTop: 4 }}
                  />
                  <TextComponent
                    text={statusText || "Chưa có"}
                    size={13}
                    font={fontFamilies.roboto_medium}
                    color={statusTextColor || appColor.text}
                    styles={{ marginTop: 6 }}
                  />
                </View>
              </View>
              <View style={{ alignItems: 'center', marginTop: 8 }}>
                <ButtonComponent
                  text="Xem chi tiết"
                  type="link"
                  onPress={() =>
                    navigation.navigate("MaintenanceProcess", {
                      id: activity.id,
                    })
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

const styles = StyleSheet.create({
  cardWrap: {
    backgroundColor: appColor.white,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: appColor.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  actionWrap: {
    marginLeft: 8,
    justifyContent: "center",
  },
});
