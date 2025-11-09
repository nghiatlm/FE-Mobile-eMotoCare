import { evcheckId } from "../apis/evcheck.api";

export const getVehicleById = async (id: string) => {
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
