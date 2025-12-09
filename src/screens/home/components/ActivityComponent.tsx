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

interface Props {
  customerId?: string;
}

const ActivityComponent = forwardRef((props: Props, ref) => {
  const { customerId } = props;
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

  const topAppointments = appointments.slice(0, 2);

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
                    text={formatDate(item.appointmentDate)}
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
                      text={formatDate(item.appointmentDate)}
                      size={14}
                      color={appColor.text}
                    />
                    <TextComponent
                      text={item.slotTime}
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
