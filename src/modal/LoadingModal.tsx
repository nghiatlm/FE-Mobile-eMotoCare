import { View, Text, Modal, ActivityIndicator } from "react-native";
import React from "react";
import { globalStyle } from "../styles/globalStyle";
import { TextComponent } from "../components";
import { appColor } from "../constants/appColor";

interface Props {
  visible: boolean;
  mess?: string;
}

const LoadingModal = (props: Props) => {
  const { visible, mess } = props;

  return (
    <Modal
      visible={visible}
      style={[
        {
          flex: 1,
        },
      ]}
      transparent
      statusBarTranslucent
    >
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <ActivityIndicator color={appColor.white} size={32} />
        <TextComponent text="Loading..." flex={0} color={appColor.white} />
      </View>
    </Modal>
  );
};

export default LoadingModal;
