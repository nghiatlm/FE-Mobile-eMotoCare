import { appInfor } from "../constants/appInfor";
import axiosClient from "./axiosClient";

class ServiceCenterAPI {
  HandleServiceCenter = async (
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

export const ServiceCenterSlots = async (
  serviceCenterId: string
): Promise<any> => {
  const url = `${appInfor.BASE_URL}/service-centerslots`;
  const res = await axiosClient.get(url, { params: { serviceCenterId } });
  return res.data;
};

const serviceCenterAPI = new ServiceCenterAPI();
export default serviceCenterAPI;
