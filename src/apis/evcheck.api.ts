import axiosClient from "./axiosClient";
import { appInfor } from "../constants/appInfor";

export const evcheckId = async (id: string): Promise<any> => {
  const url = `${appInfor.BASE_URL}/evchecks/${id}`;
  const res = await axiosClient.get(url);
  console.log("Evcheck api:", res.data);
  return res.data;
};
