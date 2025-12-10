import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import {
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { globalStyle } from "../../styles/globalStyle";
import { ArrowRight } from "iconsax-react-nativejs";
import { verifycation } from "../../services/auth.service";

const Verification = ({ navigation, route }: any) => {
  const { phone } = route.params;

  const [confirmation, setConfirmation] = useState<any>(
    route.params?.confirmation ?? null
  );

  const [codeValues, setCodeValues] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [newCode, setNewCode] = useState("");
  const [limit, setLimit] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const ref1 = useRef<any>(null);
  const ref2 = useRef<any>(null);
  const ref3 = useRef<any>(null);
  const ref4 = useRef<any>(null);
  const ref5 = useRef<any>(null);
  const ref6 = useRef<any>(null);

  useEffect(() => {
    // if confirmation not passed via route, try reading from phoneAuthStore
    if (!confirmation) {
      try {
        const { getConfirmation } = require("../../utils/phoneAuthStore");
        const stored = getConfirmation();
        if (stored) setConfirmation(stored);
      } catch (e) {
        console.warn("phoneAuthStore not available", e);
      }
    }
  }, []);

  useEffect(() => {
    ref1.current && ref1.current.focus();
    // if code provided from route params, autofill
    if (route.params?.code) {
      const provided: string = String(route.params.code);
      const digits = provided.split("").slice(0, 6);
      const filled = ["", "", "", "", "", ""];
      digits.forEach((d, i) => (filled[i] = d));
      setCodeValues(filled);
    }
  }, []);

  useEffect(() => {
    let item = "";
    codeValues.forEach((val) => (item += val));
    setNewCode(item);
  }, [codeValues]);

  useEffect(() => {
    if (limit > 0) {
      const interval = setInterval(() => {
        limit > 0 && setLimit((limit) => limit - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  // const [currentCode, setCurrentCode] = useState(code);

  const handleChangeCode = (val: string, index: number) => {
    const data = [...codeValues];
    data[index] = val;
    setCodeValues(data);
  };

  const handleConfirm = async () => {
    if (newCode.length !== 6) return;
    if (!confirmation) {
      Alert.alert("Lỗi", "Không có phiên xác thực. Vui lòng gửi lại mã OTP.");
      return;
    }
    try {
      setIsLoading(true);
      const userCredential: any = await confirmation.confirm(newCode);
      //   // get idToken from firebase user
      const idToken = await userCredential.user.getIdToken();
      console.log("token: ", idToken);
      //   // send idToken to backend for verification / account creation
      const res = await verifycation({ idToken });
      if (res.success) {
        setIsLoading(false);

        //   Alert.alert("Thành công", "Xác thực hoàn tất.");
        navigation.navigate("LoginScreen");
      } else {
        setIsLoading(false);
        Alert.alert("Lỗi xác thực", res.message || "Xác thực thất bại.");
      }
    } catch (err: any) {
      console.warn("Confirm error", err);
      setIsLoading(false);
      Alert.alert(
        "Lỗi xác thực",
        err?.message || "Mã không đúng hoặc đã hết hạn"
      );
    }
  };

  const handleResendVerification = async () => {
    // setIsLoading(true);
    // try {
    //   // ask backend to resend (if your backend supports it); otherwise you can re-trigger Firebase send
    //   await authenticationAPI.HandleAuthentication("/resend-otp", { phone }, "post");
    //   setLimit(20);
    //   setIsLoading(false);
    //   Alert.alert("Thông báo", "Mã OTP đã được gửi lại");
    // } catch (error) {
    //   console.warn(`Can not resend verification code ${error}`);
    //   setIsLoading(false);
    //   Alert.alert("Lỗi", "Không thể gửi lại mã OTP. Vui lòng thử lại sau.");
    // }
  };

  return (
    <ContainerComponent back isImageBackground isScroll>
      <SectionComponent>
        <TextComponent text="Xác thực OTP " title />
        <SpaceComponent height={12} />
        <TextComponent
          text={`Nhập mã xác minh mà chúng tôi vừa gửi đến số điện thoại của bạn ${phone.replace(
            /.{1, 5}/,
            (m: any) => "*".repeat(m.length)
          )}`}
        />

        <SpaceComponent height={200} />
        <RowComponent justify="space-around">
          <TextInput
            keyboardType="number-pad"
            ref={ref1}
            value={codeValues[0]}
            style={[styles.input]}
            maxLength={1}
            onChangeText={(val) => {
              val.length > 0 && ref2.current.focus();
              handleChangeCode(val, 0);
            }}
            placeholder="-"
          />
          <TextInput
            keyboardType="number-pad"
            ref={ref2}
            value={codeValues[1]}
            style={[styles.input]}
            maxLength={1}
            onChangeText={(val) => {
              handleChangeCode(val, 1);
              val.length > 0 && ref3.current.focus();
            }}
            placeholder="-"
          />
          <TextInput
            keyboardType="number-pad"
            ref={ref3}
            value={codeValues[2]}
            style={[styles.input]}
            maxLength={1}
            onChangeText={(val) => {
              val.length > 0 && ref4.current.focus();
              handleChangeCode(val, 2);
            }}
            placeholder="-"
          />
          <TextInput
            keyboardType="number-pad"
            ref={ref4}
            value={codeValues[3]}
            style={[styles.input]}
            maxLength={1}
            onChangeText={(val) => {
              val.length > 0 && ref5.current.focus();
              handleChangeCode(val, 3);
            }}
            placeholder="-"
          />
          <TextInput
            keyboardType="number-pad"
            ref={ref5}
            value={codeValues[4]}
            style={[styles.input]}
            maxLength={1}
            onChangeText={(val) => {
              val.length > 0 && ref6.current.focus();
              handleChangeCode(val, 4);
            }}
            placeholder="-"
          />
          <TextInput
            ref={ref6}
            value={codeValues[5]}
            style={[styles.input]}
            maxLength={1}
            onChangeText={(val) => {
              handleChangeCode(val, 5);
              val.length > 0 && console.log("newcode: ", newCode);
            }}
            keyboardType="number-pad"
            placeholder="-"
          />
        </RowComponent>
      </SectionComponent>
      <SectionComponent
        styles={{
          marginTop: 40,
        }}
      >
        <ButtonComponent
          text="Tiếp tục"
          type="primary"
          // disbale={newCode.length !== 6}
          onPress={handleConfirm}
          iconFlex="right"
          icon={
            <View
              style={[
                globalStyle.iconContainer,
                {
                  backgroundColor:
                    newCode.length !== 6 ? appColor.gray : appColor.primary,
                },
              ]}
            >
              <ArrowRight size={30} color={appColor.white} />
            </View>
          }
        />
      </SectionComponent>
      <SectionComponent>
        {limit > 0 ? (
          <RowComponent justify="center">
            <TextComponent text="Gửi lại mã " flex={0} size={16} />
            <TextComponent
              text={`00:${limit}`}
              flex={0}
              color={appColor.primary}
              size={16}
            />
          </RowComponent>
        ) : (
          <RowComponent>
            <ButtonComponent
              type="link"
              text="Gửi lại mã"
              onPress={handleResendVerification}
            />
          </RowComponent>
        )}
      </SectionComponent>
      {/* <LoadingModal visible={isLoading} /> */}
    </ContainerComponent>
  );
};

export default Verification;

const styles = StyleSheet.create({
  input: {
    height: 55,
    width: 55,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColor.gray,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 24,
    fontFamily: fontFamilies.roboto_bold,
    textAlign: "center",
  },
});
