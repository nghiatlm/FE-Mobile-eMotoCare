import { batteries, batteryDetail } from "../apis/battery.api";

export const getBatteries = async (params: any) => {
  try {
    const res = await batteries(params);
    if (res.success) {
      return { success: true, data: res.data };
    } else {
      return {
        success: false,
        message: res.message || "Lấy thông tin pin thất bại",
      };
    }
  } catch (error) {
    return { success: false, message: "Lấy thông tin pin thất bại" };
  }
};

export const getBatteryDetail = async (id: string) => {
  try {
    const res = await batteryDetail(id);
    if (res.success) {
      return { success: true, data: res.data };
    } else {
      return {
        success: false,
        message: res.message || "Lấy thông tin pin thất bại",
      };
    }
  } catch (error) {
    return { success: false, message: "Lấy thông tin pin thất bại" };
  }
};
