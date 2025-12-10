import { createPaymentApi } from "../apis/payment.api";

export const createPayment = async (model: any) => {
  try {
    const res = await createPaymentApi(model);
    if (res.success) {
      return { success: true, data: res.data };
    } else {
      return {
        success: false,
        message: res.message || "Payment creation failed",
      };
    }
  } catch (error) {
    return { success: false, message: "Payment creation failed" };
  }
};
