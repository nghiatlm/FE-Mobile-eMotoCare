import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import TextComponent from "./ui/TextComponent";
import { appColor } from "../constants/appColor";
import { fontFamilies } from "../constants/fontFamilies";

type Props = {
  steps: string[];
  current?: number; 
};

const StepProgress: React.FC<Props> = ({ steps, current = 1 }) => {
  const clamp = Math.max(1, Math.min(current, steps.length));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {steps.map((label, idx) => {
          const i = idx + 1;
          const status =
            i < clamp ? "completed" : i === clamp ? "active" : "pending";
          const bgColor =
            status === "active"
              ? appColor.danger
              : status === "completed"
              ? appColor.primary
              : appColor.gray;
          const textColor =
            status === "pending" ? appColor.gray3 : appColor.white;

          return (
            <View key={idx} style={styles.stepWrapper}>
              <View style={[styles.step, { backgroundColor: bgColor }]}>
                <TextComponent
                  text={label}
                  size={11}
                  color={textColor}
                  font={fontFamilies.roboto_medium}
                />
              </View>
              {idx !== steps.length - 1 && (
                <View style={[styles.triangle, { borderLeftColor: bgColor }]} />
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  step: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 14,
    borderBottomWidth: 14,
    borderLeftWidth: 12,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },
});

export default StepProgress;
