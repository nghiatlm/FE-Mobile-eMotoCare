import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";
import { useSelector } from "react-redux";
import {
  BackgroundComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent
} from "../../components";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { globalStyle } from "../../styles/globalStyle";
import { authSelecter } from "../../redux/reducers/authReducer";
import { fetchNotifications } from "../../services/notification.service";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "appointment" | "maintenance" | "battery" | "system" | "alert";
  timestamp: string;
  read: boolean;
  icon: string;
}

// Helper function to format relative time
const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffWeeks < 4) return `${diffWeeks} tuần trước`;
    
    const months = Math.floor(diffDays / 30);
    if (months < 12) return `${months} tháng trước`;
    
    const years = Math.floor(diffDays / 365);
    return `${years} năm trước`;
  } catch {
    return dateString;
  }
};

// Map API notification type to component type
const mapNotificationType = (apiType: string): "appointment" | "maintenance" | "battery" | "system" | "alert" => {
  const type = apiType?.toUpperCase() || "";
  if (type.includes("APPOINTMENT")) return "appointment";
  if (type.includes("MAINTENANCE")) return "maintenance";
  if (type.includes("BATTERY")) return "battery";
  if (type.includes("ALERT") || type.includes("WARNING")) return "alert";
  return "system";
};

// Map API notification type to icon name
const mapNotificationIcon = (apiType: string): string => {
  const type = apiType?.toUpperCase() || "";
  if (type.includes("APPOINTMENT")) return "calendar-check";
  if (type.includes("MAINTENANCE")) return "wrench";
  if (type.includes("BATTERY")) return "battery-alert";
  if (type.includes("ALERT") || type.includes("WARNING")) return "alert-circle";
  return "notifications";
};

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
  const auth = useSelector(authSelecter);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const accountId = auth?.accountResponse?.id || auth?.id || null;

  const fetchNotificationData = useCallback(async () => {
    if (!accountId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetchNotifications({
        receiverId: accountId,
        page: 1,
        pageSize: 100, // Lấy nhiều thông báo
      });

      if (res.success && res.data?.rowDatas) {
        // Map API data to component format
        const mappedNotifications: Notification[] = res.data.rowDatas.map(
          (item: any) => ({
            id: item.id,
            title: item.title || "Thông báo",
            message: item.message || "",
            type: mapNotificationType(item.type),
            timestamp: formatRelativeTime(item.sentAt),
            read: item.isRead || false,
            icon: mapNotificationIcon(item.type),
          })
        );
        setNotifications(mappedNotifications);
      } else {
        console.log("Lỗi lấy thông báo:", res.message);
        setNotifications([]);
      }
    } catch (error) {
      console.log("Lỗi khi gọi API notification:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchNotificationData();
  }, [fetchNotificationData]);

  useFocusEffect(
    useCallback(() => {
      fetchNotificationData();
    }, [fetchNotificationData])
  );

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
      {loading ? (
        <SectionComponent styles={{ marginTop: 40, alignItems: "center" }}>
          <ActivityIndicator size="large" color={appColor.primary} />
          <SpaceComponent height={12} />
          <TextComponent
            text="Đang tải thông báo..."
            color={appColor.gray2}
            size={14}
          />
        </SectionComponent>
      ) : (
        <>
          {unreadCount > 0 && (
            <SectionComponent styles={{ marginBottom: 16 }}>
              <View style={styles.unreadBadge}>
                <View style={styles.unreadDot} />
                <TextComponent
                  text={`Bạn có ${unreadCount} thông báo chưa đọc`}
                  color={appColor.white}
                  size={14}
                  font={fontFamilies.roboto_medium}
                />
              </View>
            </SectionComponent>
          )}

          {notifications.length === 0 ? (
            <SectionComponent styles={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="notifications-off-outline" size={64} color={appColor.gray2} />
              </View>
              <SpaceComponent height={16} />
              <TextComponent
                text="Không có thông báo nào"
                color={appColor.text}
                size={18}
                font={fontFamilies.roboto_medium}
              />
              <SpaceComponent height={8} />
              <TextComponent
                text="Các thông báo mới sẽ xuất hiện ở đây"
                color={appColor.gray2}
                size={14}
                styles={{ textAlign: "center" }}
              />
            </SectionComponent>
          ) : (
            notifications.map((notification, index) => (
              <TouchableOpacity
                key={notification.id}
                onPress={() => {
                  handleMarkAsRead(notification.id);
                  navigation.navigate("NotificationDetail", { notification });
                }}
                activeOpacity={0.7}
                style={[
                  styles.notificationCardWrapper,
                  index === 0 && { marginTop: 0 }
                ]}
              >
                <View
                  style={[
                    styles.notificationCard,
                    globalStyle.shadow,
                    {
                      backgroundColor: notification.read ? appColor.white : "#F8F9FF",
                      borderLeftColor: getNotificationColor(notification.type),
                    },
                  ]}
                >
                  <RowComponent justify="flex-start" styles={{ alignItems: "flex-start" }}>
                    <View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor: getNotificationColor(notification.type) + "20",
                        },
                      ]}
                    >
                      {getNotificationIcon(notification.type, notification.icon)}
                    </View>
                    <View style={styles.contentContainer}>
                      <RowComponent justify="space-between" styles={{ marginBottom: 4 }}>
                        <TextComponent
                          text={notification.title}
                          size={16}
                          font={fontFamilies.roboto_medium}
                          color={appColor.text}
                          styles={{ flex: 1 }}
                          numberOfLines={1}
                        />
                        {!notification.read && (
                          <View style={styles.readIndicator} />
                        )}
                      </RowComponent>
                      <TextComponent
                        text={notification.message}
                        size={14}
                        color={appColor.gray2}
                        styles={{ marginTop: 4, lineHeight: 20 }}
                        numberOfLines={2}
                      />
                      <RowComponent justify="space-between" styles={{ marginTop: 8 }}>
                        <TextComponent
                          text={notification.timestamp}
                          size={12}
                          color={appColor.gray}
                        />
                        <View style={[
                          styles.typeBadge,
                          { backgroundColor: getNotificationColor(notification.type) + "15" }
                        ]}>
                          <TextComponent
                            text={notification.type === "appointment" ? "Lịch hẹn" : 
                                  notification.type === "maintenance" ? "Bảo dưỡng" :
                                  notification.type === "battery" ? "Pin" :
                                  notification.type === "alert" ? "Cảnh báo" : "Hệ thống"}
                            size={10}
                            color={getNotificationColor(notification.type)}
                            font={fontFamilies.roboto_medium}
                          />
                        </View>
                      </RowComponent>
                    </View>
                  </RowComponent>
                </View>
              </TouchableOpacity>
            ))
          )}
        </>
      )}
    </BackgroundComponent>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  unreadBadge: {
    backgroundColor: appColor.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...globalStyle.shadow,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: appColor.white,
    marginRight: 8,
  },
  emptyContainer: {
    marginTop: 60,
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: appColor.gray + "10",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationCardWrapper: {
    marginBottom: 12,
    marginHorizontal: 4,
  },
  notificationCard: {
    backgroundColor: appColor.white,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderWidth: 0,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  readIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: appColor.primary,
    marginLeft: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
