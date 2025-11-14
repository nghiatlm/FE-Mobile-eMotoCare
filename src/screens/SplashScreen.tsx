import React from "react";
import { ActivityIndicator, Image, ImageBackground } from "react-native";
import { appInfor } from "../constants/appInfor";
import { SpaceComponent } from "../components";
import { appColor } from "../constants/appColor";

const SplashScreen = () => {
  return (
    <ImageBackground
      source={require("../assets/images/splash-image.png")}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      imageStyle={{ flex: 1 }}
    >
      <Image
        source={require("../assets/images/logo.png")}
        style={{
          width: appInfor.size.width * 0.7,
          resizeMode: "contain",
        }}
      />
      <SpaceComponent height={16} />
      <ActivityIndicator color={appColor.gray} size={22} />
    </ImageBackground>
  );
};

export default SplashScreen;
