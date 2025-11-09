import React, { useMemo } from "react";
import { Image, Linking, TouchableOpacity, View } from "react-native";
import {
    BackgroundComponent,
    ButtonComponent,
    DividerWithLabelComponent,
    RowComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from "../../components";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";
import { globalStyle } from "../../styles/globalStyle";

interface Props {
  navigation?: any;
  route?: any;
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v
  );

const PaymentInvoice = ({ navigation, route }: Props) => {
  // nhận params nếu có (ví dụ: appointmentId, items, amount)
  const params = route?.params || {};
  const invoiceId =
    params.invoiceId || `INV-${Date.now().toString().slice(-6)}`;
  const items = params.items || [
    { id: "i1", name: "Thay đèn pha", price: 500000 },
    { id: "i2", name: "Công kiểm tra", price: 50000 },
  ];
  const amount =
    params.amount ?? items.reduce((s: number, it: any) => s + it.price, 0);

  const summary = useMemo(
    () => ({ invoiceId, items, amount }),
    [invoiceId, items, amount]
  );

  const onCancel = () => navigation?.goBack();
  const onPay = () =>
    navigation?.navigate("PaymentGateway", {
      invoiceId: summary.invoiceId,
      amount: summary.amount,
    });

  return (
    <BackgroundComponent
      back
      title="Thông tin thanh toán"
      isScroll
      footer={
        <View
          style={{
            padding: 12,
            backgroundColor: appColor.white,
            borderTopWidth: 1,
            borderColor: "#EEE",
          }}
        >
          <RowComponent styles={{ width: "100%" }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <ButtonComponent
                text="Hủy"
                onPress={onCancel}
                styles={{
                  width: "100%",
                  backgroundColor: "#E53935",
                  borderColor: "#E53935",
                  paddingVertical: 12,
                  borderRadius: 10,
                }}
                textStyle={{
                  color: "#fff",
                  fontSize: 16,
                  fontFamily: fontFamilies.roboto_medium,
                }}
              />
            </View>

            <View style={{ flex: 1 }}>
              <ButtonComponent
                text="Thanh toán"
                onPress={onPay}
                styles={{
                  width: "100%",
                  backgroundColor: appColor.primary,
                  borderColor: appColor.primary,
                  paddingVertical: 12,
                  borderRadius: 10,
                }}
                textStyle={{
                  color: "#fff",
                  fontSize: 16,
                  fontFamily: fontFamilies.roboto_medium,
                }}
              />
            </View>
          </RowComponent>
        </View>
      }
    >
      <SpaceComponent height={12} />
      <SectionComponent
        styles={[
          globalStyle.shadow,
          {
            backgroundColor: appColor.white,
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            borderWidth: 0.8,
            borderColor: appColor.gray,
          },
        ]}
      >
        <RowComponent justify="space-between" styles={{ marginBottom: 8 }}>
          <TextComponent
            text="Khách hàng"
            size={14}
            color={appColor.gray2}
            font={fontFamilies.roboto_regular}
          />
          <TextComponent
            text="Nguyễn Văn A"
            size={16}
            font={fontFamilies.roboto_medium}
            color={appColor.text}
            styles={{ textAlign: "right" }}
          />
        </RowComponent>

        <RowComponent justify="space-between" styles={{ marginBottom: 8 }}>
          <TextComponent
            text="Số điện thoại"
            size={14}
            color={appColor.gray2}
            font={fontFamilies.roboto_regular}
          />
          <TouchableOpacity onPress={() => Linking.openURL("tel:0329449930")}>
            <TextComponent
              text="0329449930"
              size={16}
              font={fontFamilies.roboto_medium}
              color={appColor.primary}
              styles={{ textAlign: "right" }}
            />
          </TouchableOpacity>
        </RowComponent>

        <RowComponent justify="space-between" styles={{ marginBottom: 8 }}>
          <TextComponent
            text="Loại xe"
            size={14}
            color={appColor.gray2}
            font={fontFamilies.roboto_regular}
          />
          <TextComponent
            text="Evo 200Lite"
            size={16}
            font={fontFamilies.roboto_medium}
            color={appColor.text}
            styles={{ textAlign: "right" }}
          />
        </RowComponent>

        <RowComponent justify="space-between">
          <TextComponent
            text="Ngày đặt lịch"
            size={14}
            color={appColor.gray2}
            font={fontFamilies.roboto_regular}
          />
          <TextComponent
            text="10-09-2025"
            size={16}
            font={fontFamilies.roboto_medium}
            color={appColor.text}
            styles={{ textAlign: "right" }}
          />
        </RowComponent>
      </SectionComponent>
      <SectionComponent styles={[{ paddingHorizontal: 6 }]}>
        <TextComponent text="Nội dung thực hiện" title />
        <SpaceComponent height={12} />
        <SectionComponent
          styles={[
            {
              flexDirection: "column",
              backgroundColor: appColor.white,
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: appColor.gray,
              width: "100%",
            },
          ]}
        >
          <RowComponent styles={{ alignItems: "flex-start", width: "100%" }}>
            <Image
              source={require("../../assets/images/parts/dong-ho.png")}
              style={{ width: 110, height: 110, resizeMode: "contain" }}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <TextComponent
                text="Đèn pha VINFAST KLARA"
                size={16}
                font={fontFamilies.roboto_medium}
              />
              <SpaceComponent height={8} />
              <RowComponent justify="flex-start">
                <TextComponent
                  text="Tình trạng:"
                  font={fontFamilies.roboto_medium}
                />
                <TextComponent text=" Bình thường" styles={{ marginLeft: 8 }} />
              </RowComponent>
            </View>
          </RowComponent>

          <SpaceComponent height={10} />

          <View style={{ width: "100%", marginTop: 12 }}>
            <TextComponent
              text="Giải pháp"
              size={18}
              font={fontFamilies.roboto_medium}
              color={appColor.text}
            />
            <SpaceComponent height={8} />
            <RowComponent
              justify="space-between"
              styles={{ alignItems: "center" }}
            >
              <TextComponent
                text="Thay mới đèn pha"
                size={14}
                styles={{ marginLeft: 8 }}
              />
              <TextComponent
                text="500.000 VND"
                size={14}
                styles={{ marginLeft: 8 }}
              />
            </RowComponent>
          </View>
        </SectionComponent>
      </SectionComponent>
      <SectionComponent>
        <RowComponent>
          <TextComponent
            text="Tiền công dịch vụ: "
            size={18}
            font={fontFamilies.roboto_medium}
            color={appColor.primary}
          />
          <TextComponent
            text="30.000"
            size={18}
            font={fontFamilies.roboto_medium}
            color={appColor.primary}
            styles={{ textAlign: "right", flex: 1 }}
          />
        </RowComponent>
        <SpaceComponent height={8} />
        <RowComponent>
          <TextComponent
            text="Tổng tiền phụ tùng và dịch vụ : "
            size={18}
            font={fontFamilies.roboto_medium}
            color={appColor.primary}
          />
          <TextComponent
            text="488.000"
            size={18}
            font={fontFamilies.roboto_medium}
            color={appColor.primary}
            styles={{ textAlign: "right", flex: 1 }}
          />
        </RowComponent>
        <SpaceComponent height={8} />
        <RowComponent>
          <TextComponent
            text="VAT : "
            size={18}
            font={fontFamilies.roboto_medium}
            color={appColor.primary}
          />
          <TextComponent
            text="8%"
            size={18}
            font={fontFamilies.roboto_medium}
            color={appColor.primary}
            styles={{ textAlign: "right", flex: 1 }}
          />
        </RowComponent>
        <SpaceComponent height={8} />
        <DividerWithLabelComponent />
        <SpaceComponent height={8} />
        <RowComponent>
          <TextComponent
            text="Tổng tiền : "
            size={18}
            font={fontFamilies.roboto_medium}
            color={appColor.primary}
          />
          <TextComponent
            text="560.000"
            size={18}
            font={fontFamilies.roboto_medium}
            color={appColor.primary}
            styles={{ textAlign: "right", flex: 1 }}
          />
        </RowComponent>
      </SectionComponent>
    </BackgroundComponent>
  );
};

export default PaymentInvoice;
