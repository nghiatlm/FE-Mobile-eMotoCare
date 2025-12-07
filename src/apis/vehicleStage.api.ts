import apiClient from "../apis/custom.api";

export const vechicleStages = async (model: any) => {
  const res = await apiClient.get("/vehicle-stages", model);
  return res.data;
};

export const vehicleStageDetail = async (id: string) => {
  const res = await apiClient.get(`/vehicle-stages/${id}`);
  return res.data;
};

// export const loginApi = async (model: any) => {
//   const res = await apiClient.post("/auths/login", model);
//   return res.data;
// };
