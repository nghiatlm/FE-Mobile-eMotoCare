import { Lock, Sms } from "iconsax-react-nativejs";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image } from "react-native";
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
import authenticationAPI from "../../apis/authApi";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { auth, default as app } from "../../../firebaseConfig";
import { signInWithPhoneNumber } from "firebase/auth";
import { setConfirmation as storeSetConfirmation } from "../../utils/phoneAuthStore";

const initValue = {
  phone: "",
  password: "",
};

const RegisterScreen = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [otp, setOtp] = useState("670030");
  const [values, setValues] = useState(initValue);
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);
  const [confirmationLocal, setConfirmationLocal] = useState<any>(null);

  useEffect(() => {
    if (values.phone || values.password) {
      setErrorMessage("");
    }
  }, [values.phone, values.password]);

  const hanldeChange = (key: string, value: string) => {
    const data: any = { ...values };
    data[`${key}`] = value;
    setValues(data);
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const res = await authenticationAPI.HandleAuthentication(
        "/register",
        values,
        "post"
      );
      console.log("Login success: ", res.data);
      if (res.data.success) {
        // wait for recaptcha and otp send to complete before navigating
        const confirmationResult = await sendOTP(values.phone);
        if (confirmationResult) {
          // store confirmation for Verification screen (avoid passing big object through navigation)
          setConfirmationLocal(confirmationResult);
          storeSetConfirmation(confirmationResult);
          // only navigate after recaptcha + OTP sent
          navigation.navigate("Verification", {
            phone: values.phone,
          });
        } else {
          Alert.alert("Không thể gửi OTP", "Vui lòng thử lại sau.");
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Login error: ", error);
      setIsLoading(false);
    }
  };

  const sendOTP = async (phoneNumber: string) => {
    if (!recaptchaVerifier.current) {
      Alert.alert("Recaptcha chưa sẵn sàng");
      return null;
    }
    try {
      let formattedPhone = phoneNumber;
      if (!formattedPhone.startsWith("+")) {
        formattedPhone = "+84" + formattedPhone.replace(/^0/, "");
      }
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaVerifier.current
      );
  setConfirmationLocal(confirmationResult);
  storeSetConfirmation(confirmationResult);
      Alert.alert("Success", "OTP đã gửi!");
      return confirmationResult;
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Gửi OTP thất bại");
      return null;
    }
  };

  return (
    <ContainerComponent isImageBackground isScroll back>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
        // prefer visible reCAPTCHA when Enterprise isn't initialized
        attemptInvisibleVerification={false}
        androidLayerType="software"
      />
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
        <TextComponent text="Đăng ký" size={24} font={fontFamilies.roboto_medium} />
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
