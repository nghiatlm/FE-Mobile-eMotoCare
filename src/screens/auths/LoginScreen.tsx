import React, { useEffect, useState } from "react";
import { Alert, Image, Switch } from "react-native";
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { fontFamilies } from "../../constants/fontFamilies";
import { appColor } from "../../constants/appColor";
import { Feather } from "@expo/vector-icons";
import { Lock } from "iconsax-react-nativejs";
import { login } from "../../services/auth.service";

const initValue = {
  phone: "",
  password: "",
};

const LoginScreen = ({ navigation }: any) => {
  const [isRemember, setIsRemember] = useState(true);
  type Errors = { phone?: string; password?: string };
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState(initValue);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (values.phone || values.password) {
      setErrors({});
    }
  }, [values.phone, values.password]);

  const hanldeChange = (key: string, value: string) => {
    const data: any = { ...values };
    data[`${key}`] = value;
    setValues(data);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setErrors({});
    console.log("Login values: ", values, isRemember);
    const res = await login(values, isRemember);
    if (res.success) {
      console.log("Login successful:", res.data);
    } else {
      console.log("Login failed:", res.message, res.errors);
      if (res.errors) {
        setErrors(res.errors as Errors);
      } else {
        Alert.alert("Đăng nhập thất bại", res.message || "Vui lòng thử lại.");
      }
    }
    setIsLoading(false);
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
          affix={<Feather name="phone" size={22} color={appColor.gray} />}
          error={errors.phone}
        />

        <InputComponent
          value={values.password}
          onChange={(val) => hanldeChange("password", val)}
          placeholder="Mật khẩu"
          allowClear
          isPassword
          affix={<Lock size={22} color={appColor.gray} />}
          error={errors.password}
        />
      </SectionComponent>

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
      <SpaceComponent height={16} />
      <SectionComponent>
        <ButtonComponent
          text="Đăng nhập"
          type="primary"
          onPress={handleLogin}
        />
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
