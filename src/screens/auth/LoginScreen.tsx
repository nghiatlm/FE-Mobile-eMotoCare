import React, { useState } from "react";
import { Text, View } from "react-native";
import { ButtonComponent, InputComponent } from "../../components";
import { globalStyle } from "../../styles/globalStyle";
import { Lock, Sms } from "iconsax-react-nativejs";
import { appColor } from "../../constants/appColor";

const LoginScreen = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View
      style={[
        globalStyle.container,
        {
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        },
      ]}
    >
      <InputComponent
        value={phone}
        onChange={(val) => setPhone(val)}
        placeholder="Số điện thoại"
        allowClear
        affix={<Sms size={22} color={appColor.gray} />}
      />

      <InputComponent
        value={password}
        onChange={(val) => setPassword(val)}
        placeholder="Mật khẩu"
        allowClear
        isPassword
        affix={<Lock size={22} color={appColor.gray} />}
      />
    </View>
  );
};

export default LoginScreen;
