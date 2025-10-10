import { View, Text, StyleProp, TextStyle } from "react-native";
import React from "react";
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
}

const TextComponent = (props: Props) => {
  const { text, color, size, flex, font, styles, title } = props;
  return (
    <Text
      style={[
        globalStyle.text,
        {
          color: color ?? appColor.text,
          flex: flex ?? 0,
          fontSize: size ?? title ? 24 : 14,
          fontFamily:
            font ?? title
              ? fontFamilies.roboto_bold
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
