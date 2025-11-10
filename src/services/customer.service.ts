import { GetByAccount } from "../apis/customer.api";
import customerAPI from "../apis/customer2.api";

export const getCustomerByAccount = async (id: string) => {
  if (!id || String(id).trim() === "") {
    return {
      success: false,
      message: "Id tài khoản không hợp lệ. Vui lòng cung cấp id hợp lệ.",
    };
  }

  try {
    const data = await GetByAccount(String(id).trim());
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("Get customer by account failed:", {
      message: error?.message,
      responseData: error?.response?.data,
      status: error?.rFesponse?.status,
    });

    const message =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "Lấy thông tin khách hàng thất bại. Vui lòng thử lại.";
    return { success: false, message };
  }
};

export const getCusDetail = async (id: string) => {
  try {
    const res = await customerAPI.HandleCustomer(`customers/${id}`, null, "get");
    if (res.data.success) {
      return { success: true, data: res.data.data };
    } else {
      return {
        success: false,
        message: res.data.message || "Lấy thông tin thành công.",
      };
    }
  } catch (error: any) {
    const apiMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data ||
      error?.message;
    console.error("Get Failed:", apiMessage ?? error);
    return {
      success: false,
      message:
        apiMessage ?? "Lấy thông tin thất bại thất bại. Vui lòng thử lại.",
    };
  }
};
