import { ArrowRight } from "iconsax-react-nativejs";
import React, { useState } from "react";
import { View } from "react-native";
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
import vehicleStageData from "../../services/contants/vehicleStage.json";
import { globalStyle } from "../../styles/globalStyle";
import { formatDate } from "../../utils/data.util";
import { checkWarranty } from "../../utils/formatDate";
import { sex } from "../../utils/generatesex.util";
import {
  formatDurationMonth,
  formatMileage,
} from "../../utils/maintenanceFormat.util";

const vehicle = {
  chassisNumber: "CKG397999",
  color: "Green",
  createdAt: "2025-12-09T16:59:36.6358",
  customerId: "837d02f1-f0b6-4986-a908-bbf3b7b4e552",
  engineNumber: "ENG315541",
  id: "a16e337d-bdcc-4d79-b5a4-c2ca6ed394d2",
  image:
    "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwb9888ace/images/PDP-XMD/feliz/2025/img-top-feliz-green.webp",
  manufactureDate: "2025-12-09T09:59:32.07603",
  modelId: "8f99c73f-f02e-4fa9-b4c9-ee1897ba0e41",
  modelName: "Vento Neo",
  purchaseDate: "2025-12-09T09:59:32.076082",
  status: "ACTIVE",
  updatedAt: "2025-12-09T16:59:36.6358",
  warrantyExpiry: "2025-12-09T09:59:32.076126",
};

const customer = {
  id: "ca6081f8-5c17-43b8-ab0b-ac17febf0385",
  accountId: "08de1789-f2f5-4d5f-8733-9b3e68b69b4b",
  account: null,
  firstName: "Thinh",
  lastName: "Nguyen",
  customerCode: "CUS-001",
  address: "HCM",
  citizenId: "002388241923",
  dateOfBirth: "2020-01-01T00:00:00",
  gender: "MALE",
  avatarUrl: "string",
  createdAt: "2025-10-30T14:57:18.773928",
  updatedAt: "2025-12-09T13:40:12.223561",
};

const AddVehicle = ({ route, navigation }: any) => {
  const { accountId } = route.params;
  const [citizenIdentification, setCitizenIdentification] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCitizenChange = (val: string) => {
    setCitizenIdentification(val);
  };

  const resetData = () => {
    setCitizenIdentification("");
  };

  const handelInformationSubmit = async () => {
    const model = {
      accountId: accountId,
      citizenId: citizenIdentification,
    };
    console.log("AddVehicle model:", model);
    const res = await newVehicle(model);
    if (res.success) {
      console.log("Vehicle added successfully:", res.data);
      resetData();
    } else {
      console.log("Failed to add vehicle:", res.message);
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

  const warrantyInfo = checkWarranty(vehicle?.warrantyExpiry);
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
      {!vehicle ? (
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
            },
          ]}
        >
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
                text={vehicle.modelName}
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
                text={vehicle.chassisNumber}
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
                text={formatDate(vehicle.purchaseDate)}
                color={appColor.text}
                font={fontFamilies.roboto_medium}
                size={14}
              />
            </RowComponent>
            <SpaceComponent height={8} />
            <RowComponent justify="space-between">
              <TextComponent
                text="Tình trạng bảo hành: "
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
                  paddingHorizontal: 6,
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
                text={customer.firstName + " " + customer.lastName}
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
                text={formatDate(customer.dateOfBirth)}
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
                text={sex(customer.gender)}
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
                text={customer.citizenId}
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
                text={customer.address}
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
            {vehicleStageData.VechicleStages.map((stage, index) => (
              <View key={stage.id}>
                <RowComponent
                  justify="space-between"
                  styles={{ alignItems: "center" }}
                >
                  <View style={{ flex: 1 }}>
                    <TextComponent
                      text={stage.maintenanceStage.name}
                      color={appColor.text}
                      font={fontFamilies.roboto_medium}
                      size={14}
                    />
                    <TextComponent
                      text={`${formatMileage(
                        stage.maintenanceStage.mileage
                      )} - ${formatDurationMonth(
                        stage.maintenanceStage.durationMonth
                      )}`}
                      color={appColor.gray2}
                      font={fontFamilies.roboto_regular}
                      size={12}
                      styles={{ marginTop: 4 }}
                    />
                    <TextComponent
                      text={`Dự kiến: ${formatDate(
                        stage.expectedImplementationDate
                      )}`}
                      color={appColor.gray2}
                      font={fontFamilies.roboto_regular}
                      size={12}
                      styles={{ marginTop: 2 }}
                    />
                  </View>
                  <View
                    style={{
                      backgroundColor: getStatusColor(stage.status),
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                      minWidth: 90,
                      alignItems: "center",
                    }}
                  >
                    <TextComponent
                      text={getStatusLabel(stage.status)}
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
            ))}
          </SectionComponent>
          <SpaceComponent height={16} />
          <ButtonComponent text="Trang chủ" type="secondary" onPress={goHome} />
        </View>
      )}
    </BackgroundComponent>
  );
};

export default AddVehicle;
