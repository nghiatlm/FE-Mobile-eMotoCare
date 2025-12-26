import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  ButtonComponent,
  RowComponent,
  TextComponent,
} from "../../../components";
import { appColor } from "../../../constants/appColor";
import { fontFamilies } from "../../../constants/fontFamilies";
import { getAppointments } from "../../../services/appointment.service";
import { statusActivities, statusColor } from "../../../utils/generateStatus";
import { formatSlotTime } from "../../../utils/formatSlotTime";
import { formatDateDDMMYYYY } from "../../../utils/formatDate";

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

// Format date with weekday: "Thứ 2, 26/12/2025"
const formatDateWithWeekday = (dateString: string): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Fallback to simple format if date is invalid
      return formatDateDDMMYYYY(dateString);
    }
    
    const weekdays = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    const weekday = weekdays[date.getDay()];
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    
    return `${weekday}, ${day}/${month}/${year}`;
  } catch {
    return formatDateDDMMYYYY(dateString);
  }
};

// Format date short: "26/12/2025"
const formatDateShort = (dateString: string): string => {
  if (!dateString) return "-";
  return formatDateDDMMYYYY(dateString).replace(/-/g, "/");
};

interface Props {
  customerId?: string;
  filterCompleted?: boolean; // true = chỉ hiển thị đã hoàn thành, false = chỉ hiển thị chưa hoàn thành
}

const isCompleted = (s?: string) => {
  const t = String(s || "").toUpperCase();
  return t === "SUCCESS" || t === "COMPLETED" || t === "REPAIR_COMPLETED";
};

const ActivityComponent = forwardRef((props: Props, ref) => {
  const { customerId, filterCompleted } = props;
  const navigation = useNavigation<any>();
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetchAppoinments(customerId).then(() => {});
  }, [customerId]);

  useFocusEffect(
    React.useCallback(() => {
      fetchAppoinments(customerId).then(() => {});
    }, [customerId])
  );

  useImperativeHandle(ref, () => ({
    refetch: () => fetchAppoinments(customerId),
  }));

  const fetchAppoinments = async (customerId?: string) => {
    const res = await getAppointments({
      customerId,
      pageIndex: 1,
      pageSize: 5,
    });
    if (res.success) {
      setAppointments(res.data?.rowDatas || []);
    } else {
      console.log("Failed to fetch appointments:", res.message);
    }
  };

  // Filter appointments based on filterCompleted prop
  const filteredAppointments = filterCompleted !== undefined
    ? appointments.filter((item) => {
        const completed = isCompleted(item.status);
        return filterCompleted ? completed : !completed;
      })
    : appointments;
  
  const topAppointments = filteredAppointments.slice(0, 2);

  return (
    <View>
      {topAppointments.map((item, index) => {
        const isFirst = index === 0;
        return (
          <TouchableOpacity
            key={item.id}
            style={isFirst ? styles.card : styles.compact}
            activeOpacity={isFirst ? 0.9 : 0.8}
            onPress={() =>
              navigation.navigate("Appointments", {
                screen: "AppointmentDetail",
                params: { id: item.id },
              })
            }
          >
            <RowComponent justify="space-between">
              <View style={{ flex: 1 }}>
                <TextComponent
                  text={item.serviceCenter?.name}
                  size={isFirst ? 16 : 14}
                  font={fontFamilies.roboto_medium}
                  color={appColor.text}
                />
                {isFirst ? (
                  <>
                    <TextComponent
                      text={item.serviceCenter?.address}
                      size={12}
                      color={appColor.gray2}
                      styles={{ marginTop: 6 }}
                    />
                    <TextComponent
                      text={`Mã: ${item.code}`}
                      size={12}
                      color={appColor.gray2}
                      styles={{ marginTop: 6 }}
                    />
                  </>
                ) : (
                  <TextComponent
                    text={formatDateShort(item.appointmentDate)}
                    size={12}
                    color={appColor.gray2}
                    styles={{ marginTop: 4 }}
                  />
                )}
              </View>

              <View style={isFirst ? styles.meta : { alignItems: "flex-end" }}>
                {isFirst ? (
                  <>
                    <TextComponent
                      text={formatDateWithWeekday(item.appointmentDate)}
                      size={14}
                      color={appColor.text}
                      font={fontFamilies.roboto_medium}
                    />
                    <TextComponent
                      text={formatSlotTime(item.slotTime) || item.slotTime}
                      size={12}
                      color={appColor.gray2}
                      styles={{ marginTop: 4 }}
                    />
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusColor(item.status) },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {statusActivities(item.status)?.label || item.status}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View
                    style={[
                      styles.statusBadgeSmall,
                      { backgroundColor: statusColor(item.status) },
                    ]}
                  >
                    <Text style={styles.statusTextSmall}>
                      {statusActivities(item.status)?.label || item.status}
                    </Text>
                  </View>
                )}
              </View>
            </RowComponent>
          </TouchableOpacity>
        );
      })}
      <View style={{ marginTop: 8, alignItems: "center" }}>
        <ButtonComponent
          text="Xem thêm"
          type="link"
          onPress={() => navigation.navigate("Activities")}
        />
      </View>
    </View>
  );
});

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
