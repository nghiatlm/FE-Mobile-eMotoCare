import apiClient from "../apis/custom.api";

export const getCustomerByAccount = async (accountId: string) => {
  console.log("API call: getCustomerByAccount with accountId:", accountId);
  const res = await apiClient.get(`/customers/account/${accountId}`);
  return res.data;
};

export const getCustomerById = async (customerId: string) => {
  console.log("API call: getCustomerById with customerId:", customerId);
  const res = await apiClient.get(`/customers/${customerId}`);
  return res.data;
};