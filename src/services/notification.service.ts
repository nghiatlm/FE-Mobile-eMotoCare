import { getNotifications } from "../apis/notification.api";

export const fetchNotifications = async (params: {
  receiverId: string;
  page?: number;
  pageSize?: number;
}) => {
  try {
    const res = await getNotifications(params);
    if (res.success) {
      return { success: true, data: res.data };
    } else {
      return {
        success: false,
        message: res.message || "Lấy danh sách thông báo thất bại",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Lấy danh sách thông báo thất bại",
    };
  }
};

