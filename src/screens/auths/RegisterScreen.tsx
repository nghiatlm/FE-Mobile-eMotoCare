import { getAuth, signInWithPhoneNumber } from "@react-native-firebase/auth";
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
import { register } from "../../services/auth.service";

const initValue = {
  phone: "",
  password: "",
};

const RegisterScreen = ({ navigation }: any) => {
  const [values, setValues] = useState(initValue);
  const [isLoading, setIsLoading] = useState(false);
  const [confirm, setConfirm] = useState<any>(null);

  const handleSignInWithPhoneNumber = async (phone: string) => {
    try {
      let formattedPhone = phone;
      if (!formattedPhone.startsWith("+")) {
        formattedPhone = "+84" + formattedPhone.replace(/^0/, "");
      }
      const confirmatiom = await signInWithPhoneNumber(
        getAuth(),
        formattedPhone
      );
      setConfirm(confirmatiom);
      return confirmatiom;
    } catch (err: any) {
      console.log("OTP Error:", err);
      return null;
    }
  };

  const hanldeChange = (key: string, value: string) => {
    const data: any = { ...values };
    data[`${key}`] = value;
    setValues(data);
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const res = await register(values);
      console.log("Register response tsx: ", res);
      if (res.success) {
        const confirmation = await handleSignInWithPhoneNumber(values.phone);
        navigation.navigate("Verification", {
          phone: values.phone,
          confirmation: confirmation,
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Register error: ", error);
      setIsLoading(false);
    }
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
