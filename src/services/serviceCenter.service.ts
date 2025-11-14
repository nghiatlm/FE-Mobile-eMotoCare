import serviceCenterAPI, {
  ServiceCenterSlots,
} from "../apis/servicecenter.api";

export const getServiceCenter = async (params: any) => {
  try {
    const res = await serviceCenterAPI.HandleServiceCenter(
      "service-centers",
      null,
      "get",
      params
    );
    if (res.data.success) {
      return { success: true, data: res.data.data };
    } else {
      return { success: false, message: res.data.message };
    }
  } catch (error) {
    console.error("Get failed:", error);
    return { success: false, message: "Lấy thông tin trung tâm thất bại. Vui lòng thử lại." };
  }
};

export const getServiceCenterSlots = async (centerId: string) => {
  try {
    const res = await ServiceCenterSlots(centerId);
    if (res.success) {
      return { success: true, data: res.data };
    } else {
      return { success: false, message: res.message };
    }
  } catch (error) {
    console.error("Get Failed:", error);
    return {
      success: false,
      message: "Lấy thống tin thất bại. Vui lòng thử lại.",
    };
  }
};
