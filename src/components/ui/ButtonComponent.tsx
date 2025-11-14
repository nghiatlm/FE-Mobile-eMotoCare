import React, { ReactNode } from "react";
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { globalStyle } from "../../styles/globalStyle";
import TextComponent from "./TextComponent";

interface Props {
  icon?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  text: string;
  type?: "primary" | "text" | "link" | "secondary" | "ghost";
  color?: string;
  styles?: StyleProp<ViewStyle>;
  textColor?: string;
  textStyle?: StyleProp<TextStyle>;
  textFont?: string;
  disabled?: boolean;
  onPress?: () => void | Promise<void>; // allow async handlers
  iconFlex?: "right" | "left";
}

const ButtonComponent = (props: Props) => {
  const {
    icon,
    leftIcon,
    rightIcon,
    text,
    type,
    color,
    styles,
    textColor,
    textStyle,
    textFont,
    onPress,
    iconFlex,
    disabled,
  } = props;

  // determine icons (prefer explicit leftIcon/rightIcon, fallback to legacy icon+iconFlex)
  const left = leftIcon ?? (icon && iconFlex === "left" ? icon : null);
  const right = rightIcon ?? (icon && iconFlex === "right" ? icon : null);
  const rightContainer = right ? (
    <View style={{ flex: 1, alignItems: "flex-end" }}>{right}</View>
  ) : null;

  return type === "primary" ? (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={[
          globalStyle.button,
          globalStyle.shadow,
          {
            backgroundColor: color
              ? color
              : disabled
              ? appColor.gray
              : appColor.primary,
            marginBottom: 12,
            width: "100%",
          },
          styles,
        ]}
      >
        {left}
        <TextComponent
          text={text}
          color={textColor ?? appColor.white}
          font={textFont ?? fontFamilies.roboto_medium}
          styles={[
            textStyle,
            {
              marginLeft: left ? 12 : 0,
              fontSize: 16,
              textAlign: "left",
            },
          ]}
          flex={0}
        />
        {rightContainer}
      </TouchableOpacity>
    </View>
  ) : type === "text" || type == "link" ? (
    <TouchableOpacity onPress={onPress} style={[{ flexDirection: 'row', alignItems: 'center' }, styles]}
      activeOpacity={0.7}
    >
      {left}
      <TextComponent
        flex={0}
        text={text}
        size={12}
        color={textColor ?? (type === "link" ? appColor.primary : appColor.text)}
        styles={[{ marginLeft: left ? 8 : 0 }, textStyle]}
      />
      {rightContainer ?? right}
    </TouchableOpacity>
  ) : (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={[
          globalStyle.button,
          {
            backgroundColor: appColor.white,
            borderWidth: 1,
            borderColor: appColor.gray,
            width: "100%",
            marginBottom: 12,
          },
          styles,
        ]}
      >
        {left}
        <TextComponent
          text={text}
          color={textColor ?? appColor.text}
          font={textFont ?? fontFamilies.roboto_medium}
          styles={[
            textStyle,
            {
              marginLeft: left ? 12 : 0,
              fontSize: 16,
              textAlign: "left",
            },
          ]}
        />
        {rightContainer}
      </TouchableOpacity>
    </View>
  );
};

export default ButtonComponent;
