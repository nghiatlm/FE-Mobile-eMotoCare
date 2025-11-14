import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { globalStyle } from "../../styles/globalStyle";

interface Props {
  text: string;
  color?: string;
  size?: number;
  flex?: number;
  font?: string;
  styles?: StyleProp<TextStyle>;
  title?: boolean;
  // added props to support truncation/ellipsis
  numberOfLines?: number;
  ellipsizeMode?: "head" | "middle" | "tail" | "clip";
}

const TextComponent = (props: Props) => {
  const { text, color, size, flex, font, styles, title, numberOfLines, ellipsizeMode } = props;
  return (
    <Text
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      style={[
        globalStyle.text,
        {
          color: color ?? appColor.text,
          flex: flex ?? 0,
          fontSize: size ? size : title ? 24 : 14,
          fontFamily: font
            ? font
            : title
            ? fontFamilies.roboto_medium
            : fontFamilies.roboto_regular,
        },
        styles,
      ]}
    >
      {text}
    </Text>
  );
};

export default TextComponent;
