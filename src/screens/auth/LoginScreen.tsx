import { Lock, Sms } from "iconsax-react-nativejs";
import React, { useState } from "react";
import { Image, Switch } from "react-native";
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

const initValue = {
  phone: "",
  password: "",
};

const LoginScreen = ({ navigation }: any) => {
  const [isRemember, setIsRemember] = useState(true);

  const [values, setValues] = useState(initValue);

  const hanldeChange = (key: string, value: string) => {
    const data: any = { ...values };
    data[`${key}`] = value;
    setValues(data);
  };

  return (
    <ContainerComponent isImageBackground isScroll>
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
          text="Đăng nhập"
          size={24}
          font={fontFamilies.roboto_medium}
        />
        <SpaceComponent height={20} />
        <InputComponent
          value={values.phone}
          onChange={(val) => hanldeChange("phone", val)}
          placeholder="Số điện thoại"
          allowClear
          affix={<Sms size={22} color={appColor.gray} />}
        />

        <InputComponent
          value={values.password}
          onChange={(val) => hanldeChange("password", val)}
          placeholder="Mật khẩu"
          allowClear
          isPassword
          affix={<Lock size={22} color={appColor.gray} />}
        />

        <RowComponent justify="space-between">
          <RowComponent onPress={() => setIsRemember(!isRemember)}>
            <Switch
              trackColor={{ true: appColor.primary }}
              thumbColor={appColor.white}
              value={isRemember}
              onChange={() => setIsRemember(!isRemember)}
            />
            <TextComponent text="Ghi nhớ" />
          </RowComponent>
          <ButtonComponent
            text="Quên mật khẩu"
            type="text"
            onPress={() => navigation.navigate("ForgotPassword")}
          />
        </RowComponent>
      </SectionComponent>
      <SpaceComponent height={16} />
      <SectionComponent>
        <ButtonComponent text="Đăng nhập" type="primary" />
      </SectionComponent>
      <SpaceComponent height={16} />
      <SectionComponent>
        <RowComponent justify="center">
          <TextComponent text="Bạn chưa có tài khoản? " />
          <ButtonComponent
            text="Đăng ký"
            type="link"
            onPress={() => navigation.navigate("RegisterScreen")}
          />
        </RowComponent>
      </SectionComponent>
    </ContainerComponent>
  );
};

export default LoginScreen;
