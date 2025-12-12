import apiClient from "../apis/custom.api";

export const batteries = async (params: any) => {
  const res = await apiClient.get("/battery-checks", { params });
  return res.data;
};

export const batteryDetail = async (id: string) => {
  const res = await apiClient.get(`/battery-checks/${id}`);
  return res.data;
};
