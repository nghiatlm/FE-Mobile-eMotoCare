import { View, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {
  RowComponent,
  SectionComponent,
  TextComponent,
  SpaceComponent,
  ButtonComponent,
} from "../../../components";
import { fontFamilies } from "../../../constants/fontFamilies";
import { appColor } from "../../../constants/appColor";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import { getSlotTime } from "../../../services/serviceCenter.service";
import { formatSlotTime } from "../../../utils/formatSlotTime";

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
  validationError?: string | null;
}

const SelectTimeSlotStep = (props: Props) => {
  const { centerId, onSelectTimeSlot, validationError } = props;
  const [slotTimes, setSlotTimes] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (centerId) fetchSlotTimes();
  }, [centerId]);

  const fetchSlotTimes = async () => {
    setLoading(true);
    try {
      const res = await getSlotTime({ serviceCenterId: centerId });
      if (res.success) {
        const slots = res.data?.servicecenter?.serviceCente?.slot || [];
        setSlotTimes(slots);

        if (slots.length > 0) {
          const today = new Date().toISOString().split("T")[0];
          setSelectedDate(today);
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

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
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

      {/* Calendar Section */}
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
              style={{ padding: 4, borderRadius: 6 }}
            >
              <TextComponent text="‹" size={20} color={appColor.text} />
            </TouchableOpacity>
            <TextComponent
              text={currentMonth.toLocaleString("vi-VN", {
                month: "long",
                year: "numeric",
              })}
              size={14}
              font={fontFamilies.roboto_medium}
              styles={{
                marginHorizontal: 6,
                maxWidth: 140,
                textAlign: "center",
              }}
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
              style={{ padding: 4, borderRadius: 6 }}
            >
              <TextComponent text="›" size={20} color={appColor.text} />
            </TouchableOpacity>
          </RowComponent>
        </RowComponent>

        <SpaceComponent height={12} />

        {/* Day Headers */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
            <View key={d} style={{ width: "14.28%", alignItems: "center" }}>
              <TextComponent text={d} size={12} color={appColor.gray2} />
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
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
                  alignItems: "center",
                  paddingVertical: 6,
                }}
                activeOpacity={disabled ? 1 : 0.7}
              >
                <View
                  style={[
                    {
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      justifyContent: "center",
                      alignItems: "center",
                    },
                    active && {
                      backgroundColor: appColor.primary,
                      borderRadius: 8,
                    },
                    !d.isCurrentMonth && { opacity: 0.35 },
                  ]}
                >
                  <TextComponent
                    text={String(d.day)}
                    size={14}
                    color={
                      active
                        ? appColor.white
                        : isPast(d.date)
                        ? appColor.gray2
                        : appColor.text
                    }
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <SpaceComponent height={16} />
      </SectionComponent>

      {/* Time Slots */}
      {selectedDate && !isPast(selectedDate) && (
        <SectionComponent styles={{ paddingHorizontal: 12 }}>
          <RowComponent justify="flex-start">
            <AntDesign name="clock-circle" size={24} color={appColor.primary} />
            <TextComponent
              text="Chọn giờ"
              size={19}
              color={appColor.text}
              font={fontFamilies.roboto_medium}
              styles={{ marginLeft: 8 }}
            />
          </RowComponent>
          <SpaceComponent height={16} />
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {timeSlotsForSelectedDate.length === 0 ? (
              <TextComponent
                text="Không có khung giờ cho ngày này."
                size={14}
                color={appColor.gray2}
              />
            ) : (
              timeSlotsForSelectedDate.map((x) => {
                const selected = x.slotTime === selectedTime;
                const disabled = x.isActive === false || (x.capacity ?? 0) <= 0;

                return (
                  <TouchableOpacity
                    key={x.id}
                    disabled={disabled}
                    onPress={() => {
                      if (x.isActive) {
                        setSelectedTime(x.slotTime);
                        onSelectTimeSlot?.({ date: selectedDate!, time: x.slotTime });
                      }
                    }}
                    style={[
                      {
                        width: "48%",
                        paddingVertical: 14,
                        borderRadius: 8,
                        borderWidth: 1,
                        marginBottom: 10,
                        alignItems: "center",
                        backgroundColor: selected ? appColor.primary : "#FFF",
                        borderColor: selected ? appColor.primary : "#EEE",
                      },
                      disabled && {
                        backgroundColor: "#F5F5F5",
                        opacity: 0.5,
                      },
                    ]}
                  >
                    <TextComponent
                      text={formatSlotTime(x.slotTime)}
                      size={16}
                      color={
                        disabled
                          ? appColor.gray2
                          : selected
                          ? "#FFF"
                          : appColor.text
                      }
                    />
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </SectionComponent>
      )}

      <SpaceComponent height={20} />

      {validationError && (
        <SectionComponent styles={{ paddingHorizontal: 12 }}>
          <TextComponent
            text={validationError}
            size={14}
            color={appColor.danger}
            styles={{ textAlign: "center" }}
          />
        </SectionComponent>
      )}
    </ScrollView>
  );
};

export default SelectTimeSlotStep;
