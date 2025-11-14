import axiosClient from "./axiosClient";
import { appInfor } from "../constants/appInfor";

export const vehicles = async (params: any): Promise<any> => {
  const url = `${appInfor.BASE_URL}/vehicles`;
  const res = await axiosClient.get(url, { params });
  return res.data;
};

export const vehicle = async (id: string): Promise<any> => {
  const url = `${appInfor.BASE_URL}/vehicles/${id}`;
  const res = await axiosClient.get(url);
  return res.data;
};

export const vehicleStage = async (id: string): Promise<any> => {
  const url = `${appInfor.BASE_URL}/vehicle-stages/${id}`;
  const res = await axiosClient.get(url);
  return res.data;
};
