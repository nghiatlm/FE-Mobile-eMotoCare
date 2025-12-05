import { vehicles } from "../apis/vehicle.api";

export const getVehicles = async (params: any) => {
  try {
    const res = await vehicles(params);
    if (res.success) {
      return { success: true, data: res.data };
    } else {
      return {
        success: false,
        message: res.message || "Lấy thông tin phương tiện thất bại",
      };
    }
  } catch (error) {
    return { success: false, message: "Lấy thông tin phương tiện thất bại" };
  }
};
