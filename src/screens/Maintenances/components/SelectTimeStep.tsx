import React, { useEffect, useMemo, useState } from "react";
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
import { getServiceCenterSlots } from "../../../services/serviceCenter.service";

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

// helper: convert slotTime like "H07_08" -> "07:00 - 08:00"
// or use startTime/endTime if present
const slotTimeToLabel = (s: any) => {
  const start = (s?.startTime || "").trim();
  const end = (s?.endTime || "").trim();
  if (start && end) return `${start} - ${end}`;

  const st = (s?.slotTime || "").trim();
  // pattern H07_08 or H7_8
  const m = st.match(/H?0?(\d{1,2})[_\-]0?(\d{1,2})/i);
  if (m) {
    const a = m[1].padStart(2, "0");
    const b = m[2].padStart(2, "0");
    return `${a}:00 - ${b}:00`;
  }

  // fallback: use provided label or id
  return s?.label || s?.name || st || "—";
};

const SelectTimeStep = ({ state, dispatch, center }: any) => {
  const today = new Date();
  const todayIso = isoDateLocal(today);
  let initDate = state.appointmentDate
    ? parseIsoToLocalDate(state.appointmentDate)
    : today;

  // ensure initial appointmentDate is not in the past
  if (state.appointmentDate && state.appointmentDate < todayIso) {
    dispatch?.({ type: "SET", payload: { appointmentDate: todayIso } });
    initDate = today;
  }

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

  const [slots, setSlots] = useState<any[]>([]);

  useEffect(() => {
    const centerId =
      center?.id || center?.serviceCenterId || center?.serviceCenter?.id;
    console.log("Fetch slots for centerId:", centerId);
    if (centerId) {
      getSlot(centerId);
    } else {
      setSlots([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center]);

  const getSlot = async (centerId: string) => {
    try {
      const res = await getServiceCenterSlots(centerId);
      if (res?.success) {
        const data = res.data || {};

        // normalize slots from many possible shapes
        let s: any[] = [];

        // common shapes
        if (Array.isArray(data?.slots)) s = data.slots;
        else if (Array.isArray(data?.slot)) s = data.slot;
        else if (Array.isArray(data?.serviceCente?.slot)) s = data.serviceCente.slot;
        else if (Array.isArray(data?.servicecenter?.serviceCente?.slot))
          s = data.servicecenter.serviceCente.slot;
        else if (Array.isArray(data?.servicecenter?.slot))
          s = data.servicecenter.slot;
        else if (Array.isArray(data?.servicecenter?.serviceCenter?.slot))
          s = data.servicecenter.serviceCenter.slot;
        else if (data?.servicecenter && Array.isArray(data.servicecenter.serviceCente?.slot))
          s = data.servicecenter.serviceCente.slot;

        // deep search fallback: try to find first array inside object tree that looks like slots
        if (!s.length) {
          const findSlots = (obj: any): any[] | null => {
            if (!obj || typeof obj !== "object") return null;
            for (const key of Object.keys(obj)) {
              const val = obj[key];
              if (Array.isArray(val) && val.length && typeof val[0] === "object") return val;
              if (typeof val === "object") {
                const nested = findSlots(val);
                if (nested) return nested;
              }
            }
            return null;
          };
          const found = findSlots(data);
          s = found || [];
        }

        // ensure array
        setSlots(Array.isArray(s) ? s : []);
      } else {
        setSlots([]);
      }
    } catch (error) {
      console.warn("getSlot error", error);
      setSlots([]);
    }
  };

  const isSameDay = (a: Date, bIso: string) => isoDateLocal(a) === bIso;
  const inSameMonth = (d: Date, monthDate: Date) =>
    d.getMonth() === monthDate.getMonth() &&
    d.getFullYear() === monthDate.getFullYear();

  // compute slots for selected day only — strict match by slot.date only
  const daySlots = useMemo(() => {
    if (!selectedIso || !slots?.length) return [];

    const normalizeSlotDate = (s: any) => {
      const raw = s?.date || s?.Date || s?.day;
      if (!raw) return "";
      // if already yyyy-mm-dd
      if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
      // try parse and convert to local yyyy-mm-dd
      const d = new Date(raw);
      if (isNaN(d.getTime())) return "";
      const offset = d.getTimezoneOffset() * 60000;
      const local = new Date(d.getTime() - offset);
      return local.toISOString().split("T")[0];
    };

    const matched = slots.filter((s: any) => {
      const sd = normalizeSlotDate(s);
      return sd === selectedIso;
    });

    // sort by startTime or by slotTime numeric part
    matched.sort((a: any, b: any) => {
      const ta = (a?.startTime || a?.slotTime || "").trim();
      const tb = (b?.startTime || b?.slotTime || "").trim();
      if (!ta && !tb) return 0;
      if (!ta) return 1;
      if (!tb) return -1;
      return ta.localeCompare(tb, undefined, { numeric: true });
    });

    return matched;
  }, [selectedIso, slots]);

  // label for slot: prefer startTime/endTime or map slotTime
  const slotLabel = (s: any) => slotTimeToLabel(s);

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
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((w) => (
            <View key={w} style={styles.dayCellHeader}>
              <TextComponent text={w} size={12} color={appColor.gray2} />
            </View>
          ))}
        </View>

        {/* ---- Ngày (mỗi tuần một hàng) ---- */}
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
                      payload: { appointmentDate: dayIso, timeSlot: "" },
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

        <SpaceComponent height={16} />
      </SectionComponent>

      {/* ---- Chọn giờ ---- */}
      <SectionComponent styles={{ paddingHorizontal: 12 }}>
        <RowComponent justify="flex-start">
          <Ionicons name="time-outline" size={24} color={appColor.primary} />
          <TextComponent
            text="Chọn giờ"
            size={19}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
            styles={{ marginLeft: 8 }}
          />
        </RowComponent>
        <SpaceComponent height={16} />
        <View style={styles.slotsWrap}>
          {daySlots.length === 0 ? (
            <TextComponent
              text="Không có khung giờ cho ngày này."
              size={14}
              color={appColor.gray2}
            />
          ) : (
            daySlots.map((s: any) => {
              const label = slotLabel(s);

              // compute canonical slot code (H07_08) if provided or derive from label/startTime
              const slotCode =
                s?.slotTime ||
                (() => {
                  // try derive from startTime/endTime like "07:00 - 08:00"
                  const m = label.match(/(\d{1,2}):\d{2}/g);
                  if (m && m.length >= 2) {
                    const a = m[0].slice(0, 2).padStart(2, "0");
                    const b = m[1].slice(0, 2).padStart(2, "0");
                    return `H${a}_${b}`;
                  }
                  return s?.id || label;
                })();

              const active =
                state.slotTime === slotCode || state.timeSlot === label;
              const disabled = s.isActive === false || (s.capacity ?? 0) <= 0;

              return (
                <TouchableOpacity
                  key={s.id || slotCode}
                  disabled={disabled}
                  onPress={() =>
                    // store both user-facing label and canonical code
                    dispatch({
                      type: "SET",
                      payload: {
                        timeSlot: label,      // used for UI
                        slotTime: slotCode,   // canonical value to submit (H07_08)
                        selectedSlotId: s.id,
                        appointmentDate: selectedIso,
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
                    text={label}
                    size={16}
                    color={disabled ? appColor.gray2 : active ? "#FFF" : appColor.text}
                  />
                </TouchableOpacity>
              );
            })
          )}
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
