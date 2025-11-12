import React, { useEffect, useMemo, useState } from "react";
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
import { getAppointmentDetail } from "../../services/appointment.service";
import { getEvcheckDetail } from "../../services/evcheck.service";
import { getVehicleStage } from "../../services/vehicle.service";
import { globalStyle } from "../../styles/globalStyle";
import { createPayment } from "../../services/payment.service";
import packageJson from "../../../package.json";

interface Props {
  navigation?: any;
  route?: any;
}

const formatCurrency = (v: number) => {
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(v);
  } catch {
    return `${v?.toLocaleString?.() ?? v} VND`;
  }
};

const formatDateTime = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};

const formatDateOnly = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const PaymentInvoice = ({ navigation, route }: Props) => {
  // fix: route params may be whole object, not appointmentId directly
  const params = route?.params || {};
  const id = params.appointmentId;
  const invoiceId =
    params.invoiceId || `INV-${Date.now().toString().slice(-6)}`;
  const items = params.items || [
    { id: "i1", name: "Thay đèn pha", price: 500000 },
    { id: "i2", name: "Công kiểm tra", price: 50000 },
  ];
  const amount =
    params.amount ??
    items.reduce((s: number, it: any) => s + (it.price ?? 0), 0);

  const [appointment, setAppointment] = React.useState<any>(null);
  const [evcheck, setEvcheck] = React.useState<any>(null);
  const [modelName, setModelName] = React.useState<string>("");
  const [payLoading, setPayLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<any>(null);
  const phoneNumber =
    appointment?.customer?.phone ?? appointment?.customer?.phoneNumber ?? "";

  useEffect(() => {
    if (id) fetchAppointmentDetail(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // handle case when PaymentGateway returns via navigation params
  useEffect(() => {
    const status = route?.params?.paymentStatus;
    const tx = route?.params?.transactionId;
    if (status) {
      setPaymentStatus({ status, transactionId: tx ?? null });
      // refresh appointment/evcheck
      if (id) fetchAppointmentDetail(id);
      // clear params to avoid duplicate
      try {
        navigation?.setParams?.({
          paymentStatus: undefined,
          transactionId: undefined,
        });
      } catch {
        // ignore if not available
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.paymentStatus]);

  const summary = useMemo(
    () => ({ invoiceId, items, amount }),
    [invoiceId, items, amount]
  );

  const fetchAppointmentDetail = async (appointmentId: string) => {
    const result = await getAppointmentDetail(appointmentId);
    if (result.success) {
      console.log("Appointment detail:", result.data);
      setAppointment(result.data);
      if (result.data?.evCheckId) {
        await fetchEvCheckDetail(result.data.evCheckId);
      }
      if (result.data?.vehicleStageId) {
        await fetchVehicleStageDetail(result.data.vehicleStageId);
      }
      return result.data;
    }
    return null;
  };

  const fetchEvCheckDetail = async (evcheckId: string) => {
    const result = await getEvcheckDetail(evcheckId);
    if (result.success) {
      console.log("Evcheck detail:", result.data);
      setEvcheck(result.data);
      return result.data;
    }
    return null;
  };

  const fetchVehicleStageDetail = async (id: string) => {
    const result = await getVehicleStage(id);
    if (result.success) {
      console.log("Stage detail:", result.data);
      setModelName(result.data?.vehicle?.modelName ?? "");
      return result.data;
    }
    return null;
  };

  const handlePayment = async () => {
    if (payLoading) return;
    setPayLoading(true);
    try {
      const evPartsTotal =
        evcheck?.evCheckDetails?.reduce(
          (s: number, it: any) =>
            s + (it?.totalAmount ?? (it?.pricePart ?? 0) * (it?.quantity ?? 0)),
          0
        ) || 0;

      // read return/deepLink from package.json (fallbacks)
      const paymentConfig = packageJson?.paymentConfig;
      const webReturnUrl = paymentConfig.returnUrl ?? "myapp://success";
      const deepLink = paymentConfig.deepLink ?? "myapp://cancel";

      const normalizedAmount = Math.round(Number(evPartsTotal) || 0);

      const payload: any = {
        appointmentId: id,
        amount: normalizedAmount,
        currency: "VND",
        paymentMethod: "PAY_OS_APP",
        // ask backend to use this return url (gateway redirect)
        returnUrl: "myapp://success",
        // optional deep link if gateway supports app-scheme redirect
        callbackUrl: "myapp://cancel",
      };

      console.log("Creating payment with payload:", payload);
      const result = await createPayment(payload);
      console.log("Create payment result:", result);

      if (result.success && result.data) {
        // backend should return checkoutUrl/paymentUrl
        const checkoutUrl =
          result.data.paymentUrl || result.data.checkoutUrl || result.data.url;
        if (checkoutUrl) {
          // pass callback so PaymentGateway can update this screen in-place
          navigation.navigate("PaymentGateway", {
            checkoutUrl,
            returnUrl: webReturnUrl,
            deepLink,
            appointmentId: id,
            invoiceId,
            onPaymentSuccess: (res: any) => {
              console.log("onPaymentSuccess:", res);
              setPaymentStatus(res);
              // refresh data on this screen
              if (id) fetchAppointmentDetail(id);
            },
          });
          return;
        }
        console.log(
          "Payment created but no checkout url returned:",
          result.data
        );
      } else {
        console.error("Payment creation failed:", result.message ?? result);
      }
    } catch (e) {
      console.error("handlePayment error:", e);
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <BackgroundComponent
      back
      title="Thông tin thanh toán"
      isScroll
      footer={(() => {
        const evPartsTotal =
          evcheck?.evCheckDetails?.reduce(
            (s: number, it: any) =>
              s +
              (it?.totalAmount ?? (it?.pricePart ?? 0) * (it?.quantity ?? 0)),
            0
          ) || 0;
        const serviceCharge = evcheck?.serviceCharge ?? 0;
        const totalToPay = evcheck ? evPartsTotal + serviceCharge : amount;
        return (
          <View
            style={{
              padding: 12,
              backgroundColor: appColor.white,
              borderTopWidth: 1,
              borderColor: "#EEE",
            }}
          >
            <RowComponent styles={{ width: "100%", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <TextComponent
                  text="Tổng thanh toán"
                  size={13}
                  color={appColor.gray2}
                  font={fontFamilies.roboto_regular}
                />
                <TextComponent
                  text={formatCurrency(totalToPay)}
                  size={18}
                  font={fontFamilies.roboto_bold}
                  color={appColor.primary}
                  styles={{ marginTop: 6 }}
                />
              </View>

              <View style={{ width: 160 }}>
                <ButtonComponent
                  text={payLoading ? "Đang tạo..." : "Thanh toán"}
                  onPress={handlePayment}
                  disabled={payLoading}
                  styles={{
                    width: "100%",
                    backgroundColor: appColor.primary,
                    borderColor: appColor.primary,
                    paddingVertical: 12,
                    borderRadius: 10,
                    opacity: payLoading ? 0.8 : 1,
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
        );
      })()}
    >
      <SpaceComponent height={12} />

      {/* show small payment status banner if any */}
      {paymentStatus && (
        <SectionComponent
          styles={[
            { paddingHorizontal: 12, marginHorizontal: 12, marginBottom: 12 },
          ]}
        >
          <TextComponent
            text={`Kết quả thanh toán: ${
              paymentStatus.status ?? paymentStatus?.result ?? "unknown"
            }`}
            size={14}
            color={
              paymentStatus.status === "success"
                ? appColor.primary
                : appColor.gray2
            }
            font={fontFamilies.roboto_medium}
          />
          {paymentStatus.transactionId && (
            <TextComponent
              text={`Mã giao dịch: ${paymentStatus.transactionId}`}
              size={13}
              styles={{ marginTop: 6 }}
            />
          )}
        </SectionComponent>
      )}

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
            text={`${appointment?.customer?.firstName ?? ""} ${
              appointment?.customer?.lastName ?? ""
            }`.trim()}
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
          <TouchableOpacity
            onPress={() => phoneNumber && Linking.openURL(`tel:${phoneNumber}`)}
          >
            <TextComponent
              text={phoneNumber || "Chưa có"}
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
            text={modelName || ""}
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
            text={formatDateOnly(appointment?.appointmentDate)}
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
        {evcheck?.evCheckDetails && evcheck.evCheckDetails.length > 0 ? (
          evcheck.evCheckDetails.map((d: any, idx: number) => {
            const part = d.replacePart ?? d.partItem;
            const name =
              part?.serialNumber || part?.part || `Linh kiện ${idx + 1}`;
            const qty = d?.quantity ?? 0;
            const pricePart = d?.pricePart ?? 0;
            const total = d?.totalAmount ?? pricePart * qty;

            return (
              <SectionComponent
                key={d.id ?? idx}
                styles={[
                  {
                    flexDirection: "row",
                    backgroundColor: appColor.white,
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: appColor.gray,
                    width: "100%",
                    marginBottom: 10,
                    alignItems: "center",
                  },
                ]}
              >
                <Image
                  source={require("../../assets/images/parts/dong-ho.png")}
                  style={{ width: 84, height: 84, resizeMode: "contain" }}
                />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <TextComponent
                    text={name}
                    size={16}
                    font={fontFamilies.roboto_medium}
                  />
                  <SpaceComponent height={6} />
                  <RowComponent
                    justify="space-between"
                    styles={{ alignItems: "center" }}
                  >
                    <View>
                      <TextComponent
                        text={`Tình trạng: ${d?.result ?? "Chưa có"}`}
                        size={13}
                      />
                      <TextComponent
                        text={`Giải pháp: ${d?.remedies ?? "NONE"}`}
                        size={13}
                        styles={{ marginTop: 4 }}
                      />
                      <TextComponent
                        text={`Số lượng: ${qty} ${d?.unit ?? ""}`}
                        size={13}
                        styles={{ marginTop: 4 }}
                      />
                    </View>

                    <View style={{ alignItems: "flex-end" }}>
                      <TextComponent
                        text={`${
                          (pricePart || 0).toLocaleString?.() ?? pricePart
                        } VND`}
                        size={14}
                      />
                      <TextComponent
                        text={`${(total || 0).toLocaleString?.() ?? total} VND`}
                        size={14}
                        font={fontFamilies.roboto_bold}
                        color={appColor.primary}
                        styles={{ marginTop: 6 }}
                      />
                    </View>
                  </RowComponent>
                </View>
              </SectionComponent>
            );
          })
        ) : (
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
            <TextComponent
              text="Chưa có nội dung thực hiện."
              size={14}
              color={appColor.gray2}
            />
          </SectionComponent>
        )}

        {evcheck?.evCheckDetails && evcheck.evCheckDetails.length > 0 && (
          <>
            <SpaceComponent height={12} />
            <SectionComponent styles={[{ paddingHorizontal: 6 }]}>
              <RowComponent
                justify="space-between"
                styles={{ marginBottom: 6 }}
              >
                <TextComponent
                  text="Tổng tiền phụ tùng"
                  font={fontFamilies.roboto_medium}
                />
                <TextComponent
                  text={`${
                    evcheck.evCheckDetails
                      .reduce(
                        (s: number, it: any) =>
                          s +
                          (it?.totalAmount ??
                            (it?.pricePart ?? 0) * (it?.quantity ?? 0)),
                        0
                      )
                      .toLocaleString?.() ?? 0
                  } VND`}
                  font={fontFamilies.roboto_bold}
                  color={appColor.primary}
                />
              </RowComponent>

              <RowComponent
                justify="space-between"
                styles={{ marginBottom: 6 }}
              >
                <TextComponent
                  text="Tiền công dịch vụ"
                  font={fontFamilies.roboto_medium}
                />
                <TextComponent
                  text={`${
                    evcheck?.serviceCharge?.toLocaleString?.() ?? "0"
                  } VND`}
                  color={appColor.primary}
                />
              </RowComponent>

              <DividerWithLabelComponent />

              <RowComponent justify="space-between" styles={{ marginTop: 8 }}>
                <TextComponent
                  text="Tổng thanh toán"
                  font={fontFamilies.roboto_medium}
                />
                <TextComponent
                  text={`${
                    (
                      (evcheck.evCheckDetails.reduce(
                        (s: number, it: any) =>
                          s +
                          (it?.totalAmount ??
                            (it?.pricePart ?? 0) * (it?.quantity ?? 0)),
                        0
                      ) || 0) + (evcheck?.serviceCharge ?? 0)
                    ).toLocaleString?.() ?? 0
                  } VND`}
                  font={fontFamilies.roboto_bold}
                  color={appColor.primary}
                />
              </RowComponent>
            </SectionComponent>
          </>
        )}
      </SectionComponent>

      <SpaceComponent height={100} />
    </BackgroundComponent>
  );
};

export default PaymentInvoice;
