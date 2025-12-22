import { ArrowRight } from "iconsax-react-nativejs";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { newVehicle } from "../../apis/customer.api";
import {
  BackgroundComponent,
  ButtonComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { globalStyle } from "../../styles/globalStyle";
import { formatDate } from "../../utils/data.util";
import { checkWarranty } from "../../utils/formatDate";
import { sex } from "../../utils/generatesex.util";
import { getVehicleStages } from "../../services/vehicleStage.service";
import {
  formatDurationMonth,
  formatMileage,
} from "../../utils/maintenanceFormat.util";

const AddVehicle = ({ route, navigation }: any) => {
  const { accountId } = route.params;
  const [citizenIdentification, setCitizenIdentification] = useState("");
  const [chassisNumber, setChassisNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [vehicle, setVehicle] = useState<any>(null);
  const [vehicleStageData, setVehicleStageData] = useState<any>(null);
  const handleCitizenChange = (val: string) => {
    setCitizenIdentification(val);
  };

  const handleChassisNumberChange = (val: string) => {
    setChassisNumber(val);
  };

  const resetData = () => {
    setCitizenIdentification("");
    setChassisNumber("");
  };

  const handelInformationSubmit = async () => {
    setIsLoading(true);
    const model = {
      accountId: accountId,
      citizenId: citizenIdentification,
      chassisNumber: chassisNumber,
    };
    console.log("AddVehicle model:", model);
    const res = await newVehicle(model);
    if (res.success) {
      console.log("Vehicle added successfully:", res.data);
      setData(res.data);
      setVehicle(res.data.vehicleResponse);
      fetchVehicleStageData(res.data.vehicleResponse.id);
      setIsLoading(false);
      resetData();
    } else {
      console.log("Failed to add vehicle:", res.message);
    }
  };

  const fetchVehicleStageData = async (vehicleId: number) => {
    const res = await getVehicleStages(vehicleId);
    console.log("Vehicle stage data fetched:", res);
    if (res.success) {
      setVehicleStageData(res.data);
    } else {
      console.log("Failed to fetch vehicle stage data:", res.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return appColor.warning;
      case "NO_START":
        return appColor.gray2;
      case "COMPLETED":
        return appColor.primary;
      case "OVERDUE":
        return appColor.danger;
      default:
        return appColor.gray;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "Sắp tới";
      case "NO_START":
        return "Chưa bắt đầu";
      case "COMPLETED":
        return "Hoàn thành";
      case "OVERDUE":
        return "Quá hạn";
      default:
        return status;
    }
  };

  const goHome = () => {
    navigation.navigate("HomeScreen");
  };

  const warrantyInfo = checkWarranty(data?.vehicleResponse?.warrantyExpiry);
  return (
    <BackgroundComponent isScroll back title="Thêm xe mới">
      <SectionComponent styles={{ marginTop: 20, alignItems: "center" }}>
        <TextComponent
          text="Liên kết xe của bạn"
          size={18}
          color={appColor.text}
          font={fontFamilies.roboto_medium}
        />
        <TextComponent
          text="Liên kết xe để trải nghiệm tốt"
          size={14}
          font={fontFamilies.roboto_regular}
          color={appColor.gray2}
          styles={{ marginTop: 8 }}
        />
      </SectionComponent>

      <SpaceComponent height={24} />
      {!data?.vehicleResponse ? (
        <SectionComponent
          styles={[
            globalStyle.shadow,
            {
              backgroundColor: appColor.white,
              padding: 16,
              borderRadius: 8,
              borderWidth: 0.5,
              borderColor: appColor.gray,
              paddingBottom: -12,
              position: "relative",
            },
          ]}
        >
          {isLoading && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8,
                zIndex: 999,
              }}
            >
              <ActivityIndicator size="large" color={appColor.primary} />
              <SpaceComponent height={8} />
              <TextComponent text="Đang tải..." />
            </View>
          )}
          <TextComponent
            text="Nhập số CCCD chủ xe:"
            size={16}
            color={appColor.text}
            font={fontFamilies.roboto_regular}
          />
          <SpaceComponent height={8} />
          <InputComponent
            value={citizenIdentification}
            onChange={handleCitizenChange}
            placeholder="Nhập căn cước công dân"
            allowClear
            type="number-pad"
          />
          <TextComponent
            text="Nhập số khung:"
            size={16}
            color={appColor.text}
            font={fontFamilies.roboto_regular}
          />
          <SpaceComponent height={8} />
          <InputComponent
            value={chassisNumber}
            onChange={handleChassisNumberChange}
            placeholder="Nhập số khùng"
            allowClear
          />
          <ButtonComponent
            text="Tiếp theo"
            type="primary"
            onPress={handelInformationSubmit}
            iconFlex="right"
            icon={
              <View
                style={[
                  globalStyle.iconContainer,
                  {
                    backgroundColor: appColor.primary,
                  },
                ]}
              >
                <ArrowRight size={30} color={appColor.white} />
              </View>
            }
          />
        </SectionComponent>
      ) : (
        <View>
          <SectionComponent
            styles={[
              globalStyle.shadow,
              {
                backgroundColor: appColor.white,
                padding: 16,
                borderRadius: 8,
                borderWidth: 0.5,
                borderColor: appColor.gray,
              },
            ]}
          >
            <TextComponent
              text="Thông tin xe của bạn"
              size={16}
              color={appColor.primary}
              font={fontFamilies.roboto_medium}
            />
            <View
              style={{
                height: 0.5,
                borderWidth: 0.5,
                borderColor: appColor.gray,
                marginVertical: 12,
              }}
            />
            <RowComponent justify="space-between">
              <TextComponent
                text="Mẫu xe: "
                color={appColor.text}
                font={fontFamilies.roboto_medium}
                size={14}
              />
              <TextComponent
                text={vehicle?.modelName || "Không có dữ liệu"}
                color={appColor.text}
                font={fontFamilies.roboto_medium}
                size={14}
              />
            </RowComponent>
            <SpaceComponent height={8} />
            <RowComponent justify="space-between">
              <TextComponent
                text="Số khung: "
                color={appColor.text}
                font={fontFamilies.roboto_medium}
                size={14}
              />
              <TextComponent
                text={vehicle?.chassisNumber || "Không có dữ liệu"}
                color={appColor.text}
                font={fontFamilies.roboto_medium}
                size={14}
              />
            </RowComponent>
            <SpaceComponent height={8} />
            <RowComponent justify="space-between">
              <TextComponent
                text="Ngày mua: "
                color={appColor.text}
                font={fontFamilies.roboto_medium}
                size={14}
              />
              <TextComponent
                text={
                  vehicle?.purchaseDate
                    ? formatDate(vehicle.purchaseDate)
                    : "Không có dữ liệu"
                }
                color={appColor.text}
                font={fontFamilies.roboto_medium}
                size={14}
              />
            </RowComponent>
            <SpaceComponent height={8} />
            <RowComponent justify="space-between">
              <TextComponent
                text="Bảo hành: "
                color={appColor.text}
                font={fontFamilies.roboto_medium}
                size={14}
              />
              <TextComponent
                text={warrantyInfo.remaining}
                color={warrantyInfo.expired ? appColor.white : appColor.primary}
                font={fontFamilies.roboto_medium}
                size={14}
                styles={{
                  backgroundColor: warrantyInfo.expired
                    ? appColor.danger
                    : "transparent",
                  paddingVertical: 2,
                  borderRadius: 4,
                }}
              />
            </RowComponent>
          </SectionComponent>
          <SpaceComponent height={16} />
          <SectionComponent
            styles={[
              globalStyle.shadow,
              {
                backgroundColor: appColor.white,
                padding: 16,
                borderRadius: 8,
                borderWidth: 0.5,
                borderColor: appColor.gray,
              },
            ]}
          >
            <TextComponent
              text="Thông tin chủ sở hữu"
              size={16}
              color={appColor.primary}
              font={fontFamilies.roboto_medium}
            />
            <View
              style={{
                height: 0.5,
                borderWidth: 0.5,
                borderColor: appColor.gray,
                marginVertical: 12,
              }}
            />
            <RowComponent justify="space-between">
              <TextComponent
                text="Họ & tên: "
                color={appColor.text}
                font={fontFamilies.roboto_medium}
                size={14}
              />
              <TextComponent
                text={data?.firstName + " " + data?.lastName}
                color={appColor.text}
                font={fontFamilies.roboto_medium}
                size={14}
              />
            </RowComponent>
            <SpaceComponent height={8} />
            <RowComponent justify="space-between">
              <TextComponent
                text="Ngày sinh: "
                color={appColor.text}
                font={fontFamilies.roboto_medium}
                size={14}
              />
              <TextComponent
                text={
                  data?.dateOfBirth
                    ? formatDate(data.dateOfBirth)
                    : "Không có dữ liệu"
                }
                color={appColor.text}
                font={fontFamilies.roboto_medium}
                size={14}
              />
            </RowComponent>
            <SpaceComponent height={8} />
            <RowComponent justify="space-between">
              <TextComponent
                text="Giới tính: "
                color={appColor.text}
                font={fontFamilies.roboto_medium}
                size={14}
              />
              <TextComponent
                text={sex(data?.gender)}
                color={appColor.text}
                font={fontFamilies.roboto_medium}
                size={14}
              />
            </RowComponent>
            <SpaceComponent height={8} />
            <RowComponent justify="space-between">
              <TextComponent
                text="Căn cuớc công dân: "
                color={appColor.text}
                font={fontFamilies.roboto_medium}
                size={14}
              />
              <TextComponent
                text={data?.citizenId}
                color={appColor.text}
                font={fontFamilies.roboto_medium}
                size={14}
              />
            </RowComponent>
            <SpaceComponent height={8} />
            <RowComponent justify="space-between">
              <TextComponent
                text="Địa chỉ: "
                color={appColor.text}
                font={fontFamilies.roboto_medium}
                size={14}
              />
              <TextComponent
                text={data?.address}
                color={appColor.text}
                font={fontFamilies.roboto_medium}
                size={14}
              />
            </RowComponent>
          </SectionComponent>
          <SpaceComponent height={16} />
          <SectionComponent
            styles={[
              globalStyle.shadow,
              {
                backgroundColor: appColor.white,
                padding: 16,
                borderRadius: 8,
                borderWidth: 0.5,
                borderColor: appColor.gray,
              },
            ]}
          >
            <TextComponent
              text="Thông tin lịch bảo dưỡng"
              size={16}
              color={appColor.primary}
              font={fontFamilies.roboto_medium}
            />
            <View
              style={{
                height: 0.5,
                borderWidth: 0.5,
                borderColor: appColor.gray,
                marginVertical: 12,
              }}
            />
            {vehicleStageData?.VechicleStages?.length ? (
              vehicleStageData.VechicleStages.map((stage, index) => (
                <View key={stage.id ?? index}>
                  <RowComponent
                    justify="space-between"
                    styles={{ alignItems: "center" }}
                  >
                    <View style={{ flex: 1 }}>
                      <TextComponent
                        text={
                          stage?.maintenanceStage?.name || "Không có dữ liệu"
                        }
                        color={appColor.text}
                        font={fontFamilies.roboto_medium}
                        size={14}
                      />
                      <TextComponent
                        text={`${formatMileage(
                          stage?.maintenanceStage?.mileage ?? 0
                        )} - ${formatDurationMonth(
                          stage?.maintenanceStage?.durationMonth ?? 0
                        )}`}
                        color={appColor.gray2}
                        font={fontFamilies.roboto_regular}
                        size={12}
                        styles={{ marginTop: 4 }}
                      />
                      {stage?.expectedImplementationDate ? (
                        <TextComponent
                          text={`Dự kiến: ${formatDate(
                            stage.expectedImplementationDate
                          )}`}
                          color={appColor.gray2}
                          font={fontFamilies.roboto_regular}
                          size={12}
                          styles={{ marginTop: 2 }}
                        />
                      ) : (
                        <TextComponent
                          text="Dự kiến: Không có dữ liệu"
                          color={appColor.gray2}
                          font={fontFamilies.roboto_regular}
                          size={12}
                          styles={{ marginTop: 2 }}
                        />
                      )}
                    </View>
                    <View
                      style={{
                        backgroundColor: getStatusColor(stage?.status),
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 16,
                        minWidth: 90,
                        alignItems: "center",
                      }}
                    >
                      <TextComponent
                        text={getStatusLabel(stage?.status || "")}
                        color={appColor.white}
                        font={fontFamilies.roboto_medium}
                        size={12}
                      />
                    </View>
                  </RowComponent>
                  {index < vehicleStageData.VechicleStages.length - 1 && (
                    <View
                      style={{
                        height: 0.5,
                        borderWidth: 0.5,
                        borderColor: appColor.gray,
                        marginVertical: 12,
                      }}
                    />
                  )}
                </View>
              ))
            ) : (
              <TextComponent
                text="Chưa có dữ liệu lịch bảo dưỡng"
                color={appColor.gray2}
                font={fontFamilies.roboto_regular}
                size={14}
              />
            )}
          </SectionComponent>
          <SpaceComponent height={16} />
          <ButtonComponent text="Trang chủ" type="secondary" onPress={goHome} />
        </View>
      )}
    </BackgroundComponent>
  );
};

export default AddVehicle;
