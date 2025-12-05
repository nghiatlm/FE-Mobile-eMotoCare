import { getCustomerByAccount } from "../apis/customer.api";

export const getByAccount = async (accountId: string) => {
  try {
    const res = await getCustomerByAccount(accountId);
    if (res.success) {
      return { success: true, data: res.data };
    } else {
      return {
        success: false,
        message: res.message || "Lấy thông tin khách hàng thất bại",
      };
    }
  } catch (error) {
    return { success: false, message: "Lấy thông tin khách hàng thất bại" };
  }
};
