import { View, Text, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import {
  ButtonComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../../components";
import { appColor } from "../../../constants/appColor";
import { fontFamilies } from "../../../constants/fontFamilies";
import { globalStyle } from "../../../styles/globalStyle";
import { getServiceCenter } from "../../../services/serviceCenter.service";
import { formatPhoneDisplay } from "../../../utils/phone.util";

type Props = {
  onSelectCenter: (center: any) => void;
  userLocation?: { latitude: number; longitude: number } | null;
  locationLoading?: boolean;
  locationError?: string | null;
  onRetryLocation?: () => void;
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const SelectCenterStep = ({
  onSelectCenter,
  userLocation,
  locationLoading,
  locationError,
  onRetryLocation,
}: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [closestCenterId, setClosestCenterId] = useState<number | null>(null);
  const [sortedData, setSortedData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length === 0) {
      setSortedData([]);
      setClosestCenterId(null);
      return;
    }

    if (userLocation) {
      const dataWithDistance = data.map((center) => {
        const hasCoords =
          typeof center.latitude === "number" &&
          typeof center.longitude === "number";
        return {
          ...center,
          distance: hasCoords
            ? calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                center.latitude,
                center.longitude
              )
            : Number.POSITIVE_INFINITY,
        };
      });

      const sorted = dataWithDistance.sort((a, b) => a.distance - b.distance);
      setSortedData(sorted);
      setClosestCenterId(sorted[0]?.id ?? null);
    } else {
      setSortedData(data);
      setClosestCenterId(null);
    }
  }, [userLocation, data]);

  const fetchData = async () => {
    const params = {
      page: 1,
      pageSize: 50,
    };
    const res = await getServiceCenter(params);
    if (res.success) {
      setData(res.data.rowDatas);
    } else {
      setData([]);
    }
  };

  return (
    <View>
      <SectionComponent styles={{ marginTop: 20, alignItems: "center" }}>
        <TextComponent
          text="Chọn trung tâm bảo dưỡng"
          size={20}
          color={appColor.text}
          font={fontFamilies.roboto_medium}
        />
        <SpaceComponent height={8} />
        <TextComponent
          text="Tìm trung tâm gần bạn nhất"
          size={16}
          color={appColor.gray2}
          font={fontFamilies.roboto_light}
        />
        {locationLoading && (
          <TextComponent
            text="Đang lấy vị trí hiện tại..."
            size={14}
            color={appColor.gray2}
            font={fontFamilies.roboto_regular}
            styles={{ marginTop: 8 }}
          />
        )}
        {locationError && (
          <View style={{ marginTop: 8, alignItems: "center" }}>
            <TextComponent
              text={locationError}
              size={14}
              color={appColor.danger}
              font={fontFamilies.roboto_regular}
            />
            {onRetryLocation && (
              <ButtonComponent
                text="Thử lại lấy vị trí"
                type="link"
                styles={{ marginTop: 4, paddingHorizontal: 0 }}
                onPress={onRetryLocation}
              />
            )}
          </View>
        )}
      </SectionComponent>

      {sortedData.length > 0 &&
        sortedData.map((center) => (
          <SectionComponent
            key={center.id}
            styles={[
              globalStyle.shadow,
              {
                backgroundColor: appColor.white,
                borderWidth: 0.5,
                borderColor: appColor.gray,
                borderRadius: 8,
                marginTop: 16,
                paddingBottom: 12,
                marginHorizontal: 8,
                paddingTop: 16,
              },
            ]}
          >
            <SectionComponent
              styles={{ marginBottom: -12, position: "relative" }}
            >
              <TextComponent
                text={center.name || "Không xác nhận được"}
                size={16}
                color={appColor.text}
                font={fontFamilies.roboto_medium}
              />

              <SpaceComponent height={6} />
              <RowComponent
                justify="flex-start"
                styles={{ alignItems: "flex-start" }}
              >
                <TextComponent
                  text="Địa chỉ: "
                  size={16}
                  color={appColor.gray2}
                  font={fontFamilies.roboto_regular}
                />
                <TextComponent
                  text={center.address || "Không xác nhận được"}
                  size={16}
                  color={appColor.gray2}
                  font={fontFamilies.roboto_regular}
                  styles={{ width: "80%" }}
                />
              </RowComponent>

              <SpaceComponent height={6} />
              <RowComponent justify="flex-start">
                <TextComponent
                  text="Số điện thoại: "
                  size={16}
                  color={appColor.gray2}
                  font={fontFamilies.roboto_regular}
                />
                <TextComponent
                  text={
                    formatPhoneDisplay(center.phone) || "Không xác nhận được"
                  }
                  size={16}
                  color={appColor.gray2}
                  font={fontFamilies.roboto_regular}
                />
              </RowComponent>
              <ButtonComponent
                text="Chọn trung tâm này"
                type="primary"
                styles={{ marginTop: 12 }}
                onPress={() => onSelectCenter && onSelectCenter(center)}
              />
            </SectionComponent>
            {closestCenterId === center.id && (
              <TextComponent
                text="Lựa chọn tốt nhất"
                size={12}
                color={appColor.white}
                font={fontFamilies.roboto_bold}
                styles={{
                  backgroundColor: appColor.danger,
                  width: "45%",
                  textAlign: "center",
                  borderRadius: 10,
                  paddingVertical: 4,
                  position: "absolute",
                  top: -12,
                  right: 12,
                }}
              />
            )}
          </SectionComponent>
        ))}
    </View>
  );
};

export default SelectCenterStep;
