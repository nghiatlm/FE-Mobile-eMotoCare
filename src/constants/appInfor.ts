import { Dimensions, Platform } from "react-native";

const LOCAL_IP = "192.168.0.6";

export const appInfor = {
  size: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  BASE_URL: process.env.EXPO_BASE_URL,
};
