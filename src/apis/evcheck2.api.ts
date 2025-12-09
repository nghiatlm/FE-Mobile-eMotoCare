import { appInfor } from "../constants/appInfor";
import axiosClient from "./axiosClient";

class EVCheckAPI {
  HandleEVCheck = async (
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

const evCheckAPI = new EVCheckAPI();
export default evCheckAPI;
