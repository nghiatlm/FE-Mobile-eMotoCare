import rmaAPI from "../apis/rma.api";

export const getRmas = async (params: any) => {
  try {
    const res = await rmaAPI.HandleRMA("rmas", null, "get", params);
    if (res.data.success) {
      return { success: true, data: res.data.data };
    } else {
      return {
        success: false,
        message: res.data.message || "Lấy thông tin thất bại.",
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
      message: apiMessage ?? "Lấy thông tin thất bại. Vui lòng thử lại.",
    };
  }
};

export const getRmasByCustomer = async (customerId: string) => {
  try {
    const res = await rmaAPI.HandleRMA(
      `rmas/customer/${customerId}`,
      null,
      "get"
    );
    if (res.data.success) {
      return { success: true, data: res.data.data };
    } else {
      return {
        success: false,
        message: res.data.message || "Lấy thông tin thất bại.",
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
      message: apiMessage ?? "Lấy thông tin thất bại. Vui lòng thử lại.",
    };
  }
};
