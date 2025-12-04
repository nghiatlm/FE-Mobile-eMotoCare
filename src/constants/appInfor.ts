import { Dimensions, Platform } from "react-native";


export const appInfor = {
  size: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  BASE_URL: process.env.EXPO_PUBLIC_API_URL,
};
