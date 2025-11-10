import paymentAPI from "../apis/paymet.api";

export const createPayment = async (values: any) => {
  try {
    const res = await paymentAPI.HandlePayment(
      "checkout/create-payment-link",
      values,
      "post"
    );
    console.log("Payment API response:", res);
    if (res.data.success) {
      return { success: true, data: res.data.data };
    } else {
      return { success: false, message: res.data.message || "Tạo thất bại" };
    }
  } catch (error: any) {
    const apiMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data ||
      error?.message;
    return {
      success: false,
      message: apiMessage ?? "Tạo thất bại. Vui lòng thử lại.",
    };
  }
};