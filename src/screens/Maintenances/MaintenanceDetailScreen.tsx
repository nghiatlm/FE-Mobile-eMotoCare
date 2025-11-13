import React, { useEffect, useState } from "react";
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
import { getKMLabel, getDurationLabel } from "../../utils/generateKM";
import { getMaintenanceStageById } from "../../services/maintenanceStage.service";

const MaintenanceDetailScreen = ({ navigation, route }: any) => {
  const { maintenanceStageId, stage } = route.params;
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!maintenanceStageId) return;
      const res = await getMaintenanceStageById(maintenanceStageId);
      if (res.success) {
        console.log("Maintenance stage data:", res.data);
        setData(res.data);
      }
    };
    fetchData();
  }, [maintenanceStageId]);

  const footer = (
    <ButtonComponent
      text="Đặt lịch bảo dưỡng"
      type="primary"
      onPress={() => navigation.navigate("CreateMaintenance", { stage })}
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
            borderRadius: 12,
            borderWidth: 1,
            borderColor: appColor.gray,
            padding: 14,
          },
        ]}
      >
        <TextComponent
          text={data?.name || "Bảo dưỡng định kỳ"}
          title
          size={18}
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
            text={getKMLabel(data?.mileage ?? null)}
            color={appColor.text}
            size={16}
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
            text={getDurationLabel(data?.durationMonth ?? null)}
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
          {Array.isArray(data?.maintenanceStageDetails) &&
          data.maintenanceStageDetails.length > 0 ? (
            data.maintenanceStageDetails.map((item: any, index: number) => {
              const title =
                item?.part?.name ?? item?.name ?? `Hạng mục ${index + 1}`;
              
              const image = item?.part?.image || null;
              console.log("Part image:", image);

              // normalize actionType to array of upper-case strings
              const rawActions = item?.actionType;
              const actionTypes: string[] = Array.isArray(rawActions)
                ? rawActions.map((t: any) => String(t).trim().toUpperCase())
                : rawActions
                ? String(rawActions)
                    .split(/[,\|;]/)
                    .map((t) => t.trim().toUpperCase())
                : [];

              const translateAction = (type: string) =>
                type === "INSPECTION"
                  ? "Kiểm tra"
                  : type === "LUBRICATION"
                  ? "Bôi trơn"
                  : type;

              const actionColor = (type: string) =>
                type === "INSPECTION"
                  ? appColor.primary
                  : type === "LUBRICATION"
                  ? appColor.warning
                  : appColor.gray;

              return (
                <React.Fragment key={item?.id ?? index}>
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
                    {
                      // remote image must be passed as { uri }
                    }
                    <Image
                      source={
                        image
                          ? { uri: String(image) }
                          : require("../../assets/images/parts/dong-ho.png")
                      }
                      style={{ height: 100, width: 100, resizeMode: "cover", borderRadius: 8, backgroundColor: appColor.gray3 }}
                    />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <TextComponent
                        text={title}
                        size={18}
                        font={fontFamilies.roboto_medium}
                        color={appColor.text}
                      />
                      <SpaceComponent height={10} />
                      {/* Render action types as compact pills */}
                      {actionTypes.length > 0 ? (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                          {actionTypes.map((t: string, i: number) => (
                            <View
                              key={`${item?.id ?? index}-action-${i}`}
                              style={{
                                borderWidth: 1,
                                borderColor: actionColor(t),
                                paddingVertical: 6,
                                paddingHorizontal: 10,
                                borderRadius: 16,
                                marginRight: 8,
                                marginTop: i === 0 ? 0 : 8,
                                backgroundColor: appColor.white,
                              }}
                            >
                              <TextComponent
                                text={translateAction(t)}
                                font={fontFamilies.roboto_regular}
                                color={actionColor(t)}
                                size={14}
                              />
                            </View>
                          ))}
                        </View>
                      ) : (
                        <RowComponent justify="flex-start">
                          <TextComponent
                            text="Nội dung: "
                            font={fontFamilies.roboto_regular}
                            color={appColor.text}
                            size={16}
                          />
                          <TextComponent
                            text="Không có mô tả"
                            font={fontFamilies.roboto_regular}
                            color={appColor.gray2}
                            size={16}
                            styles={{ marginLeft: 4 }}
                          />
                        </RowComponent>
                      )}
                      {item?.note ? (
                        <>
                          <SpaceComponent height={8} />
                          <TextComponent
                            text={item.note}
                            size={14}
                            color={appColor.gray2}
                          />
                        </>
                      ) : null}
                    </View>
                  </RowComponent>
                </React.Fragment>
              );
            })
          ) : (
            <>
              <SpaceComponent height={12} />
              <TextComponent text="Không có nội dung thực hiện" size={14} />
            </>
          )}
      </SectionComponent>
    </BackgroundComponent>
  );
};

export default MaintenanceDetailScreen;
