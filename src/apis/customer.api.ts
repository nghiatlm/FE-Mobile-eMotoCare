import axiosClient from "./axiosClient";
import { appInfor } from "../constants/appInfor";

export const GetByAccount = async (id: string): Promise<any> => {
  const url = `${appInfor.BASE_URL}/customers/account/${id}`;
  const res = await axiosClient.get(url);
  return res.data;
};
