import { View, Text, Image, ImageBackground, Button } from "react-native";
import React from "react";
import { globalStyle } from "../../styles/globalStyle";
import { appInfor } from "../../constants/appInfor";
import { SpaceComponent, TextComponent } from "../../components";
import { appColor } from "../../constants/appColor";
import { useNavigation } from "@react-navigation/native";
import { fontFamilies } from "../../constants/fontFamilies";

const OnbroadingScreen = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={[globalStyle.container]}>
      <ImageBackground
        source={require("../../assets/images/splash-image.png")}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        imageStyle={{ flex: 1 }}
      >
        <Image
          source={require("../../assets/images/logo.png")}
          style={{
            width: appInfor.size.width * 0.6,
            height: appInfor.size.height * 0.2,
            resizeMode: "contain",
          }}
        />
        <SpaceComponent height={20} />

        <Text
          style={{
            color: appColor.text,
            fontSize: 16,
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          Chào mừng bạn đến với{"\n "}
          <TextComponent
            text="eMotoCare"
            size={20}
            color={appColor.primary}
            font={fontFamilies.roboto_medium}
          />
        </Text>
        <View
          style={{
            width: appInfor.size.width,
            height: appInfor.size.height * 0.1,
            marginTop: 20,
            paddingHorizontal: 20,
          }}
        >
          <View style={{ borderRadius: 8, overflow: "hidden" }}>
            <Button
              title="Tiếp tục"
              onPress={() => navigation.navigate("LoginScreen")}
              color={appColor.primary}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default OnbroadingScreen;
