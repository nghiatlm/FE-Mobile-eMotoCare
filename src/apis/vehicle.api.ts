import axiosClient from "./axiosClient";
import { appInfor } from "../constants/appInfor";

export const vehicles = async (params: any): Promise<any> => {
  const url = `${appInfor.BASE_URL}/vehicles`;
  const res = await axiosClient.get(url, { params });
  return res.data;
};
