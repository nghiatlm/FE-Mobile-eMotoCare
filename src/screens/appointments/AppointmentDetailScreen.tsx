import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";
import {
  BackgroundComponent,
  ButtonComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { fontFamilies } from "../../constants/fontFamilies";
import { appColor } from "../../constants/appColor";
import {
  AntDesign,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { getAppointmentDetail } from "../../services/appointment.service";
import { globalStyle } from "../../styles/globalStyle";

const AppointmentDetailScreen = ({ navigation, route }: any) => {
  // const { id } = route.params;
  const id = "838bb043-b872-4fd6-ab5a-b0fb86f7e931";

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
          source={require("../../assets/images/qrcode.png")}
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

      {/* Thông tin chi tiết */}
      <SectionComponent
        styles={[globalStyle.shadow, styles.card, { paddingVertical: 20 }]}
      >
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

        {/* Thông tin trung tâm */}
        <RowComponent justify="flex-start" styles={styles.infoRow}>
          <FontAwesome5
            name="map-marker-alt"
            size={20}
            color={appColor.primary}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <TextComponent text="Trung tâm" font={fontFamilies.roboto_medium} />
            <TextComponent
              text={data?.serviceCenter?.name || "Ihouzz MotorCare"}
              color={appColor.gray2}
            />
            <TextComponent
              text={
                data?.serviceCenter?.address || "Số 1, Nguyễn Văn Bảo, Gò Vấp"
              }
              color={appColor.gray2}
            />
          </View>
        </RowComponent>

        <SpaceComponent height={12} />

        {/* Ngày và Giờ */}
        <RowComponent justify="space-between" styles={styles.infoRow}>
          <MaterialIcons name="date-range" size={20} color={appColor.primary} />
          <TextComponent
            text={data?.date || "22/10/2025"}
            color={appColor.gray2}
            styles={{ marginLeft: 8, flex: 1 }}
          />
        </RowComponent>

        <SpaceComponent height={12} />

        <RowComponent justify="space-between" styles={styles.infoRow}>
          <AntDesign name="clock-circle" size={20} color={appColor.primary} />
          <TextComponent
            text={data?.timeSlot || "09:00 - 10:00"}
            color={appColor.gray2}
            styles={{ marginLeft: 8, flex: 1 }}
          />
        </RowComponent>

        <SpaceComponent height={12} />

        <RowComponent justify="space-between" styles={styles.infoRow}>
          <MaterialIcons name="build" size={22} color={appColor.primary} />
          <TextComponent
            text={data?.type || "Bảo dưỡng định kỳ"}
            color={appColor.gray2}
            styles={{ marginLeft: 8, flex: 1 }}
          />
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
    borderWidth: 1,
    borderColor: appColor.gray,
  },
  infoRow: {
    alignItems: "center",
  },
});
