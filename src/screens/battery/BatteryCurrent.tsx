import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
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
import { getBatteryDetail } from "../../services/battery.service";
import { globalStyle } from "../../styles/globalStyle";
import CircleComponent from "./components/CircleComponent";

interface BatteryData {
  soc: number;
  soh: number;
  temperature: number;
  capacity: number;
  power: number;
  range: number;
}

const BatteryCurrent = ({ navigation, route }: any) => {
  const id = route?.params?.id;
  const [batteryData, setBatteryData] = useState<BatteryData>({
    soc: 0,
    soh: 0,
    temperature: 0,
    capacity: 0,
    power: 0,
    range: 0,
  });

  const toNumber = (val: any) => {
    if (typeof val === "string") {
      const cleaned = val.replace(/,/g, ".").replace(/[^0-9.+-]/g, "");
      const num = Number(cleaned);
      return Number.isFinite(num) ? num : 0;
    }
    const num = Number(val);
    return Number.isFinite(num) ? num : 0;
  };

  const getAverage = (arr: any[]) => {
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    const sum = arr.reduce((total, val) => total + toNumber(val || 0), 0);
    return Number((sum / arr.length).toFixed(2));
  };

  const normalize = (val: any) => {
    if (Array.isArray(val)) return getAverage(val);
    return toNumber(val);
  };

  const resolveTemperature = (payload: any) => {
    const candidate =
      payload?.temperature ?? payload?.temp ?? payload?.battery?.temperature;
    return normalize(candidate);
  };

  const [loading, setLoading] = useState(false);

  // Fetch battery data
  useEffect(() => {
    if (id) fetchBatteryData();
  }, [id]);

  const fetchBatteryData = async () => {
    setLoading(true);
    try {
      if (!id) return;
      const res = await getBatteryDetail(id);
      console.log("Battery detail response:", res);
      if (res.success) {
        const data = res.data;
        setBatteryData({
          soc: normalize(data?.soc),
          soh: normalize(data?.soh),
          temperature: resolveTemperature(data),
          capacity: normalize(data?.capacity),
          power: normalize(data?.power),
          range: normalize(data?.range),
        });
      }
      console.log("Battery data fetched:", res.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching battery data:", error);
      setLoading(false);
    }
  };

  const getSocStatus = (value: number) => {
    if (value >= 80) return { label: "Pin tốt", color: appColor.primary };
    if (value >= 70)
      return { label: "Pin trung bình", color: appColor.warning };
    return { label: "Pin yếu", color: appColor.danger };
  };

  const getSohStatus = (value: number) => {
    if (value >= 80)
      return { label: "Pin tốt, còn sử dụng được", color: appColor.primary };
    if (value >= 70)
      return { label: "Pin trung bình", color: appColor.warning };
    return { label: "Pin đang không ổn định", color: appColor.danger };
  };

  const getTempStatus = (value: number) => {
    if (value >= 50) return { label: "Nhiệt độ cao", color: appColor.danger };
    if (value >= 40) return { label: "Nhiệt độ cao", color: appColor.warning };
    if (value === 0) return { label: "Chưa có dữ liệu", color: appColor.gray };
    return { label: "Nhiệt độ bình thường", color: appColor.primary };
  };

  const socStatus = getSocStatus(batteryData.soc);
  const sohStatus = getSohStatus(batteryData.soh);
  const tempStatus = getTempStatus(batteryData.temperature);

  return (
    <BackgroundComponent back isScroll title="Tình trạng pin hiện tại">
      {/* SOC Card */}
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            marginTop: 16,
            backgroundColor: appColor.white,
            borderWidth: 1,
            borderColor: appColor.gray,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 18,
          },
        ]}
      >
        <RowComponent justify="flex-start" styles={{ marginBottom: 4 }}>
          <FontAwesome
            name="battery-three-quarters"
            size={20}
            color={appColor.primary}
          />
          <TextComponent
            text="Mức pin hiện tại"
            size={15}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
            styles={{ marginLeft: 8 }}
          />
        </RowComponent>
        <SpaceComponent height={16} />
        <View style={{ alignItems: "center" }}>
          <CircleComponent
            percent={batteryData.soc}
            color={socStatus.color}
            label={socStatus.label}
          />
        </View>
        <SpaceComponent height={12} />
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              backgroundColor: socStatus.color,
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <TextComponent
              text={socStatus.label}
              size={12}
              color="#FFFFFF"
              font={fontFamilies.roboto_medium}
            />
          </View>
        </View>
      </SectionComponent>

      {/* SOH Card */}
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            marginTop: 16,
            backgroundColor: appColor.white,
            borderWidth: 1,
            borderColor: appColor.gray,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 18,
          },
        ]}
      >
        <RowComponent justify="space-between" styles={{ marginBottom: 4 }}>
          <RowComponent justify="flex-start">
            <MaterialCommunityIcons
              name="battery-heart-variant"
              size={20}
              color={appColor.primary}
            />
            <TextComponent
              text="Tình trạng pin (SOH)"
              size={15}
              color={appColor.text}
              font={fontFamilies.roboto_medium}
              styles={{ marginLeft: 8 }}
            />
          </RowComponent>
          <TextComponent
            text={`${batteryData.soh}%`}
            color={sohStatus.color}
            font={fontFamilies.roboto_bold}
            size={20}
          />
        </RowComponent>

        <SpaceComponent height={16} />

        <View style={{ width: "100%" }}>
          <View
            style={{
              height: 14,
              backgroundColor: "#EEF2F6",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${batteryData.soh}%`,
                backgroundColor: sohStatus.color,
                borderRadius: 10,
              }}
            />
          </View>

          <SpaceComponent height={14} />

          <View style={{ alignItems: "center" }}>
            <View
              style={{
                backgroundColor: sohStatus.color,
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 20,
              }}
            >
              <TextComponent
                text={sohStatus.label}
                size={12}
                color="#FFFFFF"
                font={fontFamilies.roboto_medium}
              />
            </View>
          </View>
        </View>
      </SectionComponent>

      {/* Temperature Card */}
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            marginTop: 16,
            backgroundColor: appColor.white,
            borderWidth: 1,
            borderColor: appColor.gray,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 18,
          },
        ]}
      >
        <RowComponent justify="space-between" styles={{ marginBottom: 14 }}>
          <RowComponent justify="flex-start">
            <MaterialCommunityIcons
              name="thermometer"
              size={20}
              color={appColor.primary}
            />
            <TextComponent
              text="Nhiệt độ pin"
              size={15}
              color={appColor.text}
              font={fontFamilies.roboto_medium}
              styles={{ marginLeft: 8 }}
            />
          </RowComponent>
          <TextComponent
            text={`${batteryData.temperature}°C`}
            color={tempStatus.color}
            font={fontFamilies.roboto_bold}
            size={20}
          />
        </RowComponent>

        <View style={{ alignItems: "center" }}>
          <View
            style={{
              backgroundColor: tempStatus.color,
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <TextComponent
              text={tempStatus.label}
              size={12}
              color="#FFFFFF"
              font={fontFamilies.roboto_medium}
            />
          </View>
        </View>
      </SectionComponent>

      {/* Capacity & Power Card */}
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            marginTop: 16,
            backgroundColor: appColor.white,
            borderWidth: 1,
            borderColor: appColor.gray,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 18,
          },
        ]}
      >
        <RowComponent justify="space-between">
          <View style={{ flex: 1, alignItems: "center" }}>
            <MaterialCommunityIcons
              name="battery-charging-100"
              size={24}
              color={appColor.primary}
            />
            <SpaceComponent height={8} />
            <TextComponent
              text="Dung lượng"
              size={13}
              color={appColor.gray2}
              font={fontFamilies.roboto_regular}
            />
            <SpaceComponent height={4} />
            <TextComponent
              text={`${batteryData.capacity} Ah`}
              size={18}
              color={appColor.text}
              font={fontFamilies.roboto_bold}
            />
            <TextComponent
              text="85% dành đinh"
              size={11}
              color={appColor.gray2}
              font={fontFamilies.roboto_regular}
            />
          </View>

          <View
            style={{ width: 1, height: "100%", backgroundColor: appColor.gray }}
          />

          <View style={{ flex: 1, alignItems: "center" }}>
            <MaterialCommunityIcons
              name="flash"
              size={24}
              color={appColor.primary}
            />
            <SpaceComponent height={8} />
            <TextComponent
              text="Năng lượng"
              size={13}
              color={appColor.gray2}
              font={fontFamilies.roboto_regular}
            />
            <SpaceComponent height={4} />
            <TextComponent
              text={`${batteryData.power} Wh`}
              size={18}
              color={appColor.text}
              font={fontFamilies.roboto_bold}
            />
            <TextComponent
              text="Còn lại"
              size={11}
              color={appColor.gray2}
              font={fontFamilies.roboto_regular}
            />
          </View>
        </RowComponent>
      </SectionComponent>

      {/* Range Card */}
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            marginTop: 16,
            backgroundColor: appColor.white,
            borderWidth: 1,
            borderColor: appColor.gray,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 18,
            alignItems: "center",
          },
        ]}
      >
        <MaterialCommunityIcons
          name="map-marker-distance"
          size={24}
          color={appColor.primary}
        />
        <SpaceComponent height={8} />
        <TextComponent
          text="Dự đoán quãng đường"
          size={13}
          color={appColor.gray2}
          font={fontFamilies.roboto_regular}
        />
        <SpaceComponent height={4} />
        <TextComponent
          text={`${batteryData.range} km`}
          size={28}
          color={appColor.text}
          font={fontFamilies.roboto_bold}
        />
        <TextComponent
          text="Với chế độ lái hiện tại"
          size={11}
          color={appColor.gray2}
          font={fontFamilies.roboto_regular}
        />
      </SectionComponent>

      {/* Action Button */}
      <SectionComponent styles={{ marginTop: 20, marginBottom: 20 }}>
        {/* <ButtonComponent
          text="Chi tiết phân tích PIN"
          type="primary"
          onPress={() => navigation.navigate("BatteryAnalysis")}
        />
        <SpaceComponent height={12} /> */}
        <ButtonComponent
          text="Về trang chủ"
          type="secondary"
          onPress={() => navigation.navigate("HomeScreen")}
        />
      </SectionComponent>
    </BackgroundComponent>
  );
};

export default BatteryCurrent;
