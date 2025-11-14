import React from "react";
import {
  BackgroundComponent,
  TextComponent,
  SpaceComponent,
} from "../../components";
import { fontFamilies } from "../../constants/fontFamilies";
import ActivityComponent from "../home/components/ActivityComponent";

const demoActivities = [
  {
    id: "1",
    type: "MANTENANCE_TYPE",
    serviceCenter: { name: "Trung tâm A" },
    appointmentDate: new Date().toISOString(),
    slotTime: "8_10",
    status: "PENDING",
  },
  {
    id: "2",
    type: "REPAIR_TYPE",
    serviceCenter: { name: "Cơ sở Sửa xe B" },
    appointmentDate: new Date().toISOString(),
    slotTime: "10_12",
    status: "ACTIVE",
  },
  {
    id: "3",
    type: "WARRANTY_TYPE",
    serviceCenter: { name: "Trung tâm C" },
    appointmentDate: new Date().toISOString(),
    slotTime: "13_15",
    status: "COMPLETED",
  },
  {
    id: "4",
    type: "MANTENANCE_TYPE",
    serviceCenter: { name: "Xưởng D" },
    appointmentDate: new Date().toISOString(),
    slotTime: "15_17",
    status: "SUCCESS",
  },
];

const isCompleted = (s?: string) => {
  const t = String(s || "").toUpperCase();
  return t === "SUCCESS" || t === "COMPLETED";
};

const ActivityScreen = () => {
  const ongoing = demoActivities.filter((a) => !isCompleted(a.status));
  const completed = demoActivities.filter((a) => isCompleted(a.status));

  return (
    <BackgroundComponent title="Hoạt động" back isScroll>
      <TextComponent text="Đang diễn ra" size={18} font={fontFamilies.roboto_bold} />
      <SpaceComponent height={8} />
      <ActivityComponent activities={ongoing} loading={false} />

      <SpaceComponent height={16} />
      <TextComponent text="Đã hoàn thành" size={18} font={fontFamilies.roboto_bold} />
      <SpaceComponent height={8} />
      <ActivityComponent activities={completed} loading={false} />
    </BackgroundComponent>
  );
};

export default ActivityScreen;
