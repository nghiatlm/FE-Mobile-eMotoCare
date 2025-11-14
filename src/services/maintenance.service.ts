import { maintenances } from "../apis/maintenance.api";

export const getMaintenances = async (params: any) => {
  try {
    const response = await maintenances(params);
    // console.log("Maintenances data fetched:", response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Get Maintenances failed:", {
      message: error?.message,
      responseData: error?.response?.data,
      status: error?.rFesponse?.status,
    });

    const message =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "Lấy thông tin bảo dưỡng thất bại. Vui lòng thử lại.";
    return { success: false, message };
  }
};
