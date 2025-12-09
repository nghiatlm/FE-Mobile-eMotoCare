import { View, StyleSheet, ScrollView } from "react-native";
import React, { useState } from "react";
import { BackgroundComponent, TextComponent, RowComponent, SectionComponent, ButtonComponent, SpaceComponent } from "../../components";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { globalStyle } from "../../styles/globalStyle";

interface NotificationDetail {
  id: string;
  title: string;
  message: string;
  fullDescription: string;
  type: "appointment" | "maintenance" | "battery" | "system" | "alert";
  timestamp: string;
  read: boolean;
  icon: string;
  actionUrl?: string;
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case "appointment":
      return appColor.primary;
    case "maintenance":
      return appColor.warning;
    case "battery":
      return appColor.danger;
    case "system":
      return appColor.gray2;
    case "alert":
      return appColor.warning;
    default:
      return appColor.gray2;
  }
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "appointment":
      return <MaterialCommunityIcons name="calendar-check" size={32} color={appColor.primary} />;
    case "maintenance":
      return <MaterialCommunityIcons name="wrench" size={32} color={appColor.warning} />;
    case "battery":
      return <MaterialCommunityIcons name="battery-alert" size={32} color={appColor.danger} />;
    case "system":
      return <MaterialCommunityIcons name="update" size={32} color={appColor.gray2} />;
    case "alert":
      return <MaterialCommunityIcons name="alert-circle" size={32} color={appColor.warning} />;
    default:
      return <Ionicons name="notifications" size={32} color={appColor.gray2} />;
  }
};

const NotificationDetailScreen = ({ navigation, route }: any) => {
  const notification: NotificationDetail = route.params?.notification || {
    id: "1",
    title: "Thông báo",
    message: "Chi tiết thông báo",
    fullDescription: "Không có mô tả chi tiết",
    type: "system",
    timestamp: "Vừa xong",
    read: true,
    icon: "bell",
  };

  return (
    <BackgroundComponent title="Chi tiết thông báo" back isScroll>
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            backgroundColor: appColor.white,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            alignItems: "center",
            borderWidth: 0.5,
            borderColor: appColor.gray,
          },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: getNotificationColor(notification.type) + "15",
            },
          ]}
        >
          {getNotificationIcon(notification.type)}
        </View>

        <SpaceComponent height={16} />

        <TextComponent
          text={notification.title}
          size={24}
          font={fontFamilies.roboto_bold}
          color={appColor.text}
          styles={{ textAlign: "center" }}
        />

        <SpaceComponent height={8} />

        <TextComponent
          text={notification.timestamp}
          size={12}
          color={appColor.gray2}
          styles={{ textAlign: "center" }}
        />
      </SectionComponent>

      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            backgroundColor: appColor.white,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 0.5,
            borderColor: appColor.gray,
          },
        ]}
      >
        <TextComponent
          text="Thông báo"
          size={18}
          font={fontFamilies.roboto_bold}
          color={appColor.text}
          styles={{ marginBottom: 12 }}
        />

        <TextComponent
          text={notification.message}
          size={14}
          color={appColor.text}
          styles={{ lineHeight: 22 }}
        />

        <SpaceComponent height={16} />

        <View
          style={{
            height: 1,
            backgroundColor: appColor.gray,
            marginVertical: 12,
          }}
        />

        <TextComponent
          text="Chi tiết"
          size={16}
          font={fontFamilies.roboto_medium}
          color={appColor.text}
          styles={{ marginTop: 12, marginBottom: 12 }}
        />

        <TextComponent
          text={notification.fullDescription || notification.message}
          size={14}
          color={appColor.gray2}
          styles={{ lineHeight: 22 }}
        />
      </SectionComponent>

      <SectionComponent>
        <ButtonComponent
          text="Đóng"
          type="primary"
          onPress={() => navigation.goBack()}
        />
      </SectionComponent>

      <SpaceComponent height={40} />
    </BackgroundComponent>
  );
};

export default NotificationDetailScreen;

const styles = StyleSheet.create({
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
