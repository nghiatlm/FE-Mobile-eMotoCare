import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
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
import { getEvcheckDetail } from "../../services/evcheck.service";
import { createPayment } from "../../services/payment.service";
import { globalStyle } from "../../styles/globalStyle";
import { formatDate, formatSlotRange } from "../../utils/data.util";
import { formatPhoneNumber } from "../../utils/phone.util";

const RevisedMinutes = ({ navigation, route }: any) => {
  const {appointmentId, evcheckId} = route.params;
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const formatVND = (n: number | undefined | null) => {
    const v = Number(n || 0);
    return `${v.toLocaleString?.("vi-VN") ?? v} ₫`;
  };

  const totals = React.useMemo(() => {
    const items = data?.evCheckDetails ?? [];
    const sumParts = items.reduce(
      (acc: number, it: any) => acc + Number(it?.pricePart || 0),
      0
    );
    const sumService = items.reduce(
      (acc: number, it: any) => acc + Number(it?.priceService || 0),
      0
    );
    const subtotal = sumParts + sumService;
    const vat = subtotal * 0.08;
    const grandTotal = subtotal + vat;
    return { sumParts, sumService, subtotal, vat, grandTotal };
  }, [data]);

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
      amount: Math.round(totals.grandTotal || 0),
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
      {isLoading && (
        <SectionComponent styles={{ alignItems: "center", paddingVertical: 12 }}>
          <ActivityIndicator size="small" color={appColor.primary} />
          <SpaceComponent height={8} />
          <TextComponent text="Đang tải dữ liệu..." color={appColor.gray2} size={12} />
        </SectionComponent>
      )}
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
        <RowComponent justify="space-between" styles={{ alignItems: "center" }}>
          <RowComponent styles={{ gap: 8, alignItems: "center" }}>
            <AntDesign name="user" size={16} color={appColor.gray2} />
            <TextComponent text="Khách hàng" size={14} color={appColor.gray2} />
          </RowComponent>
          <TextComponent
            text={`${data?.appointment?.customer?.firstName} ${data?.appointment?.customer?.lastName}`}
            size={15}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
          />
        </RowComponent>
        <SpaceComponent height={4} />
        <RowComponent justify="space-between" styles={{ alignItems: "center" }}>
          <RowComponent styles={{ gap: 8, alignItems: "center" }}>
            <AntDesign name="phone" size={16} color={appColor.gray2} />
            <TextComponent text="Số điện thoại" size={14} color={appColor.gray2} />
          </RowComponent>
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
        <RowComponent justify="space-between" styles={{ alignItems: "center" }}>
          <RowComponent styles={{ gap: 8, alignItems: "center" }}>
            <AntDesign name="car" size={16} color={appColor.gray2} />
            <TextComponent text="Kiểu xe" size={14} color={appColor.gray2} />
          </RowComponent>
          <TextComponent
            text={(data?.appointment?.vehicle?.vehicleModel?.name as string) || "Evo 200Lite"}
            size={15}
            color={appColor.text}
            font={fontFamilies.roboto_medium}
          />
        </RowComponent>
        <SpaceComponent height={4} />
        <RowComponent justify="space-between" styles={{ alignItems: "center" }}>
          <RowComponent styles={{ gap: 8, alignItems: "center" }}>
            <AntDesign name="calendar" size={16} color={appColor.gray2} />
            <TextComponent text="Thời gian" size={14} color={appColor.gray2} />
          </RowComponent>
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
          <View key={index}>
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
                text="Giải pháp: "
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
                <TextComponent text={formatVND((item?.pricePart || 0) + (item?.priceService || 0))} />
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
                  text={formatVND(((item?.pricePart || 0) + (item?.priceService || 0)) * 0.08)}
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
                <TextComponent text={formatVND(item?.totalAmount ?? ((item?.pricePart || 0) + (item?.priceService || 0)) * 1.08)} />
              </RowComponent>
            </SectionComponent>
          </View>
        ))}
      {data?.evCheckDetails?.length ? (
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
          <TextComponent
            text="Tổng hợp hóa đơn"
            size={16}
            color={appColor.primary}
            font={fontFamilies.roboto_medium}
          />
          <SpaceComponent height={8} />
          <RowComponent justify="space-between">
            <TextComponent text="Tổng phụ tùng" size={14} font={fontFamilies.roboto_regular} />
            <TextComponent text={formatVND(totals.sumParts)} />
          </RowComponent>
          <SpaceComponent height={6} />
          <RowComponent justify="space-between">
            <TextComponent text="Tổng dịch vụ" size={14} font={fontFamilies.roboto_regular} />
            <TextComponent text={formatVND(totals.sumService)} />
          </RowComponent>
          <SpaceComponent height={6} />
          <RowComponent justify="space-between">
            <TextComponent text="Tạm tính" size={14} font={fontFamilies.roboto_regular} />
            <TextComponent text={formatVND(totals.subtotal)} />
          </RowComponent>
          <SpaceComponent height={6} />
          <RowComponent justify="space-between">
            <TextComponent text="VAT (8%)" size={14} font={fontFamilies.roboto_regular} />
            <TextComponent text={formatVND(totals.vat)} />
          </RowComponent>
          <View style={{ height: 1.5, backgroundColor: appColor.gray, marginVertical: 8 }} />
          <RowComponent justify="space-between">
            <TextComponent text="Tổng thanh toán" size={15} color={appColor.primary} font={fontFamilies.roboto_medium} />
            <TextComponent text={formatVND(totals.grandTotal)} />
          </RowComponent>
        </SectionComponent>
      ) : null}
      <SpaceComponent height={24} />
      <ButtonComponent
        text="Thanh toán"
        type="primary"
        onPress={handelPayment}
        disabled={isLoading || !totals.grandTotal}
        icon={isLoading ? <ActivityIndicator size="small" color={appColor.white} /> : undefined}
      />
    </BackgroundComponent>
  );
};

export default RevisedMinutes;
