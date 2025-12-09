import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import {
  BackgroundComponent,
  RowComponent,
  SectionComponent,
  TextComponent
} from "../../components";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "appointment" | "maintenance" | "battery" | "system" | "alert";
  timestamp: string;
  read: boolean;
  icon: string;
}

const notificationData: Notification[] = [
  {
    id: "1",
    title: "Lịch hẹn sắp tới",
    message:
      "Bạn có lịch hẹn bảo dưỡng vào ngày 15/12/2025 tại Trung tâm dịch vụ A",
    type: "appointment",
    timestamp: "2 giờ trước",
    read: false,
    icon: "calendar-check",
  },
  {
    id: "2",
    title: "Pin xe cần theo dõi",
    message: "Dung lượng pin của xe đã giảm xuống 45%. Vui lòng kiểm tra sớm",
    type: "battery",
    timestamp: "4 giờ trước",
    read: false,
    icon: "battery-alert",
  },
  {
    id: "3",
    title: "Bảo dưỡng định kỳ",
    message: "Xe của bạn cần bảo dưỡng định kỳ. Hãy đặt lịch ngay",
    type: "maintenance",
    timestamp: "1 ngày trước",
    read: true,
    icon: "wrench",
  },
  {
    id: "4",
    title: "Cập nhật hệ thống",
    message:
      "Ứng dụng đã được cập nhật phiên bản mới với các tính năng tốt hơn",
    type: "system",
    timestamp: "3 ngày trước",
    read: true,
    icon: "update",
  },
  {
    id: "5",
    title: "Cảnh báo quãng đường",
    message: "Xe của bạn đã lái được 8000km. Kiểm tra các bộ phận quan trọng",
    type: "alert",
    timestamp: "1 tuần trước",
    read: true,
    icon: "alert-circle",
  },
  {
    id: "6",
    title: "Lịch hẹn đã hoàn thành",
    message: "Lịch hẹn bảo dưỡng tại Trung tâm dịch vụ B đã hoàn thành",
    type: "appointment",
    timestamp: "2 tuần trước",
    read: true,
    icon: "check-circle",
  },
];

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

const getNotificationIcon = (type: string, iconName: string) => {
  switch (type) {
    case "appointment":
      return (
        <MaterialCommunityIcons
          name="calendar-check"
          size={24}
          color={appColor.primary}
        />
      );
    case "maintenance":
      return (
        <MaterialCommunityIcons
          name="wrench"
          size={24}
          color={appColor.warning}
        />
      );
    case "battery":
      return (
        <MaterialCommunityIcons
          name="battery-alert"
          size={24}
          color={appColor.danger}
        />
      );
    case "system":
      return (
        <MaterialCommunityIcons
          name="update"
          size={24}
          color={appColor.gray2}
        />
      );
    case "alert":
      return (
        <MaterialCommunityIcons
          name="alert-circle"
          size={24}
          color={appColor.warning}
        />
      );
    default:
      return <Ionicons name="notifications" size={24} color={appColor.gray2} />;
  }
};

const NotificationScreen = () => {
  const navigation = useNavigation<any>();
  const [notifications, setNotifications] =
    useState<Notification[]>(notificationData);

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <BackgroundComponent title="Thông báo" back isScroll>
      {unreadCount > 0 && (
        <SectionComponent styles={{ marginBottom: 12 }}>
          <View
            style={{
              backgroundColor: appColor.primary,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <TextComponent
              text={`Bạn có ${unreadCount} thông báo chưa đọc`}
              color={appColor.white}
              size={14}
              font={fontFamilies.roboto_medium}
            />
          </View>
        </SectionComponent>
      )}

      {notifications.map((notification) => (
        <TouchableOpacity
          key={notification.id}
          onPress={() => {
            handleMarkAsRead(notification.id);
            navigation.navigate("NotificationDetail", { notification });
          }}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.notificationCard,
              {
                backgroundColor: notification.read ? appColor.white : "#F8F9FF",
                borderLeftColor: getNotificationColor(notification.type),
              },
            ]}
          >
            <RowComponent justify="space-between">
              <View style={{ flex: 1, marginRight: 12 }}>
                <RowComponent>
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor:
                          getNotificationColor(notification.type) + "15",
                      },
                    ]}
                  >
                    {getNotificationIcon(notification.type, notification.icon)}
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <RowComponent justify="space-between">
                      <TextComponent
                        text={notification.title}
                        size={16}
                        font={fontFamilies.roboto_medium}
                        color={appColor.text}
                      />
                      {!notification.read && (
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: appColor.primary,
                          }}
                        />
                      )}
                    </RowComponent>
                    <TextComponent
                      text={notification.message}
                      size={13}
                      color={appColor.gray2}
                      styles={{ marginTop: 6, lineHeight: 18 }}
                    />
                    <TextComponent
                      text={notification.timestamp}
                      size={12}
                      color={appColor.gray}
                      styles={{ marginTop: 8 }}
                    />
                  </View>
                </RowComponent>
              </View>
            </RowComponent>
          </View>
        </TouchableOpacity>
      ))}
    </BackgroundComponent>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  notificationCard: {
    backgroundColor: appColor.white,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderWidth: 0.5,
    borderColor: appColor.gray,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
