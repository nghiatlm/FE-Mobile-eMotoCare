import { Feather } from "@expo/vector-icons";
import { Lock } from "iconsax-react-nativejs";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Modal, Switch, View } from "react-native";
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
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (values.phone || values.password) {
      setErrors({});
      setErrorMessage("");
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
    setErrorMessage("");
    console.log("Login values: ", values, isRemember);
    const res = await login(values, isRemember);
    setIsLoading(false);
    if (res.success) {
      console.log("Login successful:", res.data);
    } else {
      console.log("Login failed:", res.message, res.errors);
      if (res.errors) {
        setErrors(res.errors as Errors);
      } else {
        setErrorMessage(res.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      }
    }
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

      {errorMessage ? (
        <SectionComponent>
          <View
            style={{
              backgroundColor: appColor.danger50,
              padding: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: appColor.danger,
            }}
          >
            <TextComponent
              text={errorMessage}
              color={appColor.danger}
              size={14}
              font={fontFamilies.roboto_medium}
            />
          </View>
        </SectionComponent>
      ) : null}

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

      <Modal
        visible={isLoading}
        transparent
        animationType="fade"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: appColor.white,
              padding: 24,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color={appColor.primary} />
            <SpaceComponent height={12} />
            <TextComponent
              text="Đang đăng nhập..."
              color={appColor.text}
              size={16}
            />
          </View>
        </View>
      </Modal>
    </ContainerComponent>
  );
};

export default LoginScreen;
