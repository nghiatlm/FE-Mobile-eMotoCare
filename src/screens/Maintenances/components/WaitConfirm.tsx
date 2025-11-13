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
import { Image, View } from "react-native";

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
        setAppointmentStatus(status);

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
        <SectionComponent styles={{ alignItems: "center", paddingVertical: 30 }}>
          <TextComponent
            text="Đang chờ xác nhận"
            title
            flex={1}
            styles={{ textAlign: "center", marginTop: 12 }}
          />
          <TextComponent
            text={description ?? "Đang đợi xác nhận, vui lòng chờ trong giây lát..."}
            styles={{ textAlign: "center", marginTop: 12 }}
            size={16}
            font={fontFamilies.roboto_regular}
            color={appColor.text}
          />
        </SectionComponent>
      )}

      {status === "APPROVED" && (
        <SectionComponent styles={{ alignItems: "center", paddingVertical: 20 }}>
          <Image
            source={require("../../../assets/images/check-success.png")}
            style={{ height: 140, width: 180, resizeMode: "contain", marginTop: 20 }}
          />
          <TextComponent
            text="Đã xác nhận"
            title
            font={fontFamilies.roboto_medium}
            color={appColor.primary}
            styles={{ textAlign: "center", marginTop: 18 }}
          />
          <TextComponent
            text="Đặt lịch thành công! Bạn có thể quay về trang chủ hoặc xem chi tiết lịch hẹn."
            size={14}
            font={fontFamilies.roboto_regular}
            color={appColor.text}
            styles={{ textAlign: "center", marginTop: 8 }}
          />
        </SectionComponent>
      )}

      {isCanceled && (
        <SectionComponent styles={{ alignItems: "center", paddingVertical: 20 }}>
          <TextComponent
            text="Yêu cầu của bạn đã bị từ chối."
            size={16}
            font={fontFamilies.roboto_medium}
            color={appColor.danger}
            styles={{ textAlign: "center" }}
          />
        </SectionComponent>
      )}

      <SpaceComponent height={18} />

      <SectionComponent styles={{ paddingHorizontal: 12 }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <ButtonComponent
              text="Trang chủ"
              type="primary"
              styles={{ width: "100%" }}
              onPress={() => navigation.navigate("HomeScreen")}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <ButtonComponent
              text="Xem chi tiết"
              styles={{ width: "100%" }}
              onPress={() => navigation.navigate("AppointmentDetail", { id })}
            />
          </View>
        </View>
      </SectionComponent>

      <SpaceComponent height={16} />
    </BackgroundComponent>
  );
};
export default WaitConfirm;
