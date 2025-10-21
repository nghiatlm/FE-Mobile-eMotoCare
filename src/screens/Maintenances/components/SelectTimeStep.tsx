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

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

const buildMonthMatrix = (year: number, month: number) => {
  const first = new Date(year, month, 1);
  const firstWeekday = (first.getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - firstWeekday);
  const weeks: (Date | null)[][] = [];
  for (let w = 0; w < 6; w++) {
    const week: (Date | null)[] = [];
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
  const todayIso = isoDate(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const initSelectedDate = state.appointmentDate
    ? new Date(state.appointmentDate)
    : today;
  const initIso = isoDate(
    new Date(
      initSelectedDate.getFullYear(),
      initSelectedDate.getMonth(),
      initSelectedDate.getDate()
    )
  );
  const [currentMonth, setCurrentMonth] = useState(
    new Date(initSelectedDate.getFullYear(), initSelectedDate.getMonth(), 1)
  );
  const selectedIso =
    state.appointmentDate && state.appointmentDate >= todayIso
      ? state.appointmentDate
      : todayIso;

  const weeks = useMemo(
    () => buildMonthMatrix(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth]
  );

  const isSameDay = (a: Date, bIso: string) => isoDate(a) === bIso;
  const inSameMonth = (d: Date, monthDate: Date) =>
    d.getMonth() === monthDate.getMonth() &&
    d.getFullYear() === monthDate.getFullYear();

  const prevMonth = () => {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  };

  return (
    <View>
      <SectionComponent
        styles={{
          alignItems: "center",
          marginTop: 8,
          paddingHorizontal: 12,
        }}
      >
        <TextComponent
          text="Chọn thời gian"
          size={20}
          font={fontFamilies.roboto_medium}
          color={appColor.text}
        />
        <TextComponent
          text="Chọn ngày và khung giờ phù hợp với bạn"
          color={appColor.gray2}
          font={fontFamilies.roboto_regular}
          size={14}
          styles={{ marginTop: 6 }}
        />
      </SectionComponent>

      <SpaceComponent height={12} />

      <SectionComponent styles={{ paddingHorizontal: 12 }}>
        <RowComponent justify="space-between" styles={{ alignItems: "center" }}>
          <RowComponent justify="flex-start">
            <Fontisto name="date" size={20} color={appColor.primary} />
            <TextComponent
              text="Chọn ngày"
              size={18}
              color={appColor.text}
              font={fontFamilies.roboto_regular}
              styles={{ marginLeft: 8 }}
            />
          </RowComponent>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
              <TextComponent text="‹" size={20} color={appColor.text} />
            </TouchableOpacity>
            <TextComponent
              text={currentMonth.toLocaleString("vi-VN", {
                month: "long",
                year: "numeric",
              })}
              size={16}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
              styles={{ marginHorizontal: 8 }}
            />
            <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
              <TextComponent text="›" size={20} color={appColor.text} />
            </TouchableOpacity>
          </View>
        </RowComponent>

        <SpaceComponent height={12} />

        <View style={styles.weekRow}>
          {weekdayLabels.map((w) => (
            <View key={w} style={styles.dayCellHeader}>
              <TextComponent text={w} size={12} color={appColor.gray2} />
            </View>
          ))}
        </View>

        {weeks.map((week, wi) => (
          <View key={wi} style={styles.weekRow}>
            {week.map((d, di) => {
              if (!d) return <View key={di} style={styles.dayCell} />;
              const inMonth = inSameMonth(d, currentMonth);
              const dayIso = isoDate(d);
              const active = isSameDay(d, selectedIso);
              const isToday = dayIso === todayIso;
              const isPast = dayIso < todayIso;

              return (
                <TouchableOpacity
                  key={di}
                  onPress={() => {
                    if (!isPast) {
                      dispatch({
                        type: "SET",
                        payload: { appointmentDate: dayIso },
                      });
                    }
                  }}
                  activeOpacity={isPast ? 1 : 0.8}
                  style={styles.dayCell}
                >
                  <View style={inMonth ? undefined : { opacity: 0.35 }}>
                    <View
                      style={[
                        styles.dayNumberWrap,
                        active ? styles.dayNumberActive : null,
                        isPast ? { opacity: 0.45 } : null,
                      ]}
                    >
                      <TextComponent
                        text={String(d.getDate())}
                        size={14}
                        font={fontFamilies.roboto_medium}
                        color={
                          active
                            ? appColor.white
                            : isPast
                            ? appColor.gray2
                            : appColor.text
                        }
                      />
                    </View>
                    {isToday && !active ? (
                      <View style={styles.todayDot} />
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </SectionComponent>

      <SpaceComponent height={16} />

      <SectionComponent styles={{ paddingHorizontal: 12 }}>
        <RowComponent justify="flex-start">
          <Ionicons name="time-outline" size={20} color={appColor.primary} />
          <TextComponent
            text="Chọn giờ"
            size={18}
            color={appColor.text}
            font={fontFamilies.roboto_regular}
            styles={{ marginLeft: 8 }}
          />
        </RowComponent>
        <SpaceComponent height={12} />
        <View style={styles.slotsWrap}>
          {mockSlots.map((s) => {
            const dateIsPast = selectedIso < todayIso;
            const active = state.slot === s.label && !dateIsPast;
            const disabled = !s.available || dateIsPast;
            return (
              <TouchableOpacity
                key={s.id}
                activeOpacity={disabled ? 1 : 0.8}
                onPress={() =>
                  !disabled &&
                  dispatch({ type: "SET", payload: { slot: s.label } })
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
                  font={fontFamilies.roboto_medium}
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
  navBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dayCellHeader: {
    width: `${100 / 7}%`,
    alignItems: "center",
  },
  dayCell: {
    width: `${100 / 7}%`,
    alignItems: "center",
    paddingVertical: 6,
  },
  dayNumberWrap: {
    width: 34,
    height: 34,
    borderRadius: 34 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  dayNumberActive: {
    backgroundColor: appColor.primary,
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: appColor.primary,
    marginTop: 4,
    alignSelf: "center",
  },
  slotsWrap: {
    paddingHorizontal: 0,
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
    backgroundColor: "#FAFAFA",
    borderColor: "#F0F0F0",
    opacity: 0.6,
  },
});

export default SelectTimeStep;
