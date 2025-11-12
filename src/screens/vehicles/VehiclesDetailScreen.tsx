import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import {
  BackgroundComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getVehicleById } from "../../services/vehicle.service";
import { Image } from "react-native";
import { fontFamilies } from "../../constants/fontFamilies";
import { appColor } from "../../constants/appColor";
import { globalStyle } from "../../styles/globalStyle";
import { statusActivities } from "../../utils/generateStatus";

const VehiclesDetailScreen = ({ navigation, route }: any) => {
  const vehicleId = route.params?.id;
  const [isLoading, setIsLoading] = useState(false);
  const [vehicle, setVehicle] = useState<any>(null);

  useEffect(() => {
    fetchVehicleDetail();
  }, [vehicleId]);

  const fetchVehicleDetail = async () => {
    const res = await getVehicleById(vehicleId);
    if (res.success) {
      setVehicle(res.data);
      console.log("Vehicle details fetched", res.data);
    } else {
      console.log("Error fetching vehicle details", res.message);
    }
  };
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
    </BackgroundComponent>
  );
};

export default VehiclesDetailScreen;
