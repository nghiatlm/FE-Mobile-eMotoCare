import apiClient from "../apis/custom.api";

export const maintenanceStage = async (id: string) => {
  const res = await apiClient.get(`/maintenance-stages/${id}`);
  return res.data;
};
