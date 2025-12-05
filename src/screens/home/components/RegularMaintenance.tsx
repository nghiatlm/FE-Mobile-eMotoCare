import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { globalStyle } from "../../../styles/globalStyle";
import { appColor } from "../../../constants/appColor";
import { RowComponent, TextComponent } from "../../../components";
import { fontFamilies } from "../../../constants/fontFamilies";
import { addDays, formatDate, parseDate } from "../../../utils/data.util";

const mockApiData = [
  { id: 1, startDate: "2023-10-12-", endDate: "2023-10-222", status: "EXPIER" },
  { id: 2, startDate: "2024-09-12", endDate: "2024-09-22", status: "SUCCESS" },
  { id: 3, startDate: "2021-01-01", endDate: "2025-01-11", status: "EXPIER" },
  { id: 4, startDate: "2025-03-15", endDate: "2025-03-25", status: "SUCCESS" },
  {
    id: 5,
    startDate: "2025-12-15",
    endDate: "2025-12-25",
    status: "UPCOMMING",
  },
  { id: 6, startDate: "15-08-2026", endDate: "25-08-2025", status: "NO_START" },
];

const rawData = mockApiData;

interface RegularMaintenanceProps {
  navigation?: any;
}

const RegularMaintenance = ({ navigation }: RegularMaintenanceProps) => {
  const data = rawData.map((it) => {
    const item = { ...it } as any;
    if (item.startDate && !item.endDate) {
      try {
        const sd = parseDate(item.startDate);
        const ed = addDays(sd, 10);
        item.endDate = formatDate(ed);
      } catch (e) {}
    }
    return item;
  });

  const initialSelected =
    data.find((item, idx) => {
      const next = data[idx + 1];
      const s = (item.status || "").toUpperCase();
      return (
        (s === "SUCCESS" || s === "UPCOMMING") &&
        next &&
        (next.status || "").toUpperCase() === "NO_START"
      );
    }) || data[0];

  const [selected, setSelected] = useState(initialSelected);

  const statusToColor = (status: string, bg?: boolean) => {
    switch ((status || "").toUpperCase()) {
      case "NO_START":
        return bg ? appColor.white : appColor.gray;
      case "UPCOMMING":
        return bg ? appColor.warning2 : appColor.warning;
      case "EXPIER":
        return bg ? appColor.danger50 : appColor.danger;
      case "SUCCESS":
        return bg ? appColor.success50 : appColor.primary;
      default:
        return appColor.gray;
    }
  };

  const statusToLabel = (status: string) => {
    switch ((status || "").toUpperCase()) {
      case "NO_START":
        return "Chưa bắt đầu";
      case "UPCOMMING":
        return "Sắp tới";
      case "EXPIER":
        return "Đã quá hạn";
      case "SUCCESS":
        return "Hoàn thành";
      default:
        return "Không xác định";
    }
  };

  const computeDaysInfo = (item: any) => {
    if (!item) return null;
    try {
      const now = new Date();
      if (item.startDate && item.endDate) {
        const sd = parseDate(item.startDate);
        const ed = parseDate(item.endDate);
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
      if (item.startDate && !item.endDate) {
        const sd = parseDate(item.startDate);
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
          text={`Lần ${selected?.id ?? "-"}`}
          size={16}
          color={appColor.text}
          font={fontFamilies.roboto_medium}
        />

        {/* Days remaining / overdue */}
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
};

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
