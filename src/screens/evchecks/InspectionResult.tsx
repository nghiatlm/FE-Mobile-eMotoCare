import { AntDesign, Ionicons, Octicons } from "@expo/vector-icons";
import React from "react";
import { Image, Platform, View } from "react-native";
import {
  BackgroundComponent,
  ButtonComponent,
  DividerWithLabelComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { globalStyle } from "../../styles/globalStyle";

const InspectionResult = ({ navigation, route }: any) => {
  const appointmentId = route?.params?.appointmentId;

  const confirmHandler = () => {
    // gửi thông tin trạng thái mới cho MaintenanceProcess
    navigation.navigate("MaintenanceProcess", {
      appointmentId,
      statusUpdate: {
        // step là số (map với UI timeline trong MaintenanceProcess)
        step: 5, // ví dụ: đổi sang bước "Đang trong quá trình sửa chữa" (tùy mapping)
        title: "Sửa chữa",
        desc: "Phương tiện của bạn đang được sửa chữa",
      },
    });
  };

  const cancelHandler = () => {
    navigation.goBack();
  };

  const footer = (
    <View
      style={{
        padding: 12,
        backgroundColor: appColor.white,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderTopWidth: 1,
        borderColor: "#EEE",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <RowComponent styles={{ width: "100%" }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <ButtonComponent
            text="Hủy"
            onPress={cancelHandler}
            styles={{
              width: "100%",
              backgroundColor: "#E53935",
              borderColor: "#E53935",
              paddingVertical: 14,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
            textStyle={{
              color: "#fff",
              fontSize: 16,
              fontFamily: fontFamilies.roboto_medium,
            }}
          />
        </View>

        <View style={{ flex: 1 }}>
          <ButtonComponent
            text="Xác nhận"
            onPress={confirmHandler}
            styles={{
              width: "100%",
              backgroundColor: appColor.primary,
              borderColor: appColor.primary,
              paddingVertical: 14,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
            textStyle={{
              color: "#fff",
              fontSize: 16,
              fontFamily: fontFamilies.roboto_medium,
            }}
          />
        </View>
      </RowComponent>
    </View>
  );

  return (
    <BackgroundComponent back title="Kết quả kiểm tra" isScroll footer={footer}>
      <SpaceComponent height={16} />

      {/* Thông tin chung card */}
      <SectionComponent
        styles={[
          globalStyle.row,
          {
            backgroundColor: appColor.white,
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: appColor.gray,
            shadowColor: "#000",
            shadowOpacity: 0.03,
            shadowRadius: 6,
            elevation: 2,
          },
        ]}
      >
        <RowComponent
          justify="flex-start"
          styles={{ flex: 1, gap: 12, alignItems: "flex-start" }}
        >
          <Ionicons
            name="information-circle-outline"
            size={26}
            color={appColor.primary}
          />
          <View style={{ flex: 1 }}>
            <TextComponent
              text="Thông tin chung"
              size={Platform.OS === "ios" ? 20 : 18}
              font={fontFamilies.roboto_medium}
            />
            <SpaceComponent height={8} />

            <RowComponent justify="flex-start">
              <TextComponent
                text="Kiểu xe:"
                size={Platform.OS === "ios" ? 18 : 14}
                font={fontFamilies.roboto_medium}
              />
              <TextComponent
                text=" VINFAST KLARA"
                size={Platform.OS === "ios" ? 18 : 14}
                styles={{ marginLeft: 8 }}
              />
            </RowComponent>

            <SpaceComponent height={6} />

            <RowComponent justify="flex-start">
              <TextComponent
                text="Nội dung:"
                size={Platform.OS === "ios" ? 18 : 14}
                font={fontFamilies.roboto_medium}
              />
              <TextComponent
                text=" Bảo dưỡng định kỳ"
                size={Platform.OS === "ios" ? 18 : 14}
                styles={{ marginLeft: 8 }}
              />
            </RowComponent>
          </View>
        </RowComponent>
      </SectionComponent>

      <SpaceComponent height={12} />

      {/* Nhân viên card */}
      <SectionComponent
        styles={[
          globalStyle.row,
          {
            backgroundColor: appColor.white,
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: appColor.gray,
            shadowColor: "#000",
            shadowOpacity: 0.03,
            shadowRadius: 6,
            elevation: 2,
          },
        ]}
      >
        <RowComponent
          justify="flex-start"
          styles={{ flex: 1, gap: 12, alignItems: "flex-start" }}
        >
          <AntDesign name="user-switch" size={26} color={appColor.primary} />
          <View style={{ flex: 1 }}>
            <TextComponent
              text="Nhân viên thực hiện"
              size={Platform.OS === "ios" ? 20 : 18}
              font={fontFamilies.roboto_medium}
            />
            <SpaceComponent height={8} />

            <RowComponent justify="flex-start">
              <TextComponent
                text="Họ & Tên:"
                size={Platform.OS === "ios" ? 18 : 14}
                font={fontFamilies.roboto_medium}
              />
              <TextComponent
                text=" Nguyễn Văn A"
                size={Platform.OS === "ios" ? 18 : 14}
                styles={{ marginLeft: 8 }}
              />
            </RowComponent>

            <SpaceComponent height={6} />

            <RowComponent justify="flex-start">
              <TextComponent
                text="Vai trò:"
                size={Platform.OS === "ios" ? 18 : 14}
                font={fontFamilies.roboto_medium}
              />
              <TextComponent
                text=" Kỹ thuật viên"
                size={Platform.OS === "ios" ? 18 : 14}
                styles={{ marginLeft: 8 }}
              />
            </RowComponent>

            <SpaceComponent height={6} />

            <RowComponent justify="flex-start">
              <TextComponent
                text="Kinh nghiệm:"
                size={Platform.OS === "ios" ? 18 : 14}
                font={fontFamilies.roboto_medium}
              />
              <TextComponent
                text=" 2 năm"
                size={Platform.OS === "ios" ? 18 : 14}
                styles={{ marginLeft: 8 }}
              />
            </RowComponent>
          </View>
        </RowComponent>
      </SectionComponent>

      <SpaceComponent height={16} />

      {/* Kết quả */}
      <SectionComponent
        styles={[{ paddingVertical: 12, paddingHorizontal: 16 }]}
      >
        <RowComponent justify="flex-start">
          <Octicons name="checklist" size={24} color={appColor.primary} />
          <TextComponent
            text="Kết quả"
            title
            color={appColor.primary}
            font={fontFamilies.roboto_medium}
            styles={{ marginLeft: 8 }}
          />
        </RowComponent>

        <SpaceComponent height={16} />

        <RowComponent justify="flex-start">
          <TextComponent
            text="Tình trạng ban đầu:"
            size={18}
            color={appColor.text}
            font={fontFamilies.roboto_regular}
          />
          <TextComponent
            text=" Đèn không sáng / phanh trước kêu"
            size={14}
            color={appColor.text}
            font={fontFamilies.roboto_regular}
            styles={{ marginLeft: 8 }}
          />
        </RowComponent>

        <SpaceComponent height={12} />

        <DividerWithLabelComponent text="trước kêu" />
        <SpaceComponent height={12} />

        <TextComponent
          text="Các bộ phận được kiểm tra"
          size={Platform.OS == "ios" ? 18 : 15}
          font={fontFamilies.roboto_medium}
          color={appColor.text}
        />
        <SpaceComponent height={12} />

        <SectionComponent
          styles={[
            globalStyle.row,
            {
              backgroundColor: appColor.white,
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: appColor.gray,
            },
          ]}
        >
          <RowComponent styles={{ alignItems: "flex-start" }}>
            <Image
              source={require("../../assets/images/parts/dong-ho.png")}
              style={{ width: 110, height: 110, resizeMode: "contain" }}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <TextComponent
                text="Đèn pha VINFAST KLARA"
                size={16}
                font={fontFamilies.roboto_medium}
              />
              <SpaceComponent height={8} />
              <RowComponent justify="flex-start">
                <TextComponent
                  text="Tình trạng:"
                  font={fontFamilies.roboto_medium}
                />
                <TextComponent text=" Bình thường" styles={{ marginLeft: 8 }} />
              </RowComponent>
            </View>
          </RowComponent>

          <SpaceComponent height={10} />

          <RowComponent>
            <View style={{ marginTop: 12 }}>
              <TextComponent
                text="Giải pháp"
                size={18}
                font={fontFamilies.roboto_medium}
                color={appColor.text}
              />
              <SpaceComponent height={8} />
              <RowComponent
                justify="space-between"
                styles={{ alignItems: "center" }}
              >
                <TextComponent
                  text="Thay mới đèn pha"
                  size={14}
                  styles={{ marginLeft: 8 }}
                />
                <TextComponent
                  text="500.000 VND"
                  size={14}
                  styles={{ marginLeft: 8 }}
                />
              </RowComponent>
            </View>
          </RowComponent>
        </SectionComponent>
      </SectionComponent>
    </BackgroundComponent>
  );
};

export default InspectionResult;
