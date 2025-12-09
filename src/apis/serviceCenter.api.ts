import apiClient from "../apis/custom.api";

export const serviceCenter = async (params: any) => {
  const res = await apiClient.get("/service-centers", { params });
  return res.data;
};

export const slotTime = async (serviceCenterId: string) => {
  const res = await apiClient.get("/service-centerslots", {
    params: { serviceCenterId },
  });
  return res.data;
};
