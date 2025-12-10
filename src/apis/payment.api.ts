import apiClient from "../apis/custom.api";

export const createPaymentApi = async (model: any) => {
  const res = await apiClient.post("/checkout/create-payment-link", model);
  return res.data;
};
