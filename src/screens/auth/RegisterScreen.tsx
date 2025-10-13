import { Lock, Sms } from "iconsax-react-nativejs";
import React, { useState } from "react";
import { Image } from "react-native";
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";

const RegisterScreen = ({ navigation }: any) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // thực hiện gọi api, sau khi thành công thì gọi đến verify
    navigation.navigate("Verification", {
      code: '1234',
      email: 'n@gmail.com',
      password: '12345',
      phone: '212342354'
    });
  };

  return (
    <ContainerComponent isImageBackground isScroll back>
      <SectionComponent
        styles={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 75,
        }}
      >
        <Image
          source={require("../../assets/images/logo.png")}
          style={{
            width: 162,
            height: 200,
            marginBottom: 30,
          }}
        />
      </SectionComponent>
      <SectionComponent>
        <TextComponent
          text="Đăng ký"
          size={24}
          font={fontFamilies.roboto_medium}
        />
        <SpaceComponent height={20} />
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
      </SectionComponent>
      <SpaceComponent height={16} />
      <SectionComponent>
        <ButtonComponent
          text="Đăng ký"
          type="primary"
          onPress={handleRegister}
        />
      </SectionComponent>
      <SpaceComponent height={16} />
      <SectionComponent>
        <RowComponent justify="center">
          <TextComponent text="Bạn đã có tài khoản? " />
          <ButtonComponent
            text="Đăng nhập"
            type="link"
            onPress={() => navigation.navigate("LoginScreen")}
          />
        </RowComponent>
      </SectionComponent>
    </ContainerComponent>
  );
};

export default RegisterScreen;
