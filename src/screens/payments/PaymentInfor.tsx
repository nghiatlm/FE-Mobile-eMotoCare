import * as Linking from "expo-linking";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { ButtonComponent } from "../../components";
import { createPayment } from "../../services/payment.service";

type PaymentStatus = "idle" | "success" | "cancel" | "failed";

const PaymentInfor = () => {
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
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

  const handelPayment = async () => {
    setLoading(true);
    setStatus("idle");

    const model = {
      amount: 1000,
      paymentMethod: "PAY_OS_APP",
      currency: "VND",
      appointmentId: "789cbad4-1444-4813-8616-acad0d3ff423",
      returnUrl: "emotocare://success",
      callbackUrl: "emotocare://cancel",
    };

    const response = await createPayment(model);

    setLoading(false);

    if (response.success) {
      setPaymentUrl(response.data.checkoutUrl);
    } else {
      setStatus("failed");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {status === "idle" && !paymentUrl && !loading && (
        <ButtonComponent text="Thanh toán PayOS" onPress={handelPayment} />
      )}
      {loading && <ActivityIndicator size="large" />}
      {paymentUrl && (
        <WebView source={{ uri: paymentUrl }} style={{ flex: 1 }} />
      )}
      {status === "success" && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 20, color: "green" }}>
            ✅ Thanh toán thành công
          </Text>
        </View>
      )}
      {status === "cancel" && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 20, color: "orange" }}>
            ❌ Bạn đã huỷ thanh toán
          </Text>
        </View>
      )}
      {status === "failed" && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 20, color: "red" }}>
            ⚠️ Tạo giao dịch thất bại
          </Text>
        </View>
      )}
    </View>
  );
};

export default PaymentInfor;
