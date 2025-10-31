import React, { ReactNode } from "react";
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { globalStyle } from "../../styles/globalStyle";
import TextComponent from "./TextComponent";

interface Props {
  icon?: ReactNode;
  text: string;
  type?: "primary" | "text" | "link";
  color?: string;
  styles?: StyleProp<ViewStyle>;
  textColor?: string;
  textStyle?: StyleProp<TextStyle>;
  textFont?: string;
  disbale?: boolean;
  onPress?: () => void;
  iconFlex?: "right" | "left";
}

const ButtonComponent = (props: Props) => {
  const {
    icon,
    text,
    type,
    color,
    styles,
    textColor,
    textStyle,
    textFont,
    onPress,
    iconFlex,
    disbale,
  } = props;

  return type === "primary" ? (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity
        disabled={disbale}
        onPress={onPress}
        style={[
          globalStyle.button,
          globalStyle.shadow,
          {
            backgroundColor: color
              ? color
              : disbale
              ? appColor.gray
              : appColor.primary,
            marginBottom: 20,
            width: "100%",
          },
          styles,
        ]}
      >
        {icon && iconFlex === "left" && icon}
        <TextComponent
          text={text}
          color={textColor ?? appColor.white}
          font={textFont ?? fontFamilies.roboto_medium}
          styles={[
            textStyle,
            {
              marginLeft: icon ? 12 : 0,
              fontSize: 16,
              textAlign: "center",
            },
          ]}
          flex={icon && iconFlex === "right" ? 1 : 0}
        />
        {icon && iconFlex === "right" && icon}
      </TouchableOpacity>
    </View>
  ) : type === "text" || type == "link" ? (
    <TouchableOpacity onPress={onPress} style={styles}>
      <TextComponent
        flex={0}
        text={text}
        size={12}
        color={type === "link" ? appColor.primary : appColor.text}
      />
    </TouchableOpacity>
  ) : (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity
        disabled={disbale}
        onPress={onPress}
        style={[
          globalStyle.button,
          {
            backgroundColor: appColor.white,
            borderWidth: 1,
            borderColor: appColor.gray,
            width: "100%",
            marginBottom: 20,
          },
          styles,
        ]}
      >
        {icon && iconFlex === "left" && icon}
        <TextComponent
          text={text}
          color={textColor ?? appColor.text}
          font={textFont ?? fontFamilies.roboto_medium}
          styles={[
            textStyle,
            {
              marginLeft: icon ? 12 : 0,
              fontSize: 16,
              textAlign: "center",
            },
          ]}
        />
        {icon && iconFlex === "right" && icon}
      </TouchableOpacity>
    </View>
  );
};

export default ButtonComponent;
