import {
  View,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { ReactNode } from "react";
import { globalStyle } from "../../styles/globalStyle";
import { useNavigation } from "@react-navigation/native";
import RowComponent from "./RowComponent";
import ButtonComponent from "../ui/ButtonComponent";
import { ArrowLeft } from "iconsax-react-nativejs";
import { appColor } from "../../constants/appColor";
import TextComponent from "../ui/TextComponent";
import { fontFamilies } from "../../constants/fontFamilies";

interface Props {
  isImageBackground?: boolean;
  isScroll?: boolean;
  title?: string;
  children: ReactNode;
  back?: boolean;
}

const ContainerComponent = (props: Props) => {
  const { isImageBackground, isScroll, title, children, back } = props;

  const navigation = useNavigation();

  const headerComponent = () => {
    return (
      <View style={{ flex: 1, paddingTop: 30 }}>
        {(title || back) && (
          <RowComponent
            styles={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              minWidth: 48,
              minHeight: 48,
            }}
          >
            {back && (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{marginRight: 12}}>
                <ArrowLeft size={24} color={appColor.text} />
              </TouchableOpacity>
            )}
            {title ? (
              <TextComponent
                text={title}
                font={fontFamilies.roboto_medium}
                size={20}
                flex={1}
              />
            ) : (
              <></>
            )}
          </RowComponent>
        )}
        {returnContainer}
      </View>
    );
  };

  const returnContainer = isScroll ? (
    <ScrollView style={{ flex: 1 }}>{children}</ScrollView>
  ) : (
    <View style={{ flex: 1 }}>{children}</View>
  );

  return isImageBackground ? (
    <ImageBackground
      source={require("../../assets/images/splash-image.png")}
      style={{ flex: 1 }}
      imageStyle={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>{headerComponent()}</SafeAreaView>
    </ImageBackground>
  ) : (
    <SafeAreaView style={[globalStyle.container]}>
      <View>{headerComponent()}</View>
    </SafeAreaView>
  );
};

export default ContainerComponent;
