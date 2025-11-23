import { appInfor } from "../constants/appInfor";
import axiosClient from "./axiosClient";

class RMAAPI {
  HandleRMA = async (
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

const rmaAPI = new RMAAPI();
export default rmaAPI;
