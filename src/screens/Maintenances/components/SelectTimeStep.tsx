import React, { useMemo, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import {
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../../components";
import { fontFamilies } from "../../../constants/fontFamilies";
import { appColor } from "../../../constants/appColor";
import { Fontisto, Ionicons } from "@expo/vector-icons";

const mockSlots = [
  { id: "s1", label: "08:00", available: true },
  { id: "s2", label: "09:00", available: true },
  { id: "s3", label: "10:00", available: false },
  { id: "s4", label: "14:00", available: true },
  { id: "s5", label: "15:00", available: false },
  { id: "s6", label: "16:00", available: true },
];

const weekdayLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// ✅ Lấy YYYY-MM-DD mà không bị lệch múi giờ
const isoDateLocal = (d: Date) => {
  const offset = d.getTimezoneOffset() * 60000;
  const local = new Date(d.getTime() - offset);
  return local.toISOString().split("T")[0];
};

const parseIsoToLocalDate = (isoYmd: string) => {
  const [y, m, d] = isoYmd.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const buildMonthMatrix = (year: number, month: number) => {
  const first = new Date(year, month, 1);
  const firstWeekday = (first.getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - firstWeekday);
  const weeks: Date[][] = [];
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      const cur = new Date(startDate);
      cur.setDate(startDate.getDate() + w * 7 + d);
      week.push(cur);
    }
    weeks.push(week);
  }
  return weeks;
};

const SelectTimeStep = ({ state, dispatch }: any) => {
  const today = new Date();
  const todayIso = isoDateLocal(today);
  const initDate = state.appointmentDate
    ? parseIsoToLocalDate(state.appointmentDate)
    : today;

  const [currentMonth, setCurrentMonth] = useState(
    new Date(initDate.getFullYear(), initDate.getMonth(), 1)
  );

  const selectedIso = useMemo(() => {
    return state.appointmentDate || todayIso;
  }, [state.appointmentDate]);

  const weeks = useMemo(
    () => buildMonthMatrix(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth]
  );

  const isSameDay = (a: Date, bIso: string) => isoDateLocal(a) === bIso;
  const inSameMonth = (d: Date, monthDate: Date) =>
    d.getMonth() === monthDate.getMonth() &&
    d.getFullYear() === monthDate.getFullYear();

  return (
    <View>
      {/* ---- Header ---- */}
      <SectionComponent
        styles={{ alignItems: "center", marginTop: 8, paddingHorizontal: 12 }}
      >
        <TextComponent
          text="Chọn thời gian"
          size={20}
          font={fontFamilies.roboto_medium}
          color={appColor.text}
        />
        <TextComponent
          text="Chọn ngày và khung giờ phù hợp"
          color={appColor.gray2}
          font={fontFamilies.roboto_regular}
          size={14}
          styles={{ marginTop: 6 }}
        />
      </SectionComponent>

      <SpaceComponent height={12} />

      {/* ---- Chọn ngày ---- */}
      <SectionComponent styles={{ paddingHorizontal: 12 }}>
        <RowComponent justify="space-between">
          <RowComponent>
            <Fontisto name="date" size={20} color={appColor.primary} />
            <TextComponent
              text="Chọn ngày"
              size={18}
              color={appColor.text}
              styles={{ marginLeft: 8 }}
            />
          </RowComponent>
          <RowComponent>
            <TouchableOpacity
              onPress={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1,
                    1
                  )
                )
              }
              style={styles.navBtn}
            >
              <TextComponent text="‹" size={20} color={appColor.text} />
            </TouchableOpacity>
            <TextComponent
              text={currentMonth.toLocaleString("vi-VN", {
                month: "long",
                year: "numeric",
              })}
              size={16}
              font={fontFamilies.roboto_medium}
              styles={{ marginHorizontal: 8 }}
            />
            <TouchableOpacity
              onPress={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                    1
                  )
                )
              }
              style={styles.navBtn}
            >
              <TextComponent text="›" size={20} color={appColor.text} />
            </TouchableOpacity>
          </RowComponent>
        </RowComponent>

        <SpaceComponent height={12} />

        {/* ---- Header thứ ---- */}
        <View style={styles.weekRow}>
          {weekdayLabels.map((w) => (
            <View key={w} style={styles.dayCellHeader}>
              <TextComponent text={w} size={12} color={appColor.gray2} />
            </View>
          ))}
        </View>

        {/* ---- Ngày ---- */}
        {weeks.map((week, wi) => (
          <View key={wi} style={styles.weekRow}>
            {week.map((d, di) => {
              const inMonth = inSameMonth(d, currentMonth);
              const dayIso = isoDateLocal(d);
              const active = isSameDay(d, selectedIso);
              const isPast = dayIso < todayIso;
              return (
                <TouchableOpacity
                  key={di}
                  onPress={() =>
                    !isPast &&
                    dispatch({
                      type: "SET",
                      payload: { appointmentDate: dayIso },
                    })
                  }
                  style={styles.dayCell}
                  activeOpacity={isPast ? 1 : 0.7}
                >
                  <View
                    style={[
                      styles.dayNumberWrap,
                      active && styles.dayNumberActive,
                      !inMonth && { opacity: 0.35 },
                    ]}
                  >
                    <TextComponent
                      text={String(d.getDate())}
                      size={14}
                      color={
                        active
                          ? appColor.white
                          : isPast
                          ? appColor.gray2
                          : appColor.text
                      }
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </SectionComponent>

      <SpaceComponent height={16} />

      {/* ---- Chọn giờ ---- */}
      <SectionComponent styles={{ paddingHorizontal: 12 }}>
        <RowComponent>
          <Ionicons name="time-outline" size={20} color={appColor.primary} />
          <TextComponent text="Chọn giờ" size={18} styles={{ marginLeft: 8 }} />
        </RowComponent>
        <SpaceComponent height={12} />
        <View style={styles.slotsWrap}>
          {mockSlots.map((s) => {
            const active = state.timeSlot === s.label;
            const disabled = !s.available;
            return (
              <TouchableOpacity
                key={s.id}
                disabled={disabled}
                onPress={() =>
                  dispatch({
                    type: "SET",
                    payload: {
                      timeSlot: s.label,
                      appointmentDate: state.appointmentDate,
                    },
                  })
                }
                style={[
                  styles.slot,
                  {
                    backgroundColor: active ? appColor.primary : "#FFF",
                    borderColor: active ? appColor.primary : "#EEE",
                  },
                  disabled && styles.slotDisabled,
                ]}
              >
                <TextComponent
                  text={s.label}
                  size={16}
                  color={
                    disabled ? appColor.gray2 : active ? "#FFF" : appColor.text
                  }
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </SectionComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  navBtn: { padding: 4, borderRadius: 6 },
  weekRow: { flexDirection: "row", justifyContent: "space-between" },
  dayCellHeader: { width: `${100 / 7}%`, alignItems: "center" },
  dayCell: { width: `${100 / 7}%`, alignItems: "center", paddingVertical: 6 },
  dayNumberWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  dayNumberActive: { backgroundColor: appColor.primary },
  slotsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  slot: {
    width: "48%",
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    alignItems: "center",
  },
  slotDisabled: {
    backgroundColor: "#F5F5F5",
    opacity: 0.5,
  },
});

export default SelectTimeStep;
