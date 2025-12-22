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
import { getVehicleStageDetail } from "../../services/vehicleStage.service";
import { vehicle } from "../../apis/vehicle.api";
import {
  formatActionType,
  formatKM,
  formatMonth,
  statusColor,
  statusLabel,
} from "../../utils/generateStatus";
import { formatDate } from "../../utils/data.util";
import { ActivityIndicator, Image, View } from "react-native";
import { getMaintenanceStageById } from "../../services/maintenance.service";

// const maintenanceStageDetails = [
//   {
//     id: "edff741d-db00-11f0-ba23-6e018fbd1948",
//     maintenanceStageId: "a6be0df7-7bc4-4402-aa5f-2bfc007c9f96",
//     part: {
//       id: "62df419c-d6a7-11f0-ba23-6e018fbd1948",
//       code: "BR-001",
//       name: "Tay phanh trước",
//       image:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgtK69RjrQnL72LfHby7l5uB9xH5QZEyEvqA&s",
//     },
//     actionType: ["INSPECTION"],
//     description: "Kiểm tra tay phanh trước",
//   },
//   {
//     id: "edff7cb4-db00-11f0-ba23-6e018fbd1948",
//     maintenanceStageId: "a6be0df7-7bc4-4402-aa5f-2bfc007c9f96",
//     part: {
//       id: "62df4852-d6a7-11f0-ba23-6e018fbd1948",
//       code: "BR-002",
//       name: "Tay phanh sau",
//       image:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgtK69RjrQnL72LfHby7l5uB9xH5QZEyEvqA&s",
//     },
//     actionType: ["INSPECTION"],
//     description: "Kiểm tra tay phanh sau",
//   },
// ];

const MaintenanceDetail = ({ route, navigation }: any) => {
  const { id } = route?.params || {};
  const [vehicleStageDetail, setVehicleStageDetail] = useState<any>(null);
  const [maintenanceStageDetails, setMaintenanceStageDetails] =
    useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    console.log("MaintenanceDetail id:", id);
    fetchVehicleStageDetail(id);
  }, [id]);

  const fetchVehicleStageDetail = async (id: string) => {
    console.log("Fetch vehicle stage detail for id:", id);
    setLoading(true);
    const res = await getVehicleStageDetail(id);
    if (res.success) {
      console.log("Vehicle stage detail fetched:", res.data);
      setVehicleStageDetail(res.data);
      fetchMaintenanceStage(res.data.maintenanceStageId);
    } else {
      console.log("Failed to fetch vehicle stage detail:", res.message);
      setLoading(false);
    }
  };

  const fetchMaintenanceStage = async (id: string) => {
    const res = await getMaintenanceStageById(id);
    if (res.success) {
      console.log("Maintenance stage detail fetched:", res.data);
      setMaintenanceStageDetails(res.data.maintenanceStageDetails);
    } else {
      console.log("Failed to fetch maintenance stage detail:", res.message);
    }
    setLoading(false);
  };

  const checkWarrantyStatus = (warrantyExpiryDate: string | null) => {
    if (!warrantyExpiryDate) {
      return { status: "Không rõ", color: appColor.gray2 };
    }

    try {
      const expiryDate = new Date(warrantyExpiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expiryDate.setHours(0, 0, 0, 0);

      if (expiryDate > today) {
        const daysRemaining = Math.ceil(
          (expiryDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
        );
        return {
          status: `Còn bảo hành`,
          color: appColor.primary,
        };
      } else {
        const daysExpired = Math.floor(
          (today.getTime() - expiryDate.getTime()) / (24 * 60 * 60 * 1000)
        );
        return {
          status: "Hết bảo hành",
          color: appColor.danger,
        };
      }
    } catch (error) {
      console.log("Error checking warranty status:", error);
      return { status: "Không rõ", color: appColor.gray2 };
    }
  };

  const warrantyStatus = checkWarrantyStatus(
    vehicleStageDetail?.vehicle?.warrantyExpiry || null
  );

  const handleSchedule = () => {
    console.log("Schedule maintenance:", id);

    navigation.navigate("Appointments", {
      screen: "CreateAppointment",
      params: {
        vehicleStageId: id,
        vehicleId: vehicleStageDetail?.vehicleId,
        type: "MAINTENANCE_TYPE",
      },
    });
  };

  const footerComponent = (
    <SectionComponent>
      <ButtonComponent
        text="Đặt lịch bảo dưỡng"
        type="primary"
        onPress={handleSchedule}
      />
    </SectionComponent>
  );

  if (loading) {
    return (
      <BackgroundComponent title="Chi tiết" back>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <ActivityIndicator size="large" color={appColor.primary} />
          <SpaceComponent height={12} />
          <TextComponent
            text="Đang tải..."
            size={14}
            color={appColor.gray2}
            font={fontFamilies.roboto_regular}
          />
        </View>
      </BackgroundComponent>
    );
  }

  return (
    <BackgroundComponent
      isScroll
      title="Chi tiết"
      back
      footer={footerComponent}
    >
      <SectionComponent>
        <TextComponent
          text="Chi tiết đợt bảo dưỡng"
          size={20}
          color={appColor.text}
          font={fontFamilies.roboto_bold}
          styles={{ textAlign: "center", marginTop: 12 }}
        />
      </SectionComponent>
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            padding: 16,
            borderRadius: 8,
            marginTop: 16,
            backgroundColor: appColor.white,
            borderWidth: 0.5,
            borderColor: appColor.gray,
          },
        ]}
      >
        <TextComponent
          text={vehicleStageDetail?.maintenanceStage?.name || "Không xác định"}
          size={16}
          color={appColor.primary}
          font={fontFamilies.roboto_medium}
        />
        <SpaceComponent height={8} />
        <RowComponent justify="flex-start">
          <TextComponent
            text="Áp dụng: "
            size={16}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
          />
          <TextComponent
            text={
              vehicleStageDetail?.maintenanceStage?.mileage != null &&
              vehicleStageDetail?.maintenanceStage?.durationMonth != null
                ? `${formatKM(
                    vehicleStageDetail.maintenanceStage.mileage
                  )} / ${formatMonth(
                    vehicleStageDetail.maintenanceStage.durationMonth
                  )}`
                : vehicleStageDetail?.maintenanceStage?.mileage != null
                ? `${formatKM(vehicleStageDetail.maintenanceStage.mileage)}`
                : vehicleStageDetail?.maintenanceStage?.durationMonth != null
                ? `${formatMonth(
                    vehicleStageDetail.maintenanceStage.durationMonth
                  )}`
                : "Không xác định"
            }
            size={16}
            color={appColor.text}
            font={fontFamilies.roboto_regular}
            styles={{ marginLeft: 4 }}
          />
        </RowComponent>
        <SpaceComponent height={8} />
        <RowComponent
          justify="flex-start"
          styles={{ alignItems: "flex-start" }}
        >
          <TextComponent
            text="Mô tả: "
            size={16}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
          />
          <TextComponent
            text={vehicleStageDetail?.maintenanceStage?.description}
            size={16}
            color={appColor.text}
            font={fontFamilies.roboto_regular}
            styles={{ marginLeft: 4, maxWidth: "80%" }}
          />
        </RowComponent>
      </SectionComponent>
      <SpaceComponent height={16} />
      <TextComponent
        text="Thông tin xe"
        size={18}
        color={appColor.primary}
        font={fontFamilies.roboto_medium}
      />
      <SpaceComponent height={8} />
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            padding: 16,
            borderRadius: 8,
            backgroundColor: appColor.white,
            borderWidth: 0.5,
            borderColor: appColor.gray,
          },
        ]}
      >
        <RowComponent justify="space-between">
          <TextComponent
            text="Kiểu xe: "
            size={16}
            color={appColor.text}
            font={fontFamilies.roboto_regular}
          />
          <TextComponent
            text={vehicleStageDetail?.vehicle?.modelName || "Không xác định"}
            size={16}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
          />
        </RowComponent>
        <SpaceComponent height={8} />
        <RowComponent justify="space-between">
          <TextComponent
            text="Số khung: "
            size={16}
            color={appColor.text}
            font={fontFamilies.roboto_regular}
          />
          <TextComponent
            text={vehicleStageDetail?.vehicle?.chassisNumber}
            size={16}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
          />
        </RowComponent>
        <SpaceComponent height={8} />
        <RowComponent justify="space-between">
          <TextComponent
            text="Tình trạng bảo hành: "
            size={16}
            color={appColor.text}
            font={fontFamilies.roboto_regular}
          />
          <TextComponent
            text={warrantyStatus.status}
            size={16}
            color={warrantyStatus.color}
            font={fontFamilies.roboto_medium}
          />
        </RowComponent>
      </SectionComponent>
      <SpaceComponent height={16} />
      <TextComponent
        text="Thời gian dự kiến"
        size={18}
        color={appColor.primary}
        font={fontFamilies.roboto_medium}
      />
      <SpaceComponent height={8} />
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            padding: 16,
            borderRadius: 8,
            backgroundColor: appColor.white,
            borderWidth: 0.5,
            borderColor: appColor.gray,
          },
        ]}
      >
        <RowComponent justify="space-between">
          <TextComponent
            text="Trạng thái: "
            size={16}
            color={appColor.text}
            font={fontFamilies.roboto_regular}
          />
          <TextComponent
            text={statusLabel(vehicleStageDetail?.status) || "Không xác định"}
            size={16}
            color={statusColor(vehicleStageDetail?.status)}
            font={fontFamilies.roboto_medium}
          />
        </RowComponent>
        <SpaceComponent height={8} />
        <RowComponent justify="space-between">
          <TextComponent
            text="Ngày dự kiến: "
            size={16}
            color={appColor.text}
            font={fontFamilies.roboto_regular}
          />
          <TextComponent
            text={
              vehicleStageDetail?.expectedImplementationDate
                ? formatDate(vehicleStageDetail.expectedImplementationDate)
                : "Không xác định"
            }
            size={16}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
          />
        </RowComponent>
      </SectionComponent>
      <SpaceComponent height={16} />
      <TextComponent
        text="Các hạng mục thực hiện"
        size={18}
        color={appColor.primary}
        font={fontFamilies.roboto_medium}
      />
      <SpaceComponent height={8} />
      {maintenanceStageDetails &&
        maintenanceStageDetails.map((item) => (
          <RowComponent
            key={item.id}
            styles={[
              globalStyle.shadow,
              {
                padding: 16,
                borderRadius: 8,
                backgroundColor: appColor.white,
                borderWidth: 0.5,
                borderColor: appColor.gray,
                alignItems: "flex-start",
                marginBottom: 12,
              },
            ]}
          >
            <Image
              source={{
                uri:
                  item.part?.image ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgtK69RjrQnL72LfHby7l5uB9xH5QZEyEvqA&s",
              }}
              style={{
                width: 120,
                height: 100,
                borderRadius: 8,
                resizeMode: "contain",
              }}
            />
            <View style={{ marginLeft: 20, flex: 1, justifyContent: "center" }}>
              <TextComponent
                text={item.part?.name || "Không xác định"}
                size={16}
                color={appColor.text}
                font={fontFamilies.roboto_medium}
              />
              <SpaceComponent height={4} />
              <TextComponent
                text={item.part?.code || "--"}
                size={16}
                color={appColor.primary}
                font={fontFamilies.roboto_medium}
              />
              <SpaceComponent height={4} />
              <TextComponent
                text={
                  item?.actionType?.length
                    ? item.actionType
                        .map((act) => formatActionType(act))
                        .join(", ")
                    : "--"
                }
                size={16}
                color={appColor.text}
                font={fontFamilies.roboto_regular}
              />
            </View>
          </RowComponent>
        ))}
    </BackgroundComponent>
  );
};

export default MaintenanceDetail;
