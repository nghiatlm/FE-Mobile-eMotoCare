import { appInfor } from "../constants/appInfor";
import axiosClient from "./axiosClient";

class PaymentAPI {
  HandlePayment = async (
    url: string,
    data?: any,
    method?: "get" | "post" | "put" | "delete",
    params?: Record<string, any>
  ) => {
    return await axiosClient(`${appInfor.BASE_URL}/${url}`, {
      method: method || "get",
      data,
      params: params || undefined,
    });
  };
}

const paymentAPI = new PaymentAPI();
export default paymentAPI;
