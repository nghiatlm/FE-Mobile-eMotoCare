import { View, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {
  RowComponent,
  SectionComponent,
  TextComponent,
  SpaceComponent,
} from "../../../components";
import { fontFamilies } from "../../../constants/fontFamilies";
import { appColor } from "../../../constants/appColor";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import { getSlotTime } from "../../../services/serviceCenter.service";

interface TimeSlot {
  id: string;
  date: string;
  dayOfWeek: string;
  slotTime: string;
  isActive: boolean;
  capacity: number;
}

interface Props {
  centerId: string;
  onSelectTimeSlot?: (data: { date: string; time: string }) => void;
}

const SelectTimeSlotStep = (props: Props) => {
  const { centerId, onSelectTimeSlot } = props;
  const [slotTimes, setSlotTimes] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (centerId) fetchSlotTimes();
  }, [centerId]);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      console.log("Đã chọn lịch:", { date: selectedDate, time: selectedTime });
      onSelectTimeSlot?.({ date: selectedDate, time: selectedTime });
    }
  }, [selectedDate, selectedTime]);

  const fetchSlotTimes = async () => {
    setLoading(true);
    try {
      const res = await getSlotTime({ serviceCenterId: centerId });
      if (res.success) {
        const slots = res.data?.servicecenter?.serviceCente?.slot || [];
        setSlotTimes(slots);

        if (slots.length > 0) {
          setSelectedDate(slots[0].date);
        }
      } else {
        setSlotTimes([]);
      }
    } catch (error) {
      console.log("Error:", error);
      setSlotTimes([]);
    }
    setLoading(false);
  };

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const start = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const prevLast = new Date(year, month, 0).getDate();
    const prev = [];
    for (let i = start - 1; i >= 0; i--) {
      prev.push({
        day: prevLast - i,
        date: new Date(year, month - 1, prevLast - i)
          .toISOString()
          .split("T")[0],
        isCurrentMonth: false,
      });
    }

    const curr = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      curr.push({
        day: i,
        date: new Date(year, month, i).toISOString().split("T")[0],
        isCurrentMonth: true,
      });
    }

    const total = prev.length + curr.length;
    const remain = 42 - total;
    const next = [];
    for (let i = 1; i <= remain; i++) {
      next.push({
        day: i,
        date: new Date(year, month + 1, i).toISOString().split("T")[0],
        isCurrentMonth: false,
      });
    }

    return [...prev, ...curr, ...next];
  };

  const isPast = (dateString: string) => {
    const d = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  };

  const timeSlotsForSelectedDate = selectedDate
    ? slotTimes.filter((x) => x.date === selectedDate)
    : [];

  const formatTime = (slot: string) => {
    const m = slot.match(/H(\d+)_/);
    return m ? `${m[1]}:00` : slot;
  };

  // ————————————————————————————————————————————————————————————
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      {/* 🔹 Calendar Section */}
      <SectionComponent styles={{ marginTop: 10, marginHorizontal: 10 }}>
        <RowComponent styles={{ marginBottom: 12 }}>
          <Fontisto name="calendar" size={16} color={appColor.primary} />
          <TextComponent
            text="Chọn ngày"
            size={15}
            font={fontFamilies.roboto_medium}
            styles={{ marginLeft: 6 }}
          />
        </RowComponent>

        <View
          style={{
            backgroundColor: appColor.white,
            borderRadius: 14,
            padding: 16,
            borderWidth: 1,
            borderColor: "#EDEDED",
          }}
        >
          {/* 🔸 Month Header */}
          <RowComponent justify="space-between">
            <TouchableOpacity
              onPress={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1
                  )
                )
              }
            >
              <AntDesign name="left" size={18} color={appColor.primary} />
            </TouchableOpacity>

            <View style={{ alignItems: "center" }}>
              <TextComponent
                text={currentMonth.toLocaleString("vi-VN", { month: "long" })}
                size={15}
                font={fontFamilies.roboto_medium}
              />
              <TextComponent
                text={String(currentMonth.getFullYear())}
                size={12}
                color={appColor.gray2}
              />
            </View>

            <TouchableOpacity
              onPress={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1
                  )
                )
              }
            >
              <AntDesign name="right" size={18} color={appColor.primary} />
            </TouchableOpacity>
          </RowComponent>

          {/* 🔸 Day Headers */}
          <RowComponent
            justify="space-between"
            styles={{ marginVertical: 10, paddingHorizontal: 4 }}
          >
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
              <TextComponent
                key={d}
                text={d}
                size={11}
                color={appColor.gray2}
                font={fontFamilies.roboto_regular}
              />
            ))}
          </RowComponent>

          {/* 🔸 Calendar Grid */}
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {getCalendarDays().map((d, idx) => {
              const disabled = !d.isCurrentMonth || isPast(d.date);
              const active = d.date === selectedDate;

              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    if (!disabled) {
                      setSelectedDate(d.date);
                      setSelectedTime(null);
                    }
                  }}
                  disabled={disabled}
                  style={{
                    width: "14.28%",
                    aspectRatio: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      backgroundColor: active
                        ? appColor.primary
                        : "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TextComponent
                      text={String(d.day)}
                      size={13}
                      color={
                        active
                          ? appColor.white
                          : disabled
                          ? appColor.gray3
                          : appColor.text
                      }
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </SectionComponent>

      {/* 🔹 Time Slots */}
      {selectedDate && !isPast(selectedDate) && (
        <SectionComponent styles={{ marginTop: 12, marginHorizontal: 10 }}>
          <RowComponent styles={{ marginBottom: 12 }}>
            <Fontisto name="clock" size={16} color={appColor.primary} />
            <TextComponent
              text="Chọn giờ"
              size={15}
              font={fontFamilies.roboto_medium}
              styles={{ marginLeft: 6 }}
            />
          </RowComponent>

          <View
            style={{
              backgroundColor: appColor.white,
              borderRadius: 14,
              padding: 16,
              borderWidth: 1,
              borderColor: "#EDEDED",
            }}
          >
            {timeSlotsForSelectedDate.length === 0 ? (
              <TextComponent
                text="Không có lịch khả dụng"
                color={appColor.gray2}
                size={13}
                styles={{ textAlign: "center" }}
              />
            ) : (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {timeSlotsForSelectedDate.map((x) => {
                  const selected = x.slotTime === selectedTime;

                  return (
                    <TouchableOpacity
                      key={x.id}
                      onPress={() => x.isActive && setSelectedTime(x.slotTime)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 10,
                        minWidth: "28%",
                        borderWidth: 1,
                        borderColor: selected ? appColor.primary : "#E5E5E5",
                        backgroundColor: selected
                          ? appColor.primary
                          : appColor.white,
                        opacity: x.isActive ? 1 : 0.4,
                        alignItems: "center",
                      }}
                    >
                      <TextComponent
                        text={formatTime(x.slotTime)}
                        size={12}
                        font={fontFamilies.roboto_medium}
                        color={selected ? appColor.white : appColor.text}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </SectionComponent>
      )}

      <SpaceComponent height={20} />
    </ScrollView>
  );
};

export default SelectTimeSlotStep;
