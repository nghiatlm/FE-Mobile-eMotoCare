import { getCustomerByAccount, newVehicle } from "../apis/customer.api";

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

export const syncNewVehicle = async (model: any) => {
  try {
    const res = await newVehicle(model);
    if (res.success) {
      return { success: true, data: res.data };
    } else {
      return {
        success: false,
        message: res.message || "Đồng bộ xe mới thất bại",
      };
    }
  } catch (error) {
    return { success: false, message: "Đồng bộ xe mới thất bại" };
  }
};
