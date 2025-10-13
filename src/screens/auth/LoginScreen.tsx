import { Lock, Sms } from "iconsax-react-nativejs";
import React, { useEffect, useState } from "react";
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
import { LoadingModal } from "../../modal";
import { Validate } from "../../utils/validate";
import authenticationAPI from "../../apis/authApi";
import { useDispatch } from "react-redux";
import { addAuth } from "../../redux/reducers/authReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initValue = {
  email: "",
  password: "",
};

const LoginScreen = ({ navigation }: any) => {
  const [isRemember, setIsRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [values, setValues] = useState(initValue);

  const dispatch = useDispatch();

  useEffect(() => {
    if (values.email || values.password) {
      setErrorMessage("");
    }
  }, [values.email, values.password]);

  const hanldeChange = (key: string, value: string) => {
    const data: any = { ...values };
    data[`${key}`] = value;
    setValues(data);
  };

  const handleLogin = async () => {
    const { email, password } = values;
    // const phoneValid = Validate.Phone(phone);
    const passValid = Validate.Password(password);
    // if (phone && password) {
    //   if (phoneValid && passValid) {
    //     setErrorMessage("");
    setIsLoading(true);
    try {
      const res = await authenticationAPI.HandleAuthentication(
        "/login",
        values,
        "post"
      );
      console.log("Login success: ", res.data);
      dispatch(addAuth(res.data));
      await AsyncStorage.setItem(
        "auth",
        isRemember ? JSON.stringify(res.data) : email
      );
      setIsLoading(false);
    } catch (error) {
      console.log("Login error: ", error);
      setIsLoading(false);
    }
    //   } else {
    //     setErrorMessage("Số điện thoại không hợp lệ");
    //     return;
    //   }
    // } else {
    //   setErrorMessage("Vui lòng nhập đầy đủ thông tin");
    // }
  };

  return (
    <>
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
            value={values.email}
            onChange={(val) => hanldeChange("email", val)}
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

        {errorMessage && (
          <SectionComponent>
            <TextComponent text={errorMessage} color={appColor.danger} />
          </SectionComponent>
        )}
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
      <LoadingModal visible={isLoading} />
    </>
  );
};

export default LoginScreen;
