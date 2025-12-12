import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";
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
import { getEvcheckDetail } from "../../services/evcheck.service";
import { formatPhoneNumber } from "../../utils/phone.util";
import { formatDate, formatSlotRange } from "../../utils/data.util";
import { createPayment } from "../../services/payment.service";

const RevisedMinutes = ({ navigation, route }: any) => {
  const {appointmentId, evcheckId} = route.params;
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [evcheckId]);

  const fetchData = async () => {
    setIsLoading(true);
    const res = await getEvcheckDetail(evcheckId);
    if (res.success) {
      setData(res.data);
    } else {
      setData(null);
    }
    setIsLoading(false);
  };

  const stattusLabe = (status: string) => {
    switch (status) {
      case "REPLACEMENT":
        return "Thay mới";
      case "REPAIR":
        return "Sửa chữa";
      case "NO_ACTION":
        return "Không hành động";
      default:
        return "Không xác định";
    }
  };

  const handelPayment = async () => {
    setIsLoading(true);

    const model = {
      amount: 2000,
      paymentMethod: "PAY_OS_APP",
      currency: "VND",
      appointmentId: data?.appointment?.id,
      successUrl: "emotocare://success",
      cancelUrl: "emotocare://cancel",
    };
    const response = await createPayment(model);
    console.log("Payment response:", response);
    setIsLoading(false);
    if (response.success) {
      setPaymentUrl(response.data.checkoutUrl);
      navigation.navigate("PaymentInfor", { paymentUrl: response.data.checkoutUrl });
    }
  };

  return (
    <BackgroundComponent back title="Biên bản sửa chữa" isScroll>
      <SpaceComponent height={12} />
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
            text="Khách hàng: "
            size={15}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
          />
          <TextComponent
            text={`${data?.appointment?.customer?.firstName} ${data?.appointment?.customer?.lastName}`}
            size={15}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
          />
        </RowComponent>
        <SpaceComponent height={4} />
        <RowComponent justify="space-between">
          <TextComponent
            text="Số điện thoại: "
            size={15}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
          />
          <TextComponent
            text={formatPhoneNumber(
              data?.appointment?.customer?.account?.phone
            )}
            size={15}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
          />
        </RowComponent>
        <SpaceComponent height={4} />
        <RowComponent justify="space-between">
          <TextComponent
            text="Kiểu xe: "
            size={15}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
          />
          <TextComponent
            text="Evo 200Lite"
            size={15}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
          />
        </RowComponent>
        <SpaceComponent height={4} />
        <RowComponent justify="space-between">
          <TextComponent
            text="Thời gian: "
            size={15}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
          />
          <TextComponent
            text={`${
              data?.appointment?.appointmentDate
                ? formatDate(data.appointment.appointmentDate)
                : "Chưa xác định"
            } ${
              data?.appointment?.slotTime
                ? formatSlotRange(data.appointment.slotTime)
                : ""
            }`}
            size={15}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
          />
        </RowComponent>
      </SectionComponent>

      <SpaceComponent height={16} />
      <TextComponent
        text="Nội dung sửa chữa"
        size={16}
        color={appColor.primary}
        font={fontFamilies.roboto_medium}
      />
      <SpaceComponent height={8} />
      {data?.evCheckDetails &&
        data?.evCheckDetails.map((item, index) => (
          <>
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
              key={index}
            >
              <RowComponent styles={{ gap: 12, alignItems: "flex-start" }}>
                <Image
                  source={
                    item?.partItem?.part?.image
                      ? { uri: item.partItem.part.image }
                      : require("../../assets/images/parts/dong-ho.png")
                  }
                  style={{ width: 100, height: 100, resizeMode: "contain" }}
                />
                <View style={{ flex: 1 }}>
                  <TextComponent
                    text={item?.partItem?.part?.name || "Không xác định"}
                    size={14}
                    font={fontFamilies.roboto_medium}
                    color={appColor.text}
                  />
                  <SpaceComponent height={6} />
                  <RowComponent justify="flex-start">
                    <TextComponent
                      text="Tình trạng: "
                      size={13}
                      color={appColor.text}
                      font={fontFamilies.roboto_regular}
                    />
                    <TextComponent
                      text={item?.result || "Không xác định"}
                      size={13}
                      font={fontFamilies.roboto_medium}
                      color={appColor.danger}
                    />
                  </RowComponent>
                  {item?.remedies === "REPLACEMENT" && (
                    <RowComponent justify="flex-start">
                      <TextComponent
                        text="Số lượng: "
                        size={13}
                        color={appColor.text}
                        font={fontFamilies.roboto_regular}
                      />
                      <TextComponent
                        text={item?.quantity?.toString() || "0"}
                        size={13}
                        font={fontFamilies.roboto_medium}
                        color={appColor.danger}
                      />
                    </RowComponent>
                  )}
                </View>
              </RowComponent>
              <TextComponent
                text="Giái pháp: "
                size={14}
                font={fontFamilies.roboto_medium}
                color={appColor.text}
                styles={{ marginTop: 8 }}
              />
              <SpaceComponent height={4} />
              <RowComponent justify="space-between">
                <TextComponent
                  text={stattusLabe(item?.remedies)}
                  size={13}
                  color={appColor.text}
                  font={fontFamilies.roboto_regular}
                  styles={{ marginLeft: 10 }}
                />
                {item?.remedies === "REPLACEMENT" && (
                  <RowComponent>
                    <TextComponent
                      text="Giá tiền: "
                      size={13}
                      font={fontFamilies.roboto_medium}
                    />
                    <TextComponent
                      text={item?.pricePart?.toString() || "0"}
                      size={13}
                      font={fontFamilies.roboto_medium}
                      color={appColor.warning}
                    />
                  </RowComponent>
                )}
              </RowComponent>
            </SectionComponent>
            <SpaceComponent height={16} />
            <SectionComponent styles={{ paddingHorizontal: 0 }}>
              {/* <RowComponent justify="space-between">
                <TextComponent
                  text="Tiền Công dịch vụ: "
                  size={14}
                  color={appColor.primary}
                  font={fontFamilies.roboto_medium}
                />
                <TextComponent text="30.000" />
              </RowComponent> */}
              {/* <SpaceComponent height={8} /> */}
              <RowComponent justify="space-between">
                <TextComponent
                  text="Tổng tiền phụ tùng và dịch vụ: "
                  size={14}
                  color={appColor.primary}
                  font={fontFamilies.roboto_medium}
                />
                <TextComponent text={item?.pricePart + item?.priceService} />
              </RowComponent>
              <SpaceComponent height={8} />
              <RowComponent justify="space-between">
                <TextComponent
                  text="VAT: 8%"
                  size={14}
                  color={appColor.primary}
                  font={fontFamilies.roboto_medium}
                />
                <TextComponent
                  text={(
                    (item?.pricePart + item?.priceService) *
                    0.08
                  ).toString()}
                />
              </RowComponent>
              <View
                style={{
                  height: 1.5,
                  backgroundColor: appColor.gray,
                  marginVertical: 8,
                }}
              />
              <RowComponent justify="space-between">
                <TextComponent
                  text="Tổng tiền: "
                  size={14}
                  color={appColor.primary}
                  font={fontFamilies.roboto_medium}
                />
                <TextComponent text={item.totalAmount} />
              </RowComponent>
            </SectionComponent>
          </>
        ))}
      <SpaceComponent height={24} />
      <ButtonComponent
        text="Thanh toán"
        type="primary"
        onPress={handelPayment}
      />
    </BackgroundComponent>
  );
};

export default RevisedMinutes;
