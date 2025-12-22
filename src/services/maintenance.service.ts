import { maintenanceStage } from "../apis/maintenance.api";

export const getMaintenanceStageById = async (id: string) => {
  try {
    const res = await maintenanceStage(id);
    if (res.success) {
      return { success: true, data: res.data };
    } else {
      return {
        success: false,
        message: res.message || "Lấy thông tin đợt bảo dưỡng thất bại",
      };
    }
  } catch (error) {
    return { success: false, message: "Lấy thông tin lịch hẹn thất bại" };
  }
};
