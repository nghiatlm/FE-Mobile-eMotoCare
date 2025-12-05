import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ButtonComponent, RowComponent, TextComponent } from "../../../components";
import { appColor } from "../../../constants/appColor";
import { fontFamilies } from "../../../constants/fontFamilies";

const data = [
  {
    id: 1,
    serviceCenter: {
      id: 101,
      name: "Trung tâm dịch vụ A",
      address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    },
    slotTime: "H07-08",
    appointmentDate: "2024-07-15",
    code: "APPT20240715001",
    type: "MAINTENANCE_TYPE",
    status: "SUCCESS",
  },
  {
    id: 2,
    serviceCenter: {
      id: 102,
      name: "Trung tâm dịch vụ B",
      address: "45 Nguyễn Huệ, Quận 1, TP.HCM",
    },
    slotTime: "H09-10",
    appointmentDate: "2024-08-20",
    code: "APPT20240820002",
    type: "CHECKUP",
    status: "UPCOMMING",
  },
  {
    id: 3,
    serviceCenter: {
      id: 103,
      name: "Trung tâm dịch vụ C",
      address: "78 Trần Hưng Đạo, Quận 5, TP.HCM",
    },
    slotTime: "H10-11",
    appointmentDate: "2024-05-01",
    code: "APPT20240501003",
    type: "MAINTENANCE_TYPE",
    status: "EXPIER",
  },
  {
    id: 4,
    serviceCenter: {
      id: 104,
      name: "Trung tâm dịch vụ D",
      address: "9 Phạm Ngũ Lão, Quận 1, TP.HCM",
    },
    slotTime: "H13-14",
    appointmentDate: "2024-10-05",
    code: "APPT20241005004",
    type: "MAINTENANCE_TYPE",
    status: "SUCCESS",
  },
  {
    id: 5,
    serviceCenter: {
      id: 105,
      name: "Trung tâm dịch vụ E",
      address: "200 Lê Văn Lương, Quận 7, TP.HCM",
    },
    slotTime: "H15-16",
    appointmentDate: "2025-01-12",
    code: "APPT20250112005",
    type: "CHECKUP",
    status: "NO_START",
  },
  {
    id: 6,
    serviceCenter: {
      id: 106,
      name: "Trung tâm dịch vụ F",
      address: "54 Điện Biên Phủ, Quận 3, TP.HCM",
    },
    slotTime: "H16-17",
    appointmentDate: "2024-11-30",
    code: "APPT20241130006",
    type: "MAINTENANCE_TYPE",
    status: "CANCELLED",
  },
];

const statusToColor = (status: string) => {
  switch ((status || "").toUpperCase()) {
    case "NO_START":
      return appColor.gray;
    case "UPCOMMING":
      return appColor.warning;
    case "EXPIER":
      return appColor.danger;
    case "SUCCESS":
      return appColor.primary;
    case "CANCELLED":
      return appColor.gray2;
    default:
      return appColor.gray;
  }
};

const formatDate = (s: string) => {
  if (!s) return "-";
  const parts = s.split("-");
  if (parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return s;
};

const ActivityComponent = () => {
  // show first item fully, second item compact, then a "Xem thêm" button
  const first = data[0];
  const second = data[1];
  return (
    <View>
      {first && (
        <TouchableOpacity key={first.id} style={styles.card} activeOpacity={0.9}>
          <RowComponent justify="space-between">
            <View style={{ flex: 1 }}>
              <TextComponent
                text={first.serviceCenter?.name}
                size={16}
                font={fontFamilies.roboto_medium}
                color={appColor.text}
              />
              <TextComponent
                text={first.serviceCenter?.address}
                size={12}
                color={appColor.gray2}
                styles={{ marginTop: 6 }}
              />
              <TextComponent
                text={`Mã: ${first.code}`}
                size={12}
                color={appColor.gray2}
                styles={{ marginTop: 6 }}
              />
            </View>

            <View style={styles.meta}>
              <TextComponent text={formatDate(first.appointmentDate)} size={14} color={appColor.text} />
              <TextComponent text={first.slotTime} size={12} color={appColor.gray2} styles={{ marginTop: 4 }} />
              <View style={[styles.statusBadge, { backgroundColor: statusToColor(first.status) }]}>
                <Text style={styles.statusText}>{first.status}</Text>
              </View>
            </View>
          </RowComponent>
        </TouchableOpacity>
      )}

      {second && (
        <TouchableOpacity key={second.id} style={styles.compact} activeOpacity={0.8}>
          <RowComponent justify="space-between">
            <View style={{ flex: 1 }}>
              <TextComponent text={second.serviceCenter?.name} size={14} color={appColor.text} />
              <TextComponent text={formatDate(second.appointmentDate)} size={12} color={appColor.gray2} styles={{ marginTop: 4 }} />
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <View style={[styles.statusBadgeSmall, { backgroundColor: statusToColor(second.status) }]}>
                <Text style={styles.statusTextSmall}>{second.status}</Text>
              </View>
            </View>
          </RowComponent>
        </TouchableOpacity>
      )}

      <View style={{ marginTop: 8, alignItems: "center" }}>
        <ButtonComponent text="Xem thêm" type="link" onPress={() => console.log('Xem thêm pressed')} />
      </View>
    </View>
  );
};

export default ActivityComponent;

const styles = StyleSheet.create({
  card: {
    backgroundColor: appColor.white,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: appColor.gray,
  },
  compact: {
    backgroundColor: appColor.white,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: appColor.gray,
  },
  meta: {
    alignItems: "flex-end",
    marginLeft: 12,
  },
  statusBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: appColor.white,
    fontSize: 12,
    fontFamily: fontFamilies.roboto_medium,
  },
  statusBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusTextSmall: {
    color: appColor.white,
    fontSize: 11,
    fontFamily: fontFamilies.roboto_medium,
  },
});
