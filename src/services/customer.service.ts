import { GetByAccount } from "../apis/customer.api";

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
