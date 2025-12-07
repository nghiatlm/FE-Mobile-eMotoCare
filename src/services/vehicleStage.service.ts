import { vechicleStages, vehicleStageDetail } from "../apis/vehicleStage.api";

export const getVehicleStages = async (params: any) => {
  try {
    const res = await vechicleStages(params);
    if (res.success) {
      return { success: true, data: res.data };
    } else {
      return {
        success: false,
        message: res.message || "Lấy thông tin thất bại",
      };
    }
  } catch (error) {
    return { success: false, message: "Lấy thông tin thất bại" };
  }
};

export const getVehicleStageDetail = async (id: string) => {
  try {
    const res = await vehicleStageDetail(id);
    if (res.success) {
      return { success: true, data: res.data };
    } else {
      return {
        success: false,
        message: res.message || "Lấy thông tin thất bại",
      };
    }
  } catch (error) {
    return { success: false, message: "Lấy thông tin thất bại" };
  }
};
