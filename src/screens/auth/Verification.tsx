import React, { useEffect, useRef, useState } from "react";
import {
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { StyleSheet, TextInput, View } from "react-native";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { ArrowRight } from "iconsax-react-nativejs";
import { globalStyle } from "../../styles/globalStyle";
import authenticationAPI from "../../apis/authApi";
import { LoadingModal } from "../../modal";

const Verification = ({ navigation, route }: any) => {
  const { code, email, password, phone } = route.params;

  const [currentCode, setCurrentCode] = useState(code);
  const [codeValues, setCodeValues] = useState<string[]>([]);
  const [newCode, setNewCode] = useState("");
  const [limit, setLimit] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const ref1 = useRef<any>(null);
  const ref2 = useRef<any>(null);
  const ref3 = useRef<any>(null);
  const ref4 = useRef<any>(null);

  useEffect(() => {
    ref1.current.focus();
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

  const handleChangeCode = (val: string, index: number) => {
    const data = [...codeValues];
    data[index] = val;
    setCodeValues(data);
  };

  const handleResendVerification = async () => {
    const api = "/verification";
    setIsLoading(true);
    try {
      const res: any = await authenticationAPI.HandleAuthentication(
        api,
        { email },
        "post"
      );
      setLimit(20);
      setCurrentCode(res.data.code);
      setIsLoading(false);
    } catch (error) {
      console.log(`Can not send verification code ${error}`);
      setIsLoading(false);
    }
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
            style={[styles.input]}
            maxLength={1}
            onChangeText={(val) => {
              val.length > 0 && ref4.current.focus();
              handleChangeCode(val, 2);
            }}
            placeholder="-"
          />
          <TextInput
            ref={ref4}
            style={[styles.input]}
            maxLength={1}
            onChangeText={(val) => {
              handleChangeCode(val, 3);
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
          disbale={newCode.length !== 4}
          onPress={() => {}}
          iconFlex="right"
          icon={
            <View
              style={[
                globalStyle.iconContainer,
                {
                  backgroundColor:
                    newCode.length !== 4 ? appColor.gray : appColor.primary,
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
      <LoadingModal visible={isLoading} />
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
