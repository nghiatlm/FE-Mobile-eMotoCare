import { maintenanceStage } from "../apis/maintenanceStage.api";

export const getMaintenanceStageById = async (id: string) => {
  try {
    const res = await maintenanceStage(id);
    console.log("Maintenance stage data fetched:", res);
    return { success: true, data: res.data };
  } catch (error: any) {
    console.error("Get Maintenance Stage failed:", {
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
