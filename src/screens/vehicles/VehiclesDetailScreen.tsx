import React, { useEffect, useState } from "react";
import { Image, View, TouchableOpacity } from "react-native";
import {
  BackgroundComponent,
  ButtonComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import StepProgress from "../../components/StepProgress";
import RegularMaintenance from "../home/components/RegularMaintenance";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { getVehicleById } from "../../services/vehicle.service";
import { globalStyle } from "../../styles/globalStyle";
import { statusActivities } from "../../utils/generateStatus";
import {
  AntDesign,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { checkWarranty, formatDateDDMMYYYY } from "../../utils/formatDate";

const VehiclesDetailScreen = ({ navigation, route }: any) => {
  console.log("VehiclesDetailScreen route.params:", route.params);
  const vehicleId = route.params?.id;
  console.log("VehiclesDetailScreen vehicleId:", vehicleId);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicle, setVehicle] = useState<any>(null);
  const [warrantyExpanded, setWarrantyExpanded] = useState<boolean>(false);

  useEffect(() => {
    if (vehicleId) {
      fetchVehicleDetail();
    }
  }, [vehicleId]);

  const fetchVehicleDetail = async () => {
    console.log("Fetching vehicle with ID:", vehicleId);
    const res = await getVehicleById(vehicleId);
    if (res.success) {
      setVehicle(res.data);
    } else {
      console.log("Error fetching vehicle details", res.message);
    }
  };
  const warrantyInfo = checkWarranty(vehicle?.warrantyExpiry);
  return (
    <BackgroundComponent title="Xe của tôi" back isScroll>
      <Image
        source={require("../../assets/images/vehicles/vehicle-placeholder-e.jpg")}
        style={{ width: "100%", height: 200 }}
        resizeMode="contain"
      />
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            padding: 16,
            borderRadius: 8,
            backgroundColor: appColor.white,
            borderWidth: 1,
            borderColor: appColor.gray,
          },
        ]}
      >
        <TextComponent
          text={vehicle?.modelName + " - " + vehicle?.vinNumber}
          size={18}
          font={fontFamilies.roboto_medium}
          color={appColor.text}
        />
        <SpaceComponent height={8} />
        <RowComponent justify="flex-start">
          <TextComponent
            text="Mẫu xe: "
            size={16}
            font={fontFamilies.roboto_light}
            color={appColor.text}
          />
          <TextComponent
            text={vehicle?.modelName}
            size={16}
            font={fontFamilies.roboto_light}
            color={appColor.text}
            styles={{ marginLeft: 4 }}
          />
        </RowComponent>
        <RowComponent justify="flex-start">
          <TextComponent
            text="Màu sắc: "
            size={16}
            font={fontFamilies.roboto_light}
            color={appColor.text}
          />
          <TextComponent
            text={vehicle?.color}
            size={16}
            font={fontFamilies.roboto_light}
            color={appColor.text}
            styles={{ marginLeft: 4 }}
          />
        </RowComponent>
        <RowComponent justify="flex-start">
          <TextComponent
            text="Số khung: "
            size={16}
            font={fontFamilies.roboto_light}
            color={appColor.text}
          />
          <TextComponent
            text={vehicle?.chassisNumber}
            size={16}
            font={fontFamilies.roboto_light}
            color={appColor.text}
            styles={{ marginLeft: 4 }}
          />
        </RowComponent>
        <SpaceComponent height={4} />
        <RowComponent justify="flex-start">
          <TextComponent
            text="Tình trạng: "
            size={16}
            font={fontFamilies.roboto_light}
            color={appColor.text}
          />
          {(() => {
            const st = statusActivities(vehicle?.status ?? "");
            return (
              <View style={{ marginLeft: 8 }}>
                <View
                  style={{
                    backgroundColor: st.color,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                    minWidth: 90,
                    alignItems: "center",
                  }}
                >
                  <TextComponent
                    text={st.label}
                    size={12}
                    font={fontFamilies.roboto_medium}
                    color={"#ffffff"}
                  />
                </View>
              </View>
            );
          })()}
        </RowComponent>
      </SectionComponent>
      <SpaceComponent height={16} />
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            padding: 16,
            borderRadius: 8,
            backgroundColor: appColor.white,
            borderWidth: 1,
            borderColor: appColor.gray,
          },
        ]}
      >
        <TextComponent
          text="Bảo dưỡng định kỳ"
          size={18}
          font={fontFamilies.roboto_medium}
          color={appColor.text}
        />
        <SpaceComponent height={12} />
        <RegularMaintenance vehicleId={vehicleId} navigation={navigation} />
      </SectionComponent>

      <SpaceComponent height={16} />
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            padding: 16,
            borderRadius: 8,
            backgroundColor: appColor.white,
            borderWidth: 1,
            borderColor: appColor.gray,
          },
        ]}
      >
        <RowComponent justify="space-between" styles={{ alignItems: "center" }}>
          <TextComponent
            text="Thông tin bảo hành"
            size={18}
            font={fontFamilies.roboto_medium}
            color={appColor.text}
          />
          <TouchableOpacity
            onPress={() => setWarrantyExpanded((s) => !s)}
            style={{ padding: 8 }}
            accessibilityLabel={warrantyExpanded ? "Thu gọn" : "Mở rộng"}
          >
            {!warrantyExpanded ? (
              <AntDesign name="plus-circle" size={18} color={appColor.text} />
            ) : (
              <AntDesign name="minus-circle" size={18} color={appColor.text} />
            )}
          </TouchableOpacity>
        </RowComponent>

        {warrantyExpanded && (
          <>
            <View
              style={{
                height: 2,
                width: "100%",
                backgroundColor: appColor.gray,
                marginTop: 20,
              }}
            />
            <SpaceComponent height={8} />
            <RowComponent
              justify="space-between"
              styles={{ alignItems: "flex-start" }}
            >
              <TextComponent
                text="Ngày xuất xưởng: "
                size={14}
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                styles={{ maxWidth: "70%" }}
              />
              <TextComponent
                text={formatDateDDMMYYYY(vehicle?.manufactureDate)}
                size={14}
                font={fontFamilies.roboto_regular}
                color={appColor.text}
              />
            </RowComponent>
            <SpaceComponent height={8} />
            <RowComponent
              justify="space-between"
              styles={{ alignItems: "flex-start" }}
            >
              <TextComponent
                text="Ngày mua: "
                size={14}
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                styles={{ maxWidth: "70%" }}
              />
              <TextComponent
                text={formatDateDDMMYYYY(vehicle?.purchaseDate)}
                size={14}
                font={fontFamilies.roboto_regular}
                color={appColor.text}
              />
            </RowComponent>
            <SpaceComponent height={8} />
            <RowComponent
              justify="space-between"
              styles={{ alignItems: "flex-start" }}
            >
              <TextComponent
                text="Thời hạn bảo hành: "
                size={14}
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                styles={{ maxWidth: "70%" }}
              />
              <TextComponent
                text="24 tháng"
                size={14}
                font={fontFamilies.roboto_regular}
                color={appColor.text}
              />
            </RowComponent>

            <SpaceComponent height={8} />
            <RowComponent
              justify="space-between"
              styles={{ alignItems: "flex-start" }}
            >
              <TextComponent
                text="Tình trạng hiện tại: "
                size={14}
                font={fontFamilies.roboto_regular}
                color={appColor.text}
                styles={{ maxWidth: "70%" }}
              />
              <TextComponent
                text={warrantyInfo?.remaining ?? ""}
                size={14}
                font={fontFamilies.roboto_medium}
                color={warrantyInfo?.valid ? appColor.primary : appColor.danger}
              />
            </RowComponent>
          </>
        )}
      </SectionComponent>
      <SpaceComponent height={16} />
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            padding: 16,
            borderRadius: 8,
            backgroundColor: appColor.white,
            borderWidth: 1,
            borderColor: appColor.gray,
          },
        ]}
      >
        <TextComponent
          text="Nhắc nhở thay đổi phụ tùng"
          size={18}
          font={fontFamilies.roboto_medium}
          color={appColor.text}
        />
        <View
          style={{
            height: 2,
            width: "100%",
            backgroundColor: appColor.gray,
            marginTop: 20,
          }}
        />
        <SpaceComponent height={12} />
        <RowComponent styles={{ alignItems: "center" }}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={appColor.text}
            style={{ marginRight: 8 }}
          />
          <TextComponent
            text="Bugi"
            size={18}
            font={fontFamilies.roboto_medium}
            color={appColor.text}
            flex={1}
          />
          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color={appColor.text}
          />
        </RowComponent>

        <View
          style={{
            height: 2,
            width: "100%",
            backgroundColor: appColor.gray,
            marginTop: 20,
          }}
        />

        <SpaceComponent height={12} />
        <RowComponent styles={{ alignItems: "center" }}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={appColor.text}
            style={{ marginRight: 8 }}
          />
          <TextComponent
            text="Dầu động cơ"
            size={18}
            font={fontFamilies.roboto_medium}
            color={appColor.text}
            flex={1}
          />
          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color={appColor.text}
          />
        </RowComponent>
      </SectionComponent>
      <SpaceComponent height={16} />
      <ButtonComponent
        text="Lịch sử sửa chữa"
        rightIcon={
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome6
              name="chevron-right"
              size={16}
              color={appColor.gray2}
            />
          </View>
        }
        onPress={() => navigation.navigate("VehicleHistory", { id: vehicleId })}
        styles={[globalStyle.shadow]}
      />

      <ButtonComponent
        text="Thông tin về pin xe"
        rightIcon={
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome6
              name="chevron-right"
              size={16}
              color={appColor.gray2}
            />
          </View>
        }
        onPress={() => navigation.navigate("Batteries", { 
          screen: "BatteryScreen",
          params: { vehicleId: vehicleId }
        })}
        styles={[globalStyle.shadow]}
      />
    </BackgroundComponent>
  );
};

export default VehiclesDetailScreen;
