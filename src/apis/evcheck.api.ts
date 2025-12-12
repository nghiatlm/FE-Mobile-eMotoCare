import axiosClient from "./axiosClient";
import { appInfor } from "../constants/appInfor";
import apiClient from "../apis/custom.api";

export const evcheckId = async (id: string): Promise<any> => {
  const url = `${appInfor.BASE_URL}/evchecks/${id}`;
  const res = await axiosClient.get(url);
  console.log("Evcheck api:", res.data);
  return res.data;
};

export const evcheckDetail = async (id: string) => {
  const res = await apiClient.get(`/ev-check-details/${id}`);
  return res.data;
};

// export const
