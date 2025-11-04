import React, { useEffect } from "react";
import {
  BackgroundComponent,
  ButtonComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../../components";
import { appColor } from "../../../constants/appColor";
import { fontFamilies } from "../../../constants/fontFamilies";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { appInfor } from "../../../constants/appInfor";
import { useSelector } from "react-redux";
import { authSelecter } from "../../../redux/reducers/authReducer";

const WaitConfirm = ({ navigation, route }: any) => {
  const { id } = route.params;
  const auth = useSelector(authSelecter);

  useEffect(() => {
    const token =
      auth?.token ||
      auth?.accessToken ||
      auth?.accountResponse?.accessToken ||
      "";

    if (!token) {
      console.warn("SignalR: no auth token available for negotiation");
    }

    const hubUrl = `${appInfor.BASE_URL.replace(/\/$/, "")}/hubs/appointment`;

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
      })
      .configureLogging(LogLevel.Information)
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("Connected to SignalR");

        try {
          await connection.invoke("JoinAppointmentRoom", id);
        } catch (invokeErr) {
          console.log("JoinAppointmentRoom failed:", invokeErr);
        }

        connection.on("AppointmentConfirmed", (data) => {
          console.log("Appointment confirmed:", data);
          navigation.navigate("SuccessScreen", {
            appointmentId: data.appointmentId,
          });
        });
      } catch (err) {
        console.log("SignalR connection start failed:", err);
      }
    };

    startConnection();

    return () => {
      connection.stop().catch((e) => console.log("SignalR stop error:", e));
    };
  }, [id, navigation, auth]);

  return (
    <BackgroundComponent back isScroll title="Đặt lịch bảo dưỡng">
      <SectionComponent>
        <TextComponent text="Chờ Xác nhận" title />
        <TextComponent
          text="Đang đợi xác nhận, vui lòng chờ trong giây lát"
          size={18}
          font={fontFamilies.roboto_medium}
          color={appColor.text}
        />
      </SectionComponent>
      <SpaceComponent height={20} />
      <SectionComponent>
        <RowComponent>
          <ButtonComponent text="Trang chủ" />
          <ButtonComponent text="Xem chi tiết" />
        </RowComponent>
      </SectionComponent>
    </BackgroundComponent>
  );
};

export default WaitConfirm;
