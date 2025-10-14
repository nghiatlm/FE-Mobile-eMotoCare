import { Dimensions, Platform } from "react-native";

const LOCAL_IP = "192.168.0.6";

export const appInfor = {
  size: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  BASE_URL:
    Platform.OS === "ios"
      ? `http://${LOCAL_IP}:5056/api/v1`
      : "http://10.0.2.2:5056/api/v1",
};
