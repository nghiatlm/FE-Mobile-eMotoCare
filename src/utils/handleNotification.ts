import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";

export class NotificationHandler {
  static checkNotificationPermission = async () => {
    const authStatus = await messaging().requestPermission();

    if (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      this.getFcmToken();
    } else {
      console.log("Notification permission denied.");
    }
  };

  static getFcmToken = async () => {
    const fcmToken = await AsyncStorage.getItem("fcmToken");
    if (!fcmToken) {
      try {
        const token = await messaging().getToken();
        if (token) {
          console.log("FCM Token:", token);
          await AsyncStorage.setItem("fcmToken", token);
          this.updateTokenForUser(token);
        }
      } catch (error) {
        console.log("Error getting FCM token:", error);
      }
    } else {
      console.log("FCM Token already exists:", fcmToken);
    }
  };

  static updateTokenForUser = async (token: string) => {
    const res = await AsyncStorage.getItem("userData");
    console.log("User data from storage:", res);
  };
}
