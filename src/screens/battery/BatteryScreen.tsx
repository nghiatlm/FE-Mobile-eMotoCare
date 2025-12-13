import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  BackgroundComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { globalStyle } from "../../styles/globalStyle";
import { formatDate } from "../../utils/data.util";
import { getEvcheckDetail } from "../../services/evcheck.service";
import { getDetail } from "../../services/evcheckDetai.service";
import { getBatteries } from "../../services/battery.service";

const des =
  "Theo dõi các lần kiểm tra pin gần đây để nắm bắt tình trạng hoạt động.";

const sampleSohValues = [
  98, 98, 97, 97, 96, 96, 95, 95, 94, 94, 93, 93, 92, 92, 91, 91, 90, 90, 89,
  89,
];


const getSohColor = (value: number) => {
  if (value >= 80) return appColor.primary;
  if (value >= 70) return appColor.warning;
  return appColor.danger;
};
const calculateAverage = (values: number[]) => {
  if (!values || values.length === 0) return 0;
  const total = values.reduce((acc, cur) => acc + cur, 0);
  return total / values.length;
};

const normalizeNumber = (val: any) => {
  if (Array.isArray(val)) {
    if (val.length === 0) return 0;
    const sum = val.reduce((total, v) => total + Number(v || 0), 0);
    return Number((sum / val.length).toFixed(1));
  }
  const num = Number(val);
  return Number.isFinite(num) ? num : 0;
};

// const data = [
//   {
//     id: "1",
//     evCheckDetailId: "714e860e-217b-4064-9128-6cee57882229",
//     conclusion: {
//       solution: "Bảo hành hoặc thay thế",
//     },
//   },
//   {
//     id: "2",
//     evCheckDetailId: "814e860e-217b-4064-9128-6cee57882230",
//     conclusion: {
//       solution: "Bình thường",
//     },
//   },
// ];

const BatteryScreen = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState<Record<string, any>>({});
  const [data, setData] = useState<any[]>([]);

  const sampleSohAverage = useMemo(() => calculateAverage(sampleSohValues), []);

  const resolveSoh = (item: any) => {
    const detail = details[item?.evCheckDetailId] || {};
    const candidate =
      item?.soh ?? detail?.soh ?? detail?.evCheck?.soh ?? detail?.battery?.soh;
    return normalizeNumber(candidate);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      fetchBatteries();
      setIsLoading(true);
      const acc: Record<string, any> = {};
      for (const item of data) {
        try {
          const res = await getDetail(item.evCheckDetailId);
          if (res.success) acc[item.evCheckDetailId] = res.data;
        } catch {}
      }
      setDetails(acc);
      setIsLoading(false);
    };
    fetchDetails();
  }, []);

  const fetchBatteries = async () => {
    const res = await getBatteries({
      page: 1,
      pageSize: 10,
      vehicleId: "709a7d8b-9505-4e3c-bdda-3c9651704bbe",
      sortDesc: true,
    });
    console.log("res", res);
    if (res.success) {
      setData(res.data.rowDatas);
    }
  };
  return (
    <BackgroundComponent isScroll back title="Lịch sử kiểm tra pin">
      <SpaceComponent height={24} />
      <TextComponent
        text={des}
        flex={0}
        size={14}
        color={appColor.gray2}
        font={fontFamilies.roboto_light}
        styles={{ width: "85%", alignSelf: "center", textAlign: "center" }}
      />

      <SpaceComponent height={12} />
      <SectionComponent
        styles={{
          backgroundColor: appColor.warning2,
          borderRadius: 8,
          padding: 16,
          borderWidth: 0.5,
          borderColor: appColor.warning,
        }}
      >
        <RowComponent justify="space-between">
          <TextComponent
            text="SOH trung bình (mẫu)"
            size={15}
            font={fontFamilies.roboto_regular}
            color={appColor.text}
          />
          <View
            style={{
              backgroundColor: getSohColor(sampleSohAverage),
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <TextComponent
              text={`${sampleSohAverage.toFixed(1)}%`}
              size={15}
              font={fontFamilies.roboto_medium}
              color={appColor.white}
            />
          </View>
        </RowComponent>
      </SectionComponent>

      {data.length > 0 &&
        data.map((item, index) => {
          const sohValue = resolveSoh(item);
          const sohColor = getSohColor(sohValue);

          return (
            <SectionComponent
              key={index}
              styles={[
                globalStyle.shadow,
                {
                  backgroundColor: appColor.white,
                  borderRadius: 8,
                  padding: 16,
                  marginTop: 24,
                  borderWidth: 0.5,
                  borderColor: appColor.gray,
                  borderLeftWidth: 6,
                  borderLeftColor: sohColor,
                  marginHorizontal: 0,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("BatteryCurrent", {
                    id: item.id,
                  });
                }}
              >
                <RowComponent justify="flex-start">
                  <TextComponent
                    text="Ngày kiểm tra: "
                    size={15}
                    font={fontFamilies.roboto_regular}
                    color={appColor.text}
                  />
                  <TextComponent
                    text={
                      (() => {
                        const raw =
                          details[item.evCheckDetailId]?.evCheck?.checkDate;
                        if (!raw || typeof raw !== "string") return "--/--/----";
                        try {
                          return formatDate(raw);
                        } catch {
                          return "--/--/----";
                        }
                      })() as string
                    }
                    size={15}
                    font={fontFamilies.roboto_medium}
                    color={appColor.text}
                  />
                </RowComponent>
                <SpaceComponent height={8} />
                <RowComponent justify="flex-start">
                  <TextComponent
                    text="Mức pin hiện tại: "
                    size={15}
                    font={fontFamilies.roboto_regular}
                    color={appColor.text}
                  />
                  <TextComponent
                    text={`${sohValue.toFixed(1)}%`}
                    size={15}
                    font={fontFamilies.roboto_medium}
                    color={sohColor}
                  />
                </RowComponent>
                <SpaceComponent height={8} />
                <RowComponent justify="flex-start">
                  <TextComponent
                    text="Tình trạng: "
                    size={15}
                    font={fontFamilies.roboto_regular}
                    color={appColor.text}
                  />
                  <TextComponent
                    text={item.conclusion.solution || "Không xác định"}
                    size={15}
                    font={fontFamilies.roboto_medium}
                    color={appColor.text}
                  />
                </RowComponent>
              </TouchableOpacity>
            </SectionComponent>
          );
        })}
    </BackgroundComponent>
  );
};

export default BatteryScreen;
