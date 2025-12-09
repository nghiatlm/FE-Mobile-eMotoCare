import React from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { TextComponent } from "../../../components";
import { appColor } from "../../../constants/appColor";
import { fontFamilies } from "../../../constants/fontFamilies";

const CircleComponent = ({ percent }: any) => {
  const size = 180;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={appColor.gray}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={appColor.warning}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          fill="transparent"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </Svg>

      <View style={{ position: "absolute", alignItems: "center" }}>
        <TextComponent
          text={`${percent}%`}
          size={28}
          font={fontFamilies.roboto_bold}
          color={appColor.warning}
        />
        <TextComponent
          text="SOC"
          size={12}
          color={appColor.text}
          styles={{ marginTop: 4 }}
        />
        <View style={{ marginTop: 10 }}>
          <View
            style={{
              backgroundColor: appColor.warning,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
            }}
          >
            <TextComponent
              text="Pin trung bình"
              size={12}
              color="#000"
              font={fontFamilies.roboto_medium}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default CircleComponent;
