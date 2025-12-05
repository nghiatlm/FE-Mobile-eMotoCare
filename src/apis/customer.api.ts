import apiClient from "../apis/custom.api";

export const getCustomerByAccount = async (accountId: string) => {
  console.log("API call: getCustomerByAccount with accountId:", accountId);
  const res = await apiClient.get(`/customers/account/${accountId}`);
  return res.data;
};
