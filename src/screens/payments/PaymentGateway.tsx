import packageJson from "../../../package.json";
import { ButtonComponent } from "../../components";
import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { BackgroundComponent, TextComponent } from "../../components";
import { appColor } from "../../constants/appColor";
import WebView from "react-native-webview";

const PaymentGateway = ({ navigation, route }: any) => {
  const checkoutUrl = route?.params?.checkoutUrl;
  const returnUrl = route?.params?.returnUrl;
  const deepLink = route?.params?.deepLink;
  // const appointmentId = route?.params?.appointmentId;
  // const invoiceId = route?.params?.invoiceId;

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      if (url.includes("myapp://success")) {
        Alert.alert("Thanh toán thành công!");
        // setCheckoutUrl(null);
      }
      if (url.includes("myapp://cancel")) {
        Alert.alert("Thanh toán bị hủy!");
        // setCheckoutUrl(null);
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ uri: checkoutUrl }} />
    </View>
  );
};

// // read defaults from package.json if not passed
// const paymentConfig = packageJson?.paymentConfig;
// const defaultReturnUrl =
//   paymentConfig.returnUrl ?? "https://app.local/payment-callback";
// const defaultDeepLink = paymentConfig.deepLink ?? "myapp://payment-callback";

// const returnUrl = route?.params?.returnUrl ?? defaultReturnUrl;
// const deepLink = route?.params?.deepLink ?? defaultDeepLink;

//   const [loading, setLoading] = useState(true);
//   const [processingCallback, setProcessingCallback] = useState(false);
//   const [paymentResult, setPaymentResult] = useState<any>(null);
//   const [showWebView, setShowWebView] = useState(true);

//   const handleCallbackUrl = useCallback(
//     async (url: string) => {
//       if (processingCallback) return;
//       setProcessingCallback(true);
//       try {
//         const resp = await fetch(url, { method: "GET" });
//         const contentType = resp.headers.get("content-type") || "";

//         if (contentType.includes("application/json")) {
//           const json = await resp.json();
//           const status =
//             json?.status ||
//             json?.paymentStatus ||
//             json?.result ||
//             (json?.success ? "success" : "unknown");
//           const transactionId =
//             json?.transactionId || json?.transaction_id || null;
//           setPaymentResult({ status, transactionId, raw: json });
//           setShowWebView(false);
//           return;
//         }

//         try {
//           const parsed = new URL(url);
//           const status =
//             parsed.searchParams.get("status") ||
//             parsed.searchParams.get("paymentStatus") ||
//             parsed.searchParams.get("result");
//           const transactionId =
//             parsed.searchParams.get("transactionId") ||
//             parsed.searchParams.get("transaction_id") ||
//             parsed.searchParams.get("txn");
//           if (status) {
//             setPaymentResult({ status, transactionId, raw: url });
//             setShowWebView(false);
//             return;
//           }
//         } catch {
//           // ignore
//         }

//         const text = await resp.text();
//         if (
//           /success|completed|paid/i.test(text) ||
//           /success|completed|paid/i.test(url)
//         ) {
//           setPaymentResult({ status: "success", raw: text });
//           setShowWebView(false);
//           return;
//         }

//         setPaymentResult({ status: "unknown", raw: { url, contentType } });
//         setShowWebView(false);
//       } catch (e) {
//         try {
//           const parsed = new URL(url);
//           const status =
//             parsed.searchParams.get("status") ||
//             parsed.searchParams.get("paymentStatus") ||
//             parsed.searchParams.get("result");
//           const transactionId =
//             parsed.searchParams.get("transactionId") ||
//             parsed.searchParams.get("transaction_id") ||
//             parsed.searchParams.get("txn");
//           setPaymentResult({
//             status: status ?? "unknown",
//             transactionId: transactionId ?? undefined,
//             raw: url,
//           });
//           setShowWebView(false);
//         } catch {
//           setPaymentResult({ status: "unknown", raw: url });
//           setShowWebView(false);
//         }
//       } finally {
//         setProcessingCallback(false);
//       }
//     },
//     [processingCallback]
//   );

//   const onNavStateChange = useCallback(
//     (navState: any) => {
//       const url: string = navState?.url || "";
//       if (!url) return;
//       const lower = url.toLowerCase();

//       // if gateway redirects to configured return url or deepLink, handle it in-page
//       if (
//         (returnUrl && url.startsWith(returnUrl)) ||
//         (deepLink && url.startsWith(deepLink))
//       ) {
//         handleCallbackUrl(url);
//         return;
//       }

//       // fallback keyword detection
//       if (
//         /(success|completed|paid)/.test(lower) ||
//         /status=(success|completed|paid)/.test(lower)
//       ) {
//         handleCallbackUrl(url);
//       }
//     },
//     [handleCallbackUrl, returnUrl, deepLink]
//   );

//   return (
//     <BackgroundComponent back title="Thanh toán">
//       {!checkoutUrl && <TextComponent text="Không có đường link thanh toán" />}

//       {checkoutUrl && showWebView && (
//         <View style={{ flex: 1 }}>
//           <WebView
//             source={{ uri: checkoutUrl }}
//             onLoadStart={() => setLoading(true)}
//             onLoadEnd={() => setLoading(false)}
//             onNavigationStateChange={onNavStateChange}
//             startInLoadingState
//             style={{ flex: 1 }}
//           />
//           {(loading || processingCallback) && (
//             <View style={styles.loading}>
//               <ActivityIndicator size="large" color={appColor.primary} />
//             </View>
//           )}
//         </View>
//       )}

//       {paymentResult && (
//         <View style={{ padding: 16 }}>
//           <TextComponent
//             text="Kết quả thanh toán"
//             size={18}
//             color={appColor.text}
//           />
//           <View style={{ height: 8 }} />
//           <TextComponent
//             text={`Trạng thái: ${paymentResult.status}`}
//             size={16}
//             color={
//               paymentResult.status === "success"
//                 ? appColor.primary
//                 : appColor.gray2
//             }
//           />
//           {paymentResult.transactionId && (
//             <TextComponent
//               text={`Mã giao dịch: ${paymentResult.transactionId}`}
//               size={14}
//             />
//           )}
//           <View style={{ height: 12 }} />
//           <View style={{ flexDirection: "row" }}>
//             <View style={{ flex: 1, marginRight: 8 }}>
//               <ButtonComponent
//                 text="Hoàn tất"
//                 onPress={() => {
//                   const onSuccess = route?.params?.onPaymentSuccess;
//                   if (typeof onSuccess === "function") onSuccess(paymentResult);
//                   navigation?.goBack();
//                 }}
//                 styles={{
//                   backgroundColor: appColor.primary,
//                   borderRadius: 8,
//                   paddingVertical: 12,
//                 }}
//                 textStyle={{ color: "#fff" }}
//               />
//             </View>
//             <View style={{ flex: 1 }}>
//               <ButtonComponent
//                 text="Mở lại"
//                 onPress={() => {
//                   setPaymentResult(null);
//                   setShowWebView(true);
//                 }}
//                 styles={{
//                   backgroundColor: "#EEE",
//                   borderRadius: 8,
//                   paddingVertical: 12,
//                 }}
//                 textStyle={{ color: appColor.text }}
//               />
//             </View>
//           </View>
//         </View>
//       )}
//     </BackgroundComponent>
//   );
// };

export default PaymentGateway;

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 80,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
});
