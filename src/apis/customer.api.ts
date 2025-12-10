import apiClient from "../apis/custom.api";

export const getCustomerByAccount = async (accountId: string) => {
  const res = await apiClient.get(`/customers/account/${accountId}`);
  return res.data;
};

export const getCustomerById = async (customerId: string) => {
  const res = await apiClient.get(`/customers/${customerId}`);
  return res.data;
};

export const newVehicle = async (model: any) => {
  const res = await apiClient.post(`/customers/sync-data`, model);
  return res.data;
};
