import { evcheckId } from "../apis/evcheck.api";
import evCheckAPI from "../apis/evcheck2.api";

export const getEvcheckDetail = async (id: string) => {
  try {
    const response = await evcheckId(id);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Get Evcheck by ID failed:", {
      message: error?.message,
      responseData: error?.response?.data,
      status: error?.response?.status,
    });
    const message =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "Lấy thông tin evcheck thất bại. Vui lòng thử lại.";
    return { success: false, message };
  }
};

export const approveEvcheck = async (id: string) => {
  try {
    const res = await evCheckAPI.HandleEVCheck(
      `evchecks/${id}/approve-quote`,
      null,
      "put"
    );
    if (res.data.success) {
      return { success: true, data: res.data.data };
    } else {
      return {
        success: false,
        message: res.data.message || "Xác nhận thất bại.",
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
      message: apiMessage ?? "Xác nhận thất bại thất bại. Vui lòng thử lại.",
    };
  }
};

export const updateEvCheck = async (id: string, data: any) => {
  try {
    const res = await evCheckAPI.HandleEVCheck(`evchecks/${id}`, data, "put");
    if (res.data.success) {
      return { success: true, data: res.data.data };
    } else {
      return {
        success: false,
        message: res.data.message || "Hủy thất bại.",
      };
    }
  } catch (error: any) {
    const apiMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data ||
      error?.message;
    console.error("Error:", apiMessage ?? error);
    return {
      success: false,
      message: apiMessage ?? "Reject failed. Please try again.",
    };
  }
};
