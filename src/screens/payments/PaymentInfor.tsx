import * as Linking from "expo-linking";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { ButtonComponent } from "../../components";
import { appColor } from "../../constants/appColor";
import { fontFamilies } from "../../constants/fontFamilies";

type PaymentStatus = "idle" | "success" | "cancel" | "failed";

const PaymentInfor = ({ route, navigation }: any) => {
  const [paymentUrl, setPaymentUrl] = useState<string | null>(
    route.params?.paymentUrl || null
  );
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<PaymentStatus>("idle");

  useEffect(() => {
    const sub = Linking.addEventListener("url", (event) => {
      const url = event.url;

      if (url.includes("success")) {
        setStatus("success");
        setPaymentUrl(null); 
      }

      if (url.includes("cancel")) {
        setStatus("cancel");
        setPaymentUrl(null);
      }
    });

    return () => sub.remove();
  }, []);

  const handleRetry = () => {
    setStatus("idle");
    setPaymentUrl(route.params?.paymentUrl || null);
  };

  const handleBackHome = () => {
    navigation.navigate("Home");
  };

  const renderResult = () => {
    if (status === "idle") return null;

    const isSuccess = status === "success";
    const isCancel = status === "cancel";
    const isFailed = status === "failed";

    const title = isSuccess
      ? "Thanh toán thành công"
      : isCancel
      ? "Bạn đã huỷ thanh toán"
      : "Tạo giao dịch thất bại";

    const message = isSuccess
      ? "Cảm ơn bạn đã hoàn tất thanh toán. Đơn hàng của bạn đang được xử lý."
      : isCancel
      ? "Giao dịch đã bị huỷ theo yêu cầu của bạn. Bạn có thể thử lại nếu cần."
      : "Có lỗi xảy ra trong quá trình tạo giao dịch. Vui lòng thử lại sau.";

    const color = isSuccess
      ? appColor.primary
      : isCancel
      ? appColor.warning
      : appColor.danger;

    return (
      <View style={styles.resultWrapper}>
        <Image
          source={require("../../assets/images/check-success.png")}
          style={styles.illustration}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color }]}>{title}</Text>
        <Text style={styles.subtitle}>{message}</Text>

        {isSuccess ? (
          <View style={{ width: "100%", gap: 12 }}>
            <ButtonComponent text="Về trang chủ" type="primary" onPress={handleBackHome} />
            <ButtonComponent text="Xem chi tiết" type="secondary" onPress={() => navigation.goBack()} />
          </View>
        ) : (
          <View style={{ width: "100%", gap: 12 }}>
            <ButtonComponent text="Thử lại" type="primary" onPress={handleRetry} />
            <ButtonComponent text="Về trang chủ" type="secondary" onPress={handleBackHome} />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: appColor.white }}>
      {loading && (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={appColor.primary} />
          <Text style={{ marginTop: 10, color: appColor.text }}>
            Đang xử lý...
          </Text>
        </View>
      )}
      {paymentUrl && (
        <WebView source={{ uri: paymentUrl }} style={{ flex: 1 }} />
      )}
      {!paymentUrl && renderResult()}
    </View>
  );
};

export default PaymentInfor;

const styles = StyleSheet.create({
  resultWrapper: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  illustration: {
    width: 220,
    height: 180,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: fontFamilies.roboto_bold,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fontFamilies.roboto_regular,
    color: appColor.gray2,
    textAlign: "center",
    marginBottom: 8,
  },
});
