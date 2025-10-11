import React, { ReactNode } from "react";
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
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
  } = props;

  return type === "primary" ? (
    <TouchableOpacity
      onPress={onPress}
      style={[
        globalStyle.button,
        globalStyle.shadow,
        {
          backgroundColor: color ?? appColor.primary,
          marginBottom: 20,
          width: '90%'
        },
        styles,
      ]}
    >
      {icon && icon}
      <TextComponent
        text={text}
        color={textColor ?? appColor.white}
        font={textFont ?? fontFamilies.roboto_medium}
        styles={[
          textStyle,
          {
            marginLeft: icon ? 12 : 0,
            fontSize: 16,
          },
        ]}
        flex={icon && iconFlex === "right" ? 1 : 0}
      />
      {icon && iconFlex === "right" && icon}
    </TouchableOpacity>
  ) : (
    <TouchableOpacity onPress={onPress}>
      <TextComponent
        text={text}
        color={type === "link" ? appColor.primary : appColor.text}
      />
    </TouchableOpacity>
  );
};

export default ButtonComponent;
