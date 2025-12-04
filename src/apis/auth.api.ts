import apiClient from "../apis/custom.api";

export const registerApi = async (model: any) => {
  const res = await apiClient.post("/auths/register", model);
  return res.data;
};
