import React, { useEffect } from "react";
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

const MaintenanceDetail = ({ route, navigation }: any) => {
  const { id } = route?.params || {};
  const [vehicleStageDetail, setVehicleStageDetail] = React.useState<any>(null);
  useEffect(() => {
    console.log("MaintenanceDetail id:", id);
    fetchVehicleStageDetail(id);
  }, [id]);

  const fetchVehicleStageDetail = async (id: string) => {
    console.log("Fetch vehicle stage detail for id:", id);
    const res = await getVehicleStageDetail(id);
    if (res.success) {
      console.log("Vehicle stage detail fetched:", res.data);
      setVehicleStageDetail(res.data);
    } else {
      console.log("Failed to fetch vehicle stage detail:", res.message);
    }
  };

  // Check warranty status based on warranty expiry date
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
          status: `Còn bảo hành (${daysRemaining} ngày)`,
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
      params: { vehicleStageId: id, type: "MAINTENANCE_TYPE" },
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
          size={18}
          color={appColor.text}
          font={fontFamilies.roboto_medium}
        />
        <SpaceComponent height={8} />
        <RowComponent justify="flex-start">
          <TextComponent
            text="Áp dụng: "
            size={18}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
          />
          <TextComponent
            text={
              `${
                vehicleStageDetail?.maintenanceStage?.mileage +
                " hoặc " +
                vehicleStageDetail?.maintenanceStage?.durationMonth
              }` || "Không xác định"
            }
            size={18}
            color={appColor.text}
            font={fontFamilies.roboto_regular}
            styles={{ marginLeft: 4 }}
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
            size={18}
            color={appColor.text}
            font={fontFamilies.roboto_regular}
          />
          <TextComponent
            text={vehicleStageDetail?.vehicle?.modelName || "Không xác định"}
            size={18}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
          />
        </RowComponent>
        <SpaceComponent height={8} />
        <RowComponent justify="space-between">
          <TextComponent
            text="Tình trạng bảo hành: "
            size={18}
            color={appColor.text}
            font={fontFamilies.roboto_regular}
          />
          <TextComponent
            text={warrantyStatus.status}
            size={18}
            color={warrantyStatus.color}
            font={fontFamilies.roboto_medium}
          />
        </RowComponent>
      </SectionComponent>
    </BackgroundComponent>
  );
};

export default MaintenanceDetail;
