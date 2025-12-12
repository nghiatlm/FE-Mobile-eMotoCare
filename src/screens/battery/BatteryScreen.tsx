import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
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

const des =
  "Theo dõi các lần kiểm tra pin gần đây để nắm bắt tình trạng hoạt động.";

const data = [
  {
    id: "1",
    evCheckDetailId: "714e860e-217b-4064-9128-6cee57882229",
    conclusion: {
      solution: "Bảo hành hoặc thay thế",
    },
  },
  {
    id: "2",
    evCheckDetailId: "814e860e-217b-4064-9128-6cee57882230",
    conclusion: {
      solution: "Bình thường",
    },
  },
];

const BatteryScreen = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchDetails = async () => {
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

      {data.length > 0 &&
        data.map((item, index) => (
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
                  text="40%"
                  size={15}
                  font={fontFamilies.roboto_medium}
                  color={appColor.text}
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
        ))}
    </BackgroundComponent>
  );
};

export default BatteryScreen;
