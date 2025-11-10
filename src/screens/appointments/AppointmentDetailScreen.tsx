import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import {
  BackgroundComponent,
  ButtonComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { getAppointmentDetail } from "../../services/appointment.service";
import { globalStyle } from "../../styles/globalStyle";

const formatDate = (iso?: string) => {
  if (!iso) return "";
  // try parse YYYY-MM-DD first to avoid timezone shifts
  const m = iso.toString().match(/^(\d{4})-(\d{2})-(\d{2})/);
  let d: Date;
  if (m) {
    d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  } else {
    d = new Date(iso);
  }
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const AppointmentDetailScreen = ({ navigation, route }: any) => {
  const {id} = route.params;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getAppointmentDetail(id);
      if (result.success) {
        setData(result.data);
      } else {
        console.log("Get Appointment Failed: ", result.message);
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const footer = (
    <View style={styles.footer}>
      <ButtonComponent
        text="Xem quá trình bảo dưỡng"
        type="primary"
        onPress={() => navigation.navigate("MaintenanceProcess", { id })}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer]}>
        <ActivityIndicator size="large" color={appColor.primary} />
      </View>
    );
  }

  if (!data) {
    return (
      <BackgroundComponent back title="Đặt lịch bảo dưỡng">
        <TextComponent
          text="Không tìm thấy thông tin lịch hẹn."
          color={appColor.gray2}
          styles={{ textAlign: "center", marginTop: 40 }}
        />
      </BackgroundComponent>
    );
  }

  return (
    <BackgroundComponent
      back
      title="Chi tiết lịch hẹn"
      isScroll
      footer={footer}
    >
      <SpaceComponent height={12} />
      <TextComponent
        text="Thông tin lịch bảo dưỡng của bạn"
        size={20}
        font={fontFamilies.roboto_bold}
        color={appColor.text}
        styles={{ textAlign: "center" }}
      />

      <SpaceComponent height={30} />

      {/* Mã Check-in */}
      <SectionComponent
        styles={[
          globalStyle.shadow,
          styles.card,
          { alignItems: "center", paddingVertical: 24 },
        ]}
      >
        <RowComponent justify="center">
          <AntDesign name="qrcode" size={26} color={appColor.primary} />
          <TextComponent
            text="Mã Check-in"
            size={18}
            font={fontFamilies.roboto_medium}
            color={appColor.text}
            styles={{ marginLeft: 8 }}
          />
        </RowComponent>

        <SpaceComponent height={16} />
        <Image
          source={
            data?.checkinQRCode
              ? { uri: data.checkinQRCode }
              : require("../../assets/images/qrcode.png")
          }
          style={styles.qrImage}
        />
        <SpaceComponent height={12} />
        <TextComponent
          text={data?.code || id}
          size={15}
          font={fontFamilies.roboto_regular}
          color={appColor.gray2}
          styles={{ textAlign: "center" }}
        />
      </SectionComponent>

      <SpaceComponent height={25} />

      <RowComponent justify="flex-start">
        <Ionicons
          name="information-circle-outline"
          size={22}
          color={appColor.primary}
        />
        <TextComponent
          text="Chi tiết lịch hẹn"
          size={18}
          font={fontFamilies.roboto_bold}
          color={appColor.text}
          styles={{ marginLeft: 10 }}
        />
      </RowComponent>
      <SpaceComponent height={20} />
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            borderColor: appColor.gray,
            borderWidth: 1,
            backgroundColor: appColor.white,
            borderRadius: 8,
            marginVertical: 12,
            paddingVertical: 16,
          },
        ]}
      >
        <RowComponent justify="flex-start">
          <FontAwesome5
            name="map-marker-alt"
            size={20}
            color={appColor.primary}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <TextComponent
              text="Trung tâm"
              font={fontFamilies.roboto_medium}
              size={20}
            />
            <SpaceComponent height={8} />
            <TextComponent
              text={data?.serviceCenter?.name || "Ihouzz MotorCare"}
              color={appColor.gray2}
              font={fontFamilies.roboto_regular}
              size={18}
            />
            <SpaceComponent height={8} />
            <TextComponent
              text={
                data?.serviceCenter?.address || "Số 1, Nguyễn Văn Bảo, Gò Vấp"
              }
              color={appColor.gray2}
              size={16}
            />
          </View>
        </RowComponent>
      </SectionComponent>
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            borderColor: appColor.gray,
            borderWidth: 1,
            backgroundColor: appColor.white,
            borderRadius: 8,
            marginVertical: 12,
            paddingVertical: 16,
          },
        ]}
      >
        <RowComponent justify="flex-start">
          <Ionicons name="today-outline" size={20} color={appColor.primary} />
          <View
            style={{
              marginLeft: 12,
            }}
          >
            <TextComponent
              text="Thời gian"
              font={fontFamilies.roboto_regular}
              size={18}
            />
            <SpaceComponent height={8} />
            <TextComponent
              text={formatDate(data?.appointmentDate)}
              font={fontFamilies.roboto_regular}
              size={16}
              color={appColor.gray2}
            />
            <SpaceComponent height={8} />
            <TextComponent
              text={data?.timeSlot}
              font={fontFamilies.roboto_regular}
              size={16}
              color={appColor.gray2}
            />
          </View>
        </RowComponent>
      </SectionComponent>
    </BackgroundComponent>
  );
};

export default AppointmentDetailScreen;

const styles = StyleSheet.create({
  footer: {
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  qrImage: {
    height: 160,
    width: 160,
    resizeMode: "contain",
  },
  card: {
    backgroundColor: appColor.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: appColor.gray,
  },
  infoRow: {
    alignItems: "center",
  },
});
