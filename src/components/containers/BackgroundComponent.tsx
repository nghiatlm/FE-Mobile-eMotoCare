import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "iconsax-react-nativejs";
import React, { ReactNode } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import { appColor } from "../../constants/appColor";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fontFamilies } from "../../constants/fontFamilies";
import TextComponent from "../ui/TextComponent";

interface Props {
  isScroll?: boolean;
  title?: string;
  children: ReactNode;
  back?: boolean;
  footer?: ReactNode;
}

const BackgroundComponent = (props: Props) => {
  const { isScroll, title, children, back, footer } = props;
  const navigation = useNavigation();

  const topPadding =
    Platform.OS === "android" ? StatusBar.currentHeight || 24 : 54;

  const insets = useSafeAreaInsets();
  const FOOTER_HEIGHT = 72;

  return (
    <View
      style={[
        {
          backgroundColor: appColor.primary,
          flex: 1,
        },
      ]}
    >
      <View
        style={{
          paddingTop: topPadding,
          paddingBottom: 18,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: appColor.primary,
          width: "100%",
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
          overflow: "hidden",
        }}
      >
        {back && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ position: "absolute", left: 16, top: topPadding + 6 }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ArrowLeft size={22} color={appColor.white} />
          </TouchableOpacity>
        )}

        {title ? (
          <TextComponent
            text={title}
            font={fontFamilies.roboto_medium}
            size={24}
            color={appColor.white}
            styles={{ textAlign: "center" }}
          />
        ) : null}
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: appColor.white,
          marginTop: -12,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingTop: 10,
          paddingHorizontal: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <View style={{ flex: 1 }}>
          {isScroll ? (
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: footer ? FOOTER_HEIGHT + (insets?.bottom ?? 0) : (insets?.bottom ?? 0) + 100,
                }}
                style={{ flex: 1 }}
              >
              {children}
            </ScrollView>
          ) : (
            <View style={{ flex: 1, paddingBottom: footer ? FOOTER_HEIGHT + (insets?.bottom ?? 0) : (insets?.bottom ?? 0) + 16 }}>{children}</View>
          )}
        </View>

        {footer ? (
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: FOOTER_HEIGHT,
              backgroundColor: appColor.white,
              justifyContent: "center",
              alignItems: "center",
              elevation: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.06,
              shadowRadius: 6,
            }}
          >
            <View style={{ width: "100%", paddingHorizontal: 12 }}>
              {footer}
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default BackgroundComponent;
