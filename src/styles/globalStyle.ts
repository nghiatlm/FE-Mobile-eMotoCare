import { StyleSheet } from "react-native";
import { appColor } from "../constants/appColor";
import { fontFamilies } from "../constants/fontFamilies";

export const globalStyle = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: appColor.white
    },
    text: {
        fontFamily: fontFamilies.roboto_regular,
        fontSize: 14,
        color: appColor.text,
    }
})