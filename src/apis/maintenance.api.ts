import axiosClient from "./axiosClient";
import { appInfor } from "../constants/appInfor";

export const maintenances = async (params: any): Promise<any> => {
  const url = `${appInfor.BASE_URL}/vehicle-stages`;
  const res = await axiosClient.get(url, { params });
  // console.log("Vechicle Stages api:", res.data);
  return res.data;
};
