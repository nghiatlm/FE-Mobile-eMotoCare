import { Dimensions, Platform } from "react-native";

const LOCAL_IP = "192.168.0.6";

export const appInfor = {
  size: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  // BASE_URL: "http://10.0.2.2:5154/api/v1",
  BASE_URL:"https://be-emotorcare.onrender.com/api/v1"
};
