import apiClient from "../apis/custom.api";

export const serviceCenter = async (params: any) => {
  const res = await apiClient.get("/service-centers", params);
  return res.data;
};
