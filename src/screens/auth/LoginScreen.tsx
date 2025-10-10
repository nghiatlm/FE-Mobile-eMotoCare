import React from "react";
import { Text, View } from "react-native";
import { ButtonComponent } from "../../components";
import { globalStyle } from "../../styles/globalStyle";

const LoginScreen = () => {
  return (
    <View style={[globalStyle.container, { padding: 16 }]}>
      <Text>LoginScreen</Text>
      <ButtonComponent
        text="Đăng nhập"
        onPress={() => console.log("login")}
        icon={
          <View>
            <Text>N</Text>
          </View>
        }
      />
    </View>
  );
};

export default LoginScreen;
