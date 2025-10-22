import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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

const MaintenanceProcess = ({ navigation, route }: any) => {
  const { id } = route.params;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<number>(1); // 1 = Đang xử lý yêu cầu

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAppointmentDetail(id);
      if (result.success) setData(result.data);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const steps = [
    {
      id: 1,
      title: "Đang xử lý yêu cầu",
      desc: "Chúng tôi đang xử lý yêu cầu của bạn và sẽ gửi báo giá sớm.",
    },
    { id: 2, title: "Kiểm tra", desc: "" },
    { id: 3, title: "Bảo dưỡng", desc: "" },
    { id: 4, title: "Thanh toán", desc: "" },
  ];

  return (
    <BackgroundComponent back title="Quá trình bảo dưỡng">
      <ScrollView showsVerticalScrollIndicator={false}>
        <SpaceComponent height={10} />
        <TextComponent
          text="Chi tiết dịch vụ"
          size={20}
          font={fontFamilies.roboto_bold}
          styles={{ textAlign: "center", color: appColor.text }}
        />
        <TextComponent
          text="Theo dõi những cuộc hẹn bảo dưỡng của bạn"
          size={14}
          color={appColor.gray2}
          styles={{ textAlign: "center", marginTop: 4 }}
        />
        <SpaceComponent height={20} />

        {/* Thẻ thông tin trung tâm dịch vụ */}
        <SectionComponent styles={[globalStyle.shadow, styles.card]}>
          <TextComponent
            text="Trung tâm dịch vụ"
            font={fontFamilies.roboto_medium}
            color={appColor.text}
            size={16}
          />
          <TextComponent
            text="Xem vấn đề của xe"
            size={13}
            color={appColor.primary}
            styles={{ marginTop: 4 }}
          />
          <SpaceComponent height={10} />
          <TextComponent
            text={`Th, ${new Date().toLocaleDateString("vi-VN")}`}
            color={appColor.text}
          />
          <TextComponent
            text={`Thời gian: ${data?.timeSlot || "08:00"}`}
            color={appColor.text}
          />
          <SpaceComponent height={10} />
          <TextComponent
            text={`Địa chỉ: ${
              data?.serviceCenter?.address || "3, Lê Văn Khương, Gò Vấp"
            }`}
            color={appColor.gray2}
          />
          <TextComponent
            text={`Mã dịch vụ: ${data?.code || "6M78239A23P"}`}
            color={appColor.gray2}
          />
        </SectionComponent>

        <SpaceComponent height={25} />

        {/* Tiến trình bảo dưỡng */}
        <View style={styles.timelineContainer}>
          {steps.map((step, index) => (
            <View key={step.id} style={styles.stepContainer}>
              {/* Cột trái: đường nối + chấm tròn */}
              <View style={styles.timelineColumn}>
                {/* Đường nối trên */}
                {index > 0 && (
                  <View
                    style={[
                      styles.line,
                      {
                        backgroundColor:
                          index <= currentStep
                            ? appColor.primary
                            : appColor.gray,
                      },
                    ]}
                  />
                )}
                {/* Chấm tròn */}
                <View
                  style={[
                    styles.circle,
                    {
                      backgroundColor:
                        index + 1 <= currentStep
                          ? appColor.primary
                          : appColor.gray,
                    },
                  ]}
                />
              </View>

              {/* Nội dung bên phải */}
              <View style={{ flex: 1 }}>
                <TextComponent
                  text={step.title}
                  color={
                    index + 1 === currentStep ? appColor.primary : appColor.text
                  }
                  font={
                    index + 1 === currentStep
                      ? fontFamilies.roboto_bold
                      : fontFamilies.roboto_medium
                  }
                  size={16}
                />
                {step.desc ? (
                  <TextComponent
                    text={step.desc}
                    color={appColor.gray2}
                    size={14}
                    styles={{ marginTop: 4 }}
                  />
                ) : null}
              </View>
            </View>
          ))}
        </View>

        <SpaceComponent height={40} />

        {/* Nút hành động */}
        <RowComponent justify="space-between">
          <ButtonComponent
            text="Hủy yêu cầu"
            type="text"
            styles={{
              flex: 0.48,
              borderWidth: 1,
              borderColor: appColor.gray,
              backgroundColor: appColor.white,
            }}
            textColor={appColor.text}
          />
          <ButtonComponent
            text="Đặt lại lịch"
            type="primary"
            styles={{ flex: 0.48 }}
            onPress={() => navigation.navigate("AppointmentDetailScreen")}
          />
        </RowComponent>

        <SpaceComponent height={40} />
      </ScrollView>
    </BackgroundComponent>
  );
};

export default MaintenanceProcess;

const styles = StyleSheet.create({
  card: {
    backgroundColor: appColor.white,
    borderRadius: 12,
    padding: 16,
  },
  timelineContainer: {
    marginLeft: 8,
    marginTop: 8,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 25,
  },
  timelineColumn: {
    alignItems: "center",
    marginRight: 12,
  },
  line: {
    position: "absolute",
    top: -25,
    width: 2,
    height: 25,
  },
  circle: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
});
