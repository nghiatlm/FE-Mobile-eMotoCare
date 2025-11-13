import { View, Text } from "react-native";
import React from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import {
  BackgroundComponent,
  ButtonComponent,
  SectionComponent,
} from "../../components";
import { fontFamilies } from "../../constants/fontFamilies";
import { appColor } from "../../constants/appColor";

const ServiceScreen = ({ navigation }: any) => {
  return (
    <BackgroundComponent title="Dịch vụ">
      <SectionComponent>
        <ButtonComponent
          leftIcon={<FontAwesome6 name="car-side" size={18} color={appColor.primary} />}
          rightIcon={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome6 name="chevron-right" size={16} color={appColor.gray2} />
            </View>
          }
          text="Bảo dưỡng"
          textStyle={{
            fontFamily: fontFamilies.roboto_bold,
            fontSize: 20,
          }}
        />
        <ButtonComponent
          leftIcon={<FontAwesome6 name="wrench" size={18} color={appColor.primary} />}
          rightIcon={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ backgroundColor: appColor.warning, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, marginRight: 8 }}>
                <Text style={{ color: '#000', fontSize: 12, fontFamily: fontFamilies.roboto_medium }}>Mới</Text>
              </View>
              <FontAwesome6 name="chevron-right" size={16} color={appColor.gray2} />
            </View>
          }
          text="Sửa chữa"
          textStyle={{ fontFamily: fontFamilies.roboto_bold, fontSize: 20 }}
          onPress={() => navigation.navigate("CreateRepairScreen")}
        />
        <ButtonComponent
          leftIcon={<FontAwesome6 name="shield-check" size={18} color={appColor.primary} />}
          rightIcon={<FontAwesome6 name="chevron-right" size={16} color={appColor.gray2} />}
          text="Bảo hành"
          textStyle={{ fontFamily: fontFamilies.roboto_bold, fontSize: 20 }}
        />
      </SectionComponent>
    </BackgroundComponent>
  );
};

export default ServiceScreen;
