import { View, Text, TextInput } from "react-native";
import React from "react";
import { SpaceComponent, TextComponent } from "../../../components";

const VehicleInfoStep = ({ state, dispatch }: any) => {
  return (
    <View>
      <TextComponent text="Thông tin xe" size={18} />
      <SpaceComponent height={8} />
      <TextInput
        placeholder="Mã xe / Biển số"
        value={state.vehicleId}
        onChangeText={(t) =>
          dispatch({ type: "SET", payload: { vehicleId: t } })
        }
        style={{
          borderWidth: 1,
          borderColor: "#EEE",
          padding: 12,
          borderRadius: 8,
        }}
      />
      <SpaceComponent height={8} />
      <TextInput
        placeholder="Ghi chú (tùy chọn)"
        value={state.notes}
        onChangeText={(t) => dispatch({ type: "SET", payload: { notes: t } })}
        style={{
          borderWidth: 1,
          borderColor: "#EEE",
          padding: 12,
          borderRadius: 8,
          minHeight: 80,
        }}
        multiline
      />
    </View>
  );
};

export default VehicleInfoStep;
