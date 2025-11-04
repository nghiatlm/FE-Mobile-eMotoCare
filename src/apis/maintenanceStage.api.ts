import axiosClient from "./axiosClient";
import { appInfor } from "../constants/appInfor";

export const maintenanceStage = async (id: string): Promise<any> => {
  const url = `${appInfor.BASE_URL}/maintenance-stages/${id}`;
  const res = await axiosClient.get(url);
  return res.data;
};
