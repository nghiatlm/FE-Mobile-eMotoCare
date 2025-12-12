import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { RowComponent, TextComponent } from "../../../components";
import { appColor } from "../../../constants/appColor";
import { fontFamilies } from "../../../constants/fontFamilies";
import { getVehicleStages } from "../../../services/vehicleStage.service";
import { globalStyle } from "../../../styles/globalStyle";
import { addDays, formatDate, parseDate } from "../../../utils/data.util";

interface RegularMaintenanceProps {
  navigation?: any;
  vehicleId: string;
}

const RegularMaintenance = forwardRef((props: RegularMaintenanceProps, ref) => {
  const { navigation, vehicleId } = props;
  const [vehicleStages, setVehicleStages] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    const params = {
      page: 1,
      pageSize: 10,
      vehicleId: vehicleId,
    };
    const res = await getVehicleStages(params);
    if (res.success) {
      setVehicleStages(res.data.rowDatas);
      console.log("Vehicle stages fetched:", res.data.rowDatas);
    } else {
      setVehicleStages([]);
    }
  }, [vehicleId]);

  useEffect(() => {
    fetchData();
  }, [vehicleId, fetchData]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  useImperativeHandle(ref, () => ({
    refetch: fetchData,
  }));

  const data = vehicleStages.map((it) => {
    const item = { ...it } as any;
    if (item.expectedStartDate && !item.expectedEndDate) {
      try {
        const sd = parseDate(item.expectedStartDate);
        const ed = addDays(sd, 10);
        item.expectedEndDate = formatDate(ed);
      } catch (e) {
        console.log("Error parsing date:", e);
      }
    }
    return item;
  });

  const [selected, setSelected] = useState<any>(null);

  // Calculate initial selected item
  useEffect(() => {
    if (data.length > 0) {
      const initialSelected =
        data.find((item, idx) => {
          const next = data[idx + 1];
          const s = (item.status || "").toUpperCase();
          return (
            (s === "SUCCESS" || s === "UPCOMING") &&
            next &&
            (next.status || "").toUpperCase() === "NO_START"
          );
        }) || data[0];
      setSelected(initialSelected);
    }
  }, [vehicleStages]);

  const statusToColor = (status: string, bg?: boolean) => {
    switch ((status || "").toUpperCase()) {
      case "NO_START":
        return bg ? appColor.white : appColor.gray;
      case "UPCOMING":
        return bg ? appColor.warning2 : appColor.warning;
      case "EXPIRED":
        return bg ? appColor.danger50 : appColor.danger;
      case "COMPLETED":
        return bg ? appColor.success50 : appColor.primary;
      default:
        return appColor.gray;
    }
  };

  const statusToLabel = (status: string) => {
    switch ((status || "").toUpperCase()) {
      case "NO_START":
        return "Chưa bắt đầu";
      case "UPCOMING":
        return "Sắp tới";
      case "EXPIER":
        return "Đã quá hạn";
      case "COMPLETED":
        return "Hoàn thành";
      default:
        return "Không xác định";
    }
  };

  const computeDaysInfo = (item: any) => {
    if (!item) return null;
    try {
      const now = new Date();
      if (item.expectedStartDate && item.expectedEndDate) {
        const sd = parseDate(item.expectedStartDate);
        const ed = parseDate(item.expectedEndDate);
        if (now < sd) {
          const diff = Math.ceil(
            (sd.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
          );
          return { type: "untilStart", days: diff };
        }
        if (now >= sd && now <= ed) {
          const diff = Math.ceil(
            (ed.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
          );
          return { type: "untilEnd", days: diff };
        }
        const diff = Math.floor(
          (now.getTime() - ed.getTime()) / (24 * 60 * 60 * 1000)
        );
        return { type: "overdue", days: diff };
      }
      if (item.expectedStartDate && !item.expectedEndDate) {
        const sd = parseDate(item.expectedStartDate);
        if (now < sd) {
          const diff = Math.ceil(
            (sd.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
          );
          return { type: "untilStart", days: diff };
        }
        const diff = Math.floor(
          (now.getTime() - sd.getTime()) / (24 * 60 * 60 * 1000)
        );
        return { type: "overdue", days: diff };
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const daysInfo = computeDaysInfo(selected);

  return (
    <View style={[globalStyle.container]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {data.map((item, idx) => {
          const isSelected = selected?.id === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.itemWrapper}
              onPress={() => setSelected(item)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.pill,
                  { backgroundColor: statusToColor(item.status) },
                  isSelected ? styles.pillSelected : null,
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (navigation) {
            navigation.navigate("Maintenances", {
              screen: "MaintenanceDetail",
              params: { id: selected?.id },
            });
          }
        }}
        style={{
          padding: 12,
          gap: 8,
          backgroundColor: statusToColor(selected?.status || "", true),
          marginTop: 12,
          borderRadius: 8,
        }}
      >
        <TextComponent
          text={selected?.maintenanceStage?.name || "Không xác định"}
          size={16}
          color={appColor.text}
          font={fontFamilies.roboto_medium}
        />

        {/* Days remaining / overdue */}
        {selected?.status?.toUpperCase() !== "COMPLETED" ? (
          <RowComponent justify="flex-start">
            <TextComponent
              text="Thời gian: "
              size={16}
              color={appColor.text}
              font={fontFamilies.roboto_medium}
            />
            <TextComponent
              text={
                daysInfo
                  ? daysInfo.type === "overdue"
                    ? `Đã quá ${daysInfo.days} ngày`
                    : `Còn ${daysInfo.days} ngày`
                  : "-"
              }
              size={16}
              color={
                daysInfo && daysInfo.type === "overdue"
                  ? appColor.danger
                  : appColor.primary
              }
            />
          </RowComponent>
        ) : null}

        <RowComponent justify="flex-start">
          <TextComponent
            text="Trạng thái: "
            size={16}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
          />
          <TextComponent
            text={statusToLabel(selected?.status || "")}
            size={16}
            color={appColor.text}
          />
        </RowComponent>
      </TouchableOpacity>
    </View>
  );
});

export default RegularMaintenance;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 8,
  },
  pill: {
    minWidth: 50,
    height: 24,
    borderRadius: 8,
    marginRight: 8,
  },
  itemWrapper: {
    alignItems: "center",
    marginRight: 4,
  },
  pillSelected: {
    borderWidth: 2,
    borderColor: appColor.primary,
  },
  indexCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: appColor.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  indexText: {
    color: appColor.white,
    fontSize: 12,
  },
});
