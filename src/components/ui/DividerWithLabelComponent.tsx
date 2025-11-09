import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import TextComponent from "./TextComponent";
import { appColor } from "../../constants/appColor";

interface Props {
  text?: string;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
}

const DividerWithLabelComponent = ({ text, style, textColor }: Props) => {
  return (
    <View
      style={[
        { width: "100%", alignItems: "center", marginVertical: 8 },
        style,
      ]}
    >
      <View
        style={{
          position: "absolute",
          left: 12,
          right: 12,
          height: 2,
          backgroundColor: appColor.gray,
          opacity: 0.6,
        }}
      />
      {text ? (
        <View style={{ backgroundColor: appColor.white, paddingHorizontal: 2 }}>
          <TextComponent
            text={text}
            size={14}
            color={textColor ?? appColor.primary}
          />
        </View>
      ) : null}
    </View>
  );
};

export default DividerWithLabelComponent;
