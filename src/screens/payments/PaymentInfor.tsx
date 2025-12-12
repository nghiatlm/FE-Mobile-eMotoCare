import * as Linking from "expo-linking";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { ButtonComponent } from "../../components";
import { createPayment } from "../../services/payment.service";
import { appColor } from "../../constants/appColor";

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
      {status === "success" && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 24, color: "green", marginBottom: 20 }}>
            ✅ Thanh toán thành công
          </Text>
          <ButtonComponent
            text="Quay lại trang chủ"
            type="primary"
            onPress={handleBackHome}
          />
        </View>
      )}
      {status === "cancel" && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 24, color: "orange", marginBottom: 20 }}>
            ❌ Bạn đã huỷ thanh toán
          </Text>
          <ButtonComponent
            text="Thử lại"
            type="primary"
            onPress={handleRetry}
          />
        </View>
      )}
      {status === "failed" && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 24, color: "red", marginBottom: 20 }}>
            ⚠️ Tạo giao dịch thất bại
          </Text>
          <ButtonComponent
            text="Thử lại"
            type="primary"
            onPress={handleRetry}
          />
        </View>
      )}
    </View>
  );
};

export default PaymentInfor;
