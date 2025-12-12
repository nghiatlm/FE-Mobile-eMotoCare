import apiClient from "../apis/custom.api";

export const vechicleStages = async (params: any) => {
  const res = await apiClient.get("/vehicle-stages", {params});
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
