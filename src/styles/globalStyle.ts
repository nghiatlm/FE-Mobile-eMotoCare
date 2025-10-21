import { StyleSheet } from "react-native";
import { appColor } from "../constants/appColor";
import { fontFamilies } from "../constants/fontFamilies";

export const globalStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColor.white,
  },
  text: {
    fontFamily: fontFamilies.roboto_regular,
    fontSize: 14,
    color: appColor.text,
  },
  button: {
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: appColor.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
    flexDirection: "row",
  },
  section: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  shadow: {
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: appColor.primary,
    width: 30,
    height: 30,
    borderRadius: 100
  },
});
