import { evcheckDetail } from "../apis/evcheck.api";

export const getDetail = async (id: string) => {
  try {
    const res = await evcheckDetail(id);
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
