import React from "react";
import {
  BackgroundComponent,
  ButtonComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { globalStyle } from "../../styles/globalStyle";
import { Image, View } from "react-native";

const MaintenanceDetailScreen = ({ navigation, route }: any) => {
  const { maintenanceId } = route.params;

  const footer = (
    <ButtonComponent
      text="Đặt lịch bảo dưỡng"
      type="primary"
      onPress={() => navigation.navigate("CreateMaintenance")}
    />
  );

  return (
    <BackgroundComponent
      title="Đặt lịch bảo dưỡng"
      back
      isScroll
      footer={footer}
    >
      <SectionComponent styles={{ alignItems: "center" }}>
        <TextComponent
          text="Chi tiết gói bảo dưỡng"
          title
          color={appColor.primary}
        />
        <TextComponent
          text="Thông tin chi tiết đợt bảo dưỡng tháng 12"
          size={18}
          font={fontFamilies.roboto_light}
          styles={{ marginTop: 12 }}
          color={appColor.gray2}
        />
      </SectionComponent>
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            backgroundColor: appColor.white,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: appColor.gray,
            padding: 16,
          },
        ]}
      >
        <TextComponent
          text="Bảo dưỡng tháng 12"
          title
          size={20}
          color={appColor.primary}
        />
        <SpaceComponent height={10} />
        <RowComponent justify="flex-start">
          <TextComponent
            text="Áp dụng: "
            color={appColor.gray3}
            size={18}
            font={fontFamilies.roboto_regular}
          />
          <TextComponent
            text="2500 - 6000km"
            color={appColor.text}
            size={18}
            font={fontFamilies.roboto_medium}
          />
        </RowComponent>

        <SpaceComponent height={10} />
        <RowComponent justify="flex-start">
          <TextComponent
            text="Thời gian: "
            color={appColor.gray3}
            size={18}
            font={fontFamilies.roboto_regular}
          />
          <TextComponent
            text="tháng 12"
            color={appColor.text}
            size={18}
            font={fontFamilies.roboto_medium}
          />
        </RowComponent>
      </SectionComponent>

      <SpaceComponent height={20} />
      <SectionComponent styles={{ paddingHorizontal: 0 }}>
        <TextComponent
          text="Nội dung cần thực hiện"
          font={fontFamilies.roboto_medium}
          size={20}
          color={appColor.primary}
        />
        <SpaceComponent height={12} />
        <RowComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              borderWidth: 1,
              borderColor: appColor.gray,
              borderRadius: 8,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/parts/dong-ho.png")}
            style={{ height: 120, width: 150, resizeMode: "contain" }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TextComponent
              text="Hệ thống phanh tay"
              size={20}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <SpaceComponent height={10} />
            <RowComponent justify="flex-start">
              <TextComponent
                text="Nội dung: "
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                size={18}
              />
              <TextComponent
                text="Kiểm tra"
                font={fontFamilies.roboto_regular}
                color={appColor.warning}
                size={18}
                styles={{ marginLeft: 4 }}
              />
            </RowComponent>
          </View>
        </RowComponent>

        <SpaceComponent height={12} />
        <RowComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              borderWidth: 1,
              borderColor: appColor.gray,
              borderRadius: 8,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/parts/dong-ho.png")}
            style={{ height: 120, width: 150, resizeMode: "contain" }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TextComponent
              text="Hệ thống phanh tay"
              size={20}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <SpaceComponent height={10} />
            <RowComponent justify="flex-start">
              <TextComponent
                text="Nội dung: "
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                size={18}
              />
              <TextComponent
                text="Kiểm tra"
                font={fontFamilies.roboto_regular}
                color={appColor.warning}
                size={18}
                styles={{ marginLeft: 4 }}
              />
            </RowComponent>
          </View>
        </RowComponent>

        <SpaceComponent height={12} />
        <RowComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              borderWidth: 1,
              borderColor: appColor.gray,
              borderRadius: 8,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/parts/dong-ho.png")}
            style={{ height: 120, width: 150, resizeMode: "contain" }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TextComponent
              text="Hệ thống phanh tay"
              size={20}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <SpaceComponent height={10} />
            <RowComponent justify="flex-start">
              <TextComponent
                text="Nội dung: "
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                size={18}
              />
              <TextComponent
                text="Kiểm tra"
                font={fontFamilies.roboto_regular}
                color={appColor.warning}
                size={18}
                styles={{ marginLeft: 4 }}
              />
            </RowComponent>
          </View>
        </RowComponent>

        <SpaceComponent height={12} />
        <RowComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              borderWidth: 1,
              borderColor: appColor.gray,
              borderRadius: 8,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/parts/dong-ho.png")}
            style={{ height: 120, width: 150, resizeMode: "contain" }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TextComponent
              text="Hệ thống phanh tay"
              size={20}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <SpaceComponent height={10} />
            <RowComponent justify="flex-start">
              <TextComponent
                text="Nội dung: "
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                size={18}
              />
              <TextComponent
                text="Kiểm tra"
                font={fontFamilies.roboto_regular}
                color={appColor.warning}
                size={18}
                styles={{ marginLeft: 4 }}
              />
            </RowComponent>
          </View>
        </RowComponent>

        <SpaceComponent height={12} />
        <RowComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              borderWidth: 1,
              borderColor: appColor.gray,
              borderRadius: 8,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/parts/dong-ho.png")}
            style={{ height: 120, width: 150, resizeMode: "contain" }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TextComponent
              text="Hệ thống phanh tay"
              size={20}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <SpaceComponent height={10} />
            <RowComponent justify="flex-start">
              <TextComponent
                text="Nội dung: "
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                size={18}
              />
              <TextComponent
                text="Kiểm tra"
                font={fontFamilies.roboto_regular}
                color={appColor.warning}
                size={18}
                styles={{ marginLeft: 4 }}
              />
            </RowComponent>
          </View>
        </RowComponent>

        <SpaceComponent height={12} />
        <RowComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              borderWidth: 1,
              borderColor: appColor.gray,
              borderRadius: 8,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/parts/dong-ho.png")}
            style={{ height: 120, width: 150, resizeMode: "contain" }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TextComponent
              text="Hệ thống phanh tay"
              size={20}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <SpaceComponent height={10} />
            <RowComponent justify="flex-start">
              <TextComponent
                text="Nội dung: "
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                size={18}
              />
              <TextComponent
                text="Kiểm tra"
                font={fontFamilies.roboto_regular}
                color={appColor.warning}
                size={18}
                styles={{ marginLeft: 4 }}
              />
            </RowComponent>
          </View>
        </RowComponent>

        <SpaceComponent height={12} />
        <RowComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              borderWidth: 1,
              borderColor: appColor.gray,
              borderRadius: 8,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/parts/dong-ho.png")}
            style={{ height: 120, width: 150, resizeMode: "contain" }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TextComponent
              text="Hệ thống phanh tay"
              size={20}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <SpaceComponent height={10} />
            <RowComponent justify="flex-start">
              <TextComponent
                text="Nội dung: "
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                size={18}
              />
              <TextComponent
                text="Kiểm tra"
                font={fontFamilies.roboto_regular}
                color={appColor.warning}
                size={18}
                styles={{ marginLeft: 4 }}
              />
            </RowComponent>
          </View>
        </RowComponent>

        <SpaceComponent height={12} />
        <RowComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              borderWidth: 1,
              borderColor: appColor.gray,
              borderRadius: 8,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/parts/dong-ho.png")}
            style={{ height: 120, width: 150, resizeMode: "contain" }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TextComponent
              text="Hệ thống phanh tay"
              size={20}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <SpaceComponent height={10} />
            <RowComponent justify="flex-start">
              <TextComponent
                text="Nội dung: "
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                size={18}
              />
              <TextComponent
                text="Kiểm tra"
                font={fontFamilies.roboto_regular}
                color={appColor.warning}
                size={18}
                styles={{ marginLeft: 4 }}
              />
            </RowComponent>
          </View>
        </RowComponent>

        <SpaceComponent height={12} />
        <RowComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              borderWidth: 1,
              borderColor: appColor.gray,
              borderRadius: 8,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/parts/dong-ho.png")}
            style={{ height: 120, width: 150, resizeMode: "contain" }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TextComponent
              text="Hệ thống phanh tay"
              size={20}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <SpaceComponent height={10} />
            <RowComponent justify="flex-start">
              <TextComponent
                text="Nội dung: "
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                size={18}
              />
              <TextComponent
                text="Kiểm tra"
                font={fontFamilies.roboto_regular}
                color={appColor.warning}
                size={18}
                styles={{ marginLeft: 4 }}
              />
            </RowComponent>
          </View>
        </RowComponent>

        <SpaceComponent height={12} />
        <RowComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              borderWidth: 1,
              borderColor: appColor.gray,
              borderRadius: 8,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/parts/dong-ho.png")}
            style={{ height: 120, width: 150, resizeMode: "contain" }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TextComponent
              text="Hệ thống phanh tay"
              size={20}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <SpaceComponent height={10} />
            <RowComponent justify="flex-start">
              <TextComponent
                text="Nội dung: "
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                size={18}
              />
              <TextComponent
                text="Kiểm tra"
                font={fontFamilies.roboto_regular}
                color={appColor.warning}
                size={18}
                styles={{ marginLeft: 4 }}
              />
            </RowComponent>
          </View>
        </RowComponent>

        <SpaceComponent height={12} />
        <RowComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              borderWidth: 1,
              borderColor: appColor.gray,
              borderRadius: 8,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/parts/dong-ho.png")}
            style={{ height: 120, width: 150, resizeMode: "contain" }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TextComponent
              text="Hệ thống phanh tay"
              size={20}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <SpaceComponent height={10} />
            <RowComponent justify="flex-start">
              <TextComponent
                text="Nội dung: "
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                size={18}
              />
              <TextComponent
                text="Kiểm tra"
                font={fontFamilies.roboto_regular}
                color={appColor.warning}
                size={18}
                styles={{ marginLeft: 4 }}
              />
            </RowComponent>
          </View>
        </RowComponent>

        <SpaceComponent height={12} />
        <RowComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              borderWidth: 1,
              borderColor: appColor.gray,
              borderRadius: 8,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/parts/dong-ho.png")}
            style={{ height: 120, width: 150, resizeMode: "contain" }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TextComponent
              text="Hệ thống phanh tay"
              size={20}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <SpaceComponent height={10} />
            <RowComponent justify="flex-start">
              <TextComponent
                text="Nội dung: "
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                size={18}
              />
              <TextComponent
                text="Kiểm tra"
                font={fontFamilies.roboto_regular}
                color={appColor.warning}
                size={18}
                styles={{ marginLeft: 4 }}
              />
            </RowComponent>
          </View>
        </RowComponent>

        <SpaceComponent height={12} />
        <RowComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              borderWidth: 1,
              borderColor: appColor.gray,
              borderRadius: 8,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/parts/dong-ho.png")}
            style={{ height: 120, width: 150, resizeMode: "contain" }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TextComponent
              text="Hệ thống phanh tay"
              size={20}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <SpaceComponent height={10} />
            <RowComponent justify="flex-start">
              <TextComponent
                text="Nội dung: "
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                size={18}
              />
              <TextComponent
                text="Kiểm tra"
                font={fontFamilies.roboto_regular}
                color={appColor.warning}
                size={18}
                styles={{ marginLeft: 4 }}
              />
            </RowComponent>
          </View>
        </RowComponent>

        <SpaceComponent height={12} />
        <RowComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              borderWidth: 1,
              borderColor: appColor.gray,
              borderRadius: 8,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/parts/dong-ho.png")}
            style={{ height: 120, width: 150, resizeMode: "contain" }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TextComponent
              text="Hệ thống phanh tay"
              size={20}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <SpaceComponent height={10} />
            <RowComponent justify="flex-start">
              <TextComponent
                text="Nội dung: "
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                size={18}
              />
              <TextComponent
                text="Kiểm tra"
                font={fontFamilies.roboto_regular}
                color={appColor.warning}
                size={18}
                styles={{ marginLeft: 4 }}
              />
            </RowComponent>
          </View>
        </RowComponent>

        <SpaceComponent height={12} />
        <RowComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              borderWidth: 1,
              borderColor: appColor.gray,
              borderRadius: 8,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/parts/dong-ho.png")}
            style={{ height: 120, width: 150, resizeMode: "contain" }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TextComponent
              text="Hệ thống phanh tay"
              size={20}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <SpaceComponent height={10} />
            <RowComponent justify="flex-start">
              <TextComponent
                text="Nội dung: "
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                size={18}
              />
              <TextComponent
                text="Kiểm tra"
                font={fontFamilies.roboto_regular}
                color={appColor.warning}
                size={18}
                styles={{ marginLeft: 4 }}
              />
            </RowComponent>
          </View>
        </RowComponent>

        <SpaceComponent height={12} />
        <RowComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              borderWidth: 1,
              borderColor: appColor.gray,
              borderRadius: 8,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/parts/dong-ho.png")}
            style={{ height: 120, width: 150, resizeMode: "contain" }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TextComponent
              text="Hệ thống phanh tay"
              size={20}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <SpaceComponent height={10} />
            <RowComponent justify="flex-start">
              <TextComponent
                text="Nội dung: "
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                size={18}
              />
              <TextComponent
                text="Kiểm tra"
                font={fontFamilies.roboto_regular}
                color={appColor.warning}
                size={18}
                styles={{ marginLeft: 4 }}
              />
            </RowComponent>
          </View>
        </RowComponent>

        <SpaceComponent height={12} />
        <RowComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              borderWidth: 1,
              borderColor: appColor.gray,
              borderRadius: 8,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/parts/dong-ho.png")}
            style={{ height: 120, width: 150, resizeMode: "contain" }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TextComponent
              text="Hệ thống phanh tay"
              size={20}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <SpaceComponent height={10} />
            <RowComponent justify="flex-start">
              <TextComponent
                text="Nội dung: "
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                size={18}
              />
              <TextComponent
                text="Kiểm tra"
                font={fontFamilies.roboto_regular}
                color={appColor.warning}
                size={18}
                styles={{ marginLeft: 4 }}
              />
            </RowComponent>
          </View>
        </RowComponent>

        <SpaceComponent height={12} />
        <RowComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              borderWidth: 1,
              borderColor: appColor.gray,
              borderRadius: 8,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/parts/dong-ho.png")}
            style={{ height: 120, width: 150, resizeMode: "contain" }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TextComponent
              text="Hệ thống phanh tay"
              size={20}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <SpaceComponent height={10} />
            <RowComponent justify="flex-start">
              <TextComponent
                text="Nội dung: "
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                size={18}
              />
              <TextComponent
                text="Kiểm tra"
                font={fontFamilies.roboto_regular}
                color={appColor.warning}
                size={18}
                styles={{ marginLeft: 4 }}
              />
            </RowComponent>
          </View>
        </RowComponent>

        <SpaceComponent height={12} />
        <RowComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              borderWidth: 1,
              borderColor: appColor.gray,
              borderRadius: 8,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/parts/dong-ho.png")}
            style={{ height: 120, width: 150, resizeMode: "contain" }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TextComponent
              text="Hệ thống phanh tay"
              size={20}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <SpaceComponent height={10} />
            <RowComponent justify="flex-start">
              <TextComponent
                text="Nội dung: "
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                size={18}
              />
              <TextComponent
                text="Kiểm tra"
                font={fontFamilies.roboto_regular}
                color={appColor.warning}
                size={18}
                styles={{ marginLeft: 4 }}
              />
            </RowComponent>
          </View>
        </RowComponent>

        <SpaceComponent height={12} />
        <RowComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              borderWidth: 1,
              borderColor: appColor.gray,
              borderRadius: 8,
            },
          ]}
        >
          <Image
            source={require("../../assets/images/parts/dong-ho.png")}
            style={{ height: 120, width: 150, resizeMode: "contain" }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <TextComponent
              text="Hệ thống phanh tay"
              size={20}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <SpaceComponent height={10} />
            <RowComponent justify="flex-start">
              <TextComponent
                text="Nội dung: "
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                size={18}
              />
              <TextComponent
                text="Kiểm tra"
                font={fontFamilies.roboto_regular}
                color={appColor.warning}
                size={18}
                styles={{ marginLeft: 4 }}
              />
            </RowComponent>
          </View>
        </RowComponent>
      </SectionComponent>
    </BackgroundComponent>
  );
};

export default MaintenanceDetailScreen;
