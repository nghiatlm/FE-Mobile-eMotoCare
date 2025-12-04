import apiClient from "../apis/custom.api";

export const registerApi = async (model: any) => {
  const res = await apiClient.post("/auths/register", model);
  return res.data;
};

export const loginApi = async (model: any) => {
  const res = await apiClient.post("/auths/login", model);
  return res.data;
};
