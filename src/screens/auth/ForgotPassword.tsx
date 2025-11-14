import { ArrowRight, Sms } from "iconsax-react-nativejs";
import React, { useState } from "react";
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { appColor } from "../../constants/appColor";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  return (
    <ContainerComponent back isImageBackground>
      <SpaceComponent height={150} />
      <SectionComponent>
        <TextComponent text="Reset Password" title />
        <TextComponent text="Nhập số điện thoạt để cập nhật mật khẩu" />
        <SpaceComponent height={30} />
        <InputComponent
          value={email}
          onChange={(val) => setEmail(val)}
          affix={<Sms size={20} color={appColor.gray} />}
          placeholder="email@example.com"
        />
      </SectionComponent>
      <SectionComponent>
        <ButtonComponent text="Gửi" type="primary" icon={<ArrowRight size={20} color={appColor.white}/>} iconFlex="right" />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default ForgotPassword;
