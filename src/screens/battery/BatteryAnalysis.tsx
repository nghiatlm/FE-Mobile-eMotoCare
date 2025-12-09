import { View } from "react-native";
import React from "react";
import {
  BackgroundComponent,
  ButtonComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { globalStyle } from "../../styles/globalStyle";

const BatteryAnalysis = ({ navigation }: any) => {
  const recommendations = [
    {
      id: 1,
      title: "Khả năng cung cấp năng lượng",
      description: "Dung lượng 45.3 Ah • Năng lượng 45.2 Wh",
      status: "Tốt",
      statusColor: appColor.primary,
    },
    {
      id: 2,
      title: "Hiệu suất nạp/xả",
      description: "SOH: 85% • Tốt",
      status: "Cần bảo",
      statusColor: appColor.warning,
    },
    {
      id: 3,
      title: "Tình trạng xương cấp",
      description: "Pin còn mới",
      status: "Tốt",
      statusColor: appColor.primary,
    },
    {
      id: 4,
      title: "Tuổi thọ còn lại (RUL)",
      description: "Còn khoảng 650 vòng sạc (> 12-18 tháng",
      status: "Tốt",
      statusColor: appColor.primary,
    },
  ];

  return (
    <BackgroundComponent back isScroll title="Tình trạng Xe & PIN">
      <TextComponent
        text="Giám sát thông minh"
        size={14}
        color={appColor.gray2}
        font={fontFamilies.roboto_regular}
        styles={{ textAlign: "center", marginTop: 8 }}
      />

      {/* Current Status Card */}
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            marginTop: 16,
            backgroundColor: appColor.white,
            borderWidth: 1,
            borderColor: appColor.gray,
            borderRadius: 12,
            padding: 16,
          },
        ]}
      >
        <TextComponent
          text="Phân tích chi tiết PIN"
          size={16}
          color={appColor.text}
          font={fontFamilies.roboto_bold}
          styles={{ marginBottom: 12 }}
        />
        <TextComponent
          text="Hệ thống AI phân tích thể cụ thể."
          size={13}
          color={appColor.gray2}
          font={fontFamilies.roboto_regular}
        />
      </SectionComponent>

      {/* Current Metrics Card */}
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            marginTop: 16,
            backgroundColor: appColor.white,
            borderWidth: 1,
            borderColor: appColor.gray,
            borderRadius: 12,
            padding: 16,
          },
        ]}
      >
        <RowComponent justify="flex-start" styles={{ marginBottom: 12 }}>
          <Ionicons name="stats-chart" size={20} color={appColor.primary} />
          <TextComponent
            text="Thông số hiện tại"
            size={15}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
            styles={{ marginLeft: 8 }}
          />
        </RowComponent>

        <View style={{ gap: 12 }}>
          <RowComponent justify="space-between">
            <TextComponent
              text="⚡ Năng lượng"
              size={14}
              color={appColor.text}
              font={fontFamilies.roboto_regular}
            />
            <TextComponent
              text="52.4 V"
              size={14}
              color={appColor.text}
              font={fontFamilies.roboto_medium}
            />
          </RowComponent>

          <RowComponent justify="space-between">
            <TextComponent
              text="⚡ Dòng điện"
              size={14}
              color={appColor.text}
              font={fontFamilies.roboto_regular}
            />
            <TextComponent
              text="-12.5 A"
              size={14}
              color={appColor.text}
              font={fontFamilies.roboto_medium}
            />
          </RowComponent>

          <RowComponent justify="space-between">
            <TextComponent
              text="🔋 Công suất"
              size={14}
              color={appColor.text}
              font={fontFamilies.roboto_regular}
            />
            <TextComponent
              text="655 W"
              size={14}
              color={appColor.text}
              font={fontFamilies.roboto_medium}
            />
          </RowComponent>

          <RowComponent justify="space-between">
            <TextComponent
              text="⚡ Năng lượng"
              size={14}
              color={appColor.text}
              font={fontFamilies.roboto_regular}
            />
            <TextComponent
              text="45.2 Wh"
              size={14}
              color={appColor.text}
              font={fontFamilies.roboto_medium}
            />
          </RowComponent>

          <RowComponent justify="space-between">
            <TextComponent
              text="🔋 Năng lượng"
              size={14}
              color={appColor.text}
              font={fontFamilies.roboto_regular}
            />
            <TextComponent
              text="85.5 Ah"
              size={14}
              color={appColor.text}
              font={fontFamilies.roboto_medium}
            />
          </RowComponent>

          <RowComponent justify="space-between">
            <TextComponent
              text="💨 SOC"
              size={14}
              color={appColor.text}
              font={fontFamilies.roboto_regular}
            />
            <TextComponent
              text="78%"
              size={14}
              color={appColor.text}
              font={fontFamilies.roboto_medium}
            />
          </RowComponent>

          <RowComponent justify="space-between">
            <TextComponent
              text="💚 SOH"
              size={14}
              color={appColor.text}
              font={fontFamilies.roboto_regular}
            />
            <TextComponent
              text="85%"
              size={14}
              color={appColor.text}
              font={fontFamilies.roboto_medium}
            />
          </RowComponent>

          <RowComponent justify="space-between">
            <TextComponent
              text="🌡️ Nhiệt độ"
              size={14}
              color={appColor.text}
              font={fontFamilies.roboto_regular}
            />
            <TextComponent
              text="42°C"
              size={14}
              color={appColor.text}
              font={fontFamilies.roboto_medium}
            />
          </RowComponent>
        </View>
      </SectionComponent>

      {/* Analysis & Recommendations */}
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            marginTop: 16,
            backgroundColor: appColor.white,
            borderWidth: 1,
            borderColor: appColor.gray,
            borderRadius: 12,
            padding: 16,
          },
        ]}
      >
        <RowComponent justify="flex-start" styles={{ marginBottom: 16 }}>
          <MaterialCommunityIcons
            name="chart-box-outline"
            size={20}
            color={appColor.primary}
          />
          <TextComponent
            text="Đánh giá tình trạng"
            size={15}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
            styles={{ marginLeft: 8 }}
          />
        </RowComponent>

        <TextComponent
          text="Phân tích thông số của pin cho thấy bảo việt hiệu quả."
          size={13}
          color={appColor.gray2}
          font={fontFamilies.roboto_regular}
          styles={{ marginBottom: 16 }}
        />

        <View style={{ gap: 12 }}>
          {recommendations.map((item) => (
            <View
              key={item.id}
              style={{
                backgroundColor: "#F8F9FA",
                borderRadius: 8,
                padding: 12,
                borderLeftWidth: 3,
                borderLeftColor: item.statusColor,
              }}
            >
              <RowComponent
                justify="space-between"
                styles={{ marginBottom: 4 }}
              >
                <TextComponent
                  text={item.title}
                  size={14}
                  color={appColor.text}
                  font={fontFamilies.roboto_medium}
                  flex={1}
                />
                <View
                  style={{
                    backgroundColor: item.statusColor,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}
                >
                  <TextComponent
                    text={item.status}
                    size={11}
                    color={appColor.white}
                    font={fontFamilies.roboto_medium}
                  />
                </View>
              </RowComponent>
              <TextComponent
                text={item.description}
                size={12}
                color={appColor.gray2}
                font={fontFamilies.roboto_regular}
              />
            </View>
          ))}
        </View>
      </SectionComponent>

      {/* Maintenance Alert */}
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            marginTop: 16,
            backgroundColor: "#FFF9E6",
            borderWidth: 1,
            borderColor: appColor.warning,
            borderRadius: 12,
            padding: 16,
          },
        ]}
      >
        <RowComponent justify="flex-start" styles={{ marginBottom: 8 }}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={20}
            color={appColor.warning}
          />
          <TextComponent
            text="Pin cần theo dõi"
            size={15}
            color={appColor.text}
            font={fontFamilies.roboto_bold}
            styles={{ marginLeft: 8 }}
          />
        </RowComponent>
        <TextComponent
          text="Một số chỉ số cần theo dõi. Khuyến nghị định thừa dịnh hỳ."
          size={13}
          color={appColor.text}
          font={fontFamilies.roboto_regular}
        />
        <SpaceComponent height={12} />
        <ButtonComponent
          text="Cần theo dõi"
          type="primary"
          styles={{ backgroundColor: appColor.warning }}
          onPress={() => {}}
        />
      </SectionComponent>

      {/* Action Buttons */}
      <SectionComponent styles={{ marginTop: 20, marginBottom: 20 }}>
        <ButtonComponent
          text="📊 Xem lịch sử & dự báo"
          type="primary"
          onPress={() => {}}
          icon={
            <MaterialCommunityIcons
              name="chart-line"
              size={20}
              color={appColor.white}
            />
          }
        />
      </SectionComponent>
      <SectionComponent styles={{ marginBottom: 20 }}>
        <ButtonComponent
          text="Trang chủ"
          type="secondary"
          onPress={() => navigation.navigate("HomeScreen")}
          icon={
            <MaterialCommunityIcons
              name="chart-line"
              size={20}
              color={appColor.white}
            />
          }
        />
      </SectionComponent>
    </BackgroundComponent>
  );
};

export default BatteryAnalysis;
