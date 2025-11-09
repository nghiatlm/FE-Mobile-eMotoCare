import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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
import useAppointmentHub from "../../../hooks/useAppointmentHub.hook";
import { getAppointmentDetail } from "../../../services/appointment.service";

const WaitConfirm = ({ navigation, route }: any) => {
  const { id } = route.params;
  const dispatch = useDispatch();
  const { status, description } = useAppointmentHub(id);
  const [isHandled, setIsHandled] = useState(false);
  const [appointmentStatus, setAppointmentStatus] = useState<string | null>(
    null
  );

  // Khi appointment được APPROVED -> mark logged in success (không điều hướng đến SuccessScreen)
  useEffect(() => {
    if (status && !isHandled) {
      console.log("📡 Appointment status:", status);

      if (status === "APPROVED") {
        setIsHandled(true);

        // TODO: đổi tên action / payload theo reducer của bạn
        dispatch({
          type: "AUTH_SET_LOGGED_IN",
          payload: {
            isLoggedIn: true,
          },
        });

        // Optional: hiển thị thông báo hoặc redirect đến Home
        // navigation.navigate("Home");
      }
    }
  }, [status, isHandled, id, navigation, dispatch]);

  useEffect(() => {
    fetchAppoinment(id);
  }, [id]);

  const fetchAppoinment = async (id: string) => {
    try {
      const res = await getAppointmentDetail(id);
      if (res.success) {
        if (res.data?.status) {
          setAppointmentStatus(res.data.status);
        }
      }
    } catch (e) {
      console.warn("fetchAppointment error", e);
    }
  };

  const isPending = appointmentStatus === "PENDING" || status === "PENDING";
  const isCanceled =
    status === "CANNCELED" ||
    status === "CANCELED" ||
    appointmentStatus === "CANNCELED" ||
    appointmentStatus === "CANCELED";

  return (
    <BackgroundComponent back isScroll title="Đặt lịch bảo dưỡng">
      {isPending && (
        <SectionComponent>
          <TextComponent
            text="Chờ Xác nhận"
            title
            flex={1}
            styles={{ textAlign: "center", marginTop: 50 }}
          />
          <TextComponent
            text={
              description ??
              "Đang đợi xác nhận, vui lòng chờ trong giây lát..."
            }
            styles={{ textAlign: "center", marginTop: 20 }}
            size={18}
            font={fontFamilies.roboto_regular}
            color={appColor.text}
          />
        </SectionComponent>
      )}

      {status === "APPROVED" && (
        <SectionComponent>
          <TextComponent
            text="Yêu cầu đã được chấp nhận — bạn đã đăng nhập thành công."
            size={14}
            font={fontFamilies.roboto_medium}
            color={appColor.primary}
          />
        </SectionComponent>
      )}

      {isCanceled && (
        <SectionComponent>
          <TextComponent
            text="Yêu cầu của bạn đã bị từ chối."
            size={14}
            font={fontFamilies.roboto_medium}
            color={appColor.primary}
          />
        </SectionComponent>
      )}

      <SpaceComponent height={20} />

      <SectionComponent styles={{ paddingHorizontal: 8 }}>
        <RowComponent justify="center" styles={{ alignItems: "center" }}>
          <ButtonComponent
            text="Trang chủ"
            styles={{ width: "45%", marginRight: 5 }}
            onPress={() => navigation.navigate("Home")}
          />
          <ButtonComponent
            text="Xem chi tiết"
            styles={{ width: "45%", marginLeft: 5 }}
            onPress={() => navigation.navigate("AppointmentDetail", { id })}
          />
        </RowComponent>
      </SectionComponent>

      <SpaceComponent height={16} />
    </BackgroundComponent>
  );
};
export default WaitConfirm;
