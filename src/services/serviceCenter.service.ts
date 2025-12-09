import { serviceCenter, slotTime } from "../apis/serviceCenter.api";

export const getServiceCenter = async (params: any) => {
  try {
    const res = await serviceCenter(params);
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

export const getSlotTime = async (params: any) => {
  try {
    const res = await slotTime(params.serviceCenterId);
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
