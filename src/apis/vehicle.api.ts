import apiClient from "../apis/custom.api";

export const vehicles = async (params: any) => {
  const res = await apiClient.get("/vehicles", { params });
  return res.data;
};

export const vehicle = async (id: string) => {
  const res = await apiClient.get(`/vehicles/${id}`);
  return res.data;
};
