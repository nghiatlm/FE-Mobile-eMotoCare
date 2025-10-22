import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  View,
  Platform,
  StyleSheet,
} from "react-native";
import {
  ButtonComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../../components";
import { globalStyle } from "../../../styles/globalStyle";
import { fontFamilies } from "../../../constants/fontFamilies";
import { appColor } from "../../../constants/appColor";

const SuccessScreen = ({ navigation, route }: any) => {
  const { id } = route.params;

  const handleViewDetail = () => {
    navigation.navigate("AppointmentDetail", { id });
  };

  return (
    <View style={[globalStyle.container, styles.container]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require("../../../assets/images/Frame.png")}
          style={styles.image}
        />

        <SectionComponent styles={styles.textSection}>
          <TextComponent
            text="Đặt lịch thành công!"
            font={fontFamilies.roboto_bold}
            color={appColor.primary}
            size={28}
            styles={styles.title}
          />
          <SpaceComponent height={8} />
          <TextComponent
            text="Chúng tôi đã nhận được yêu cầu của bạn. Hãy kiểm tra chi tiết lịch hẹn trong phần thông tin chi tiết."
            font={fontFamilies.roboto_regular}
            size={16}
            color={appColor.gray2}
            styles={styles.subtitle}
          />
        </SectionComponent>

        <SectionComponent styles={styles.buttonSection}>
          <ButtonComponent
            text="Xem chi tiết"
            type="primary"
            onPress={handleViewDetail}
          />
          <SpaceComponent height={16} />
          <ButtonComponent
            text="Về trang chủ"
            type="link"
            onPress={() => navigation.navigate("Home")}
          />
        </SectionComponent>
      </ScrollView>
    </View>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    paddingVertical: Platform.OS === "android" ? 40 : 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  image: {
    height: 280,
    width: "100%",
    resizeMode: "contain",
    marginBottom: 20,
  },
  textSection: {
    alignItems: "center",
    textAlign: "center",
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 22,
    marginHorizontal: 10,
  },
  buttonSection: {
    width: "100%",
    marginTop: 30,
  },
});
