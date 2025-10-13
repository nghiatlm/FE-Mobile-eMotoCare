import { Dimensions } from "react-native";

export const appInfor = {
  size: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  BASE_URL: 'http://10.0.2.2:5056/api/v1'
};
