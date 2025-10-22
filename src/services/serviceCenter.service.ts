import serviceCenterAPI from "../apis/servicecenter.api";

export const getServiceCenter = async (params: any) => {
  try {
    const res = await serviceCenterAPI.HandleServiceCenter(
      "admin/service-centers",
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
    console.error("Login failed:", error);
    return { success: false, message: "Đăng nhập thất bại. Vui lòng thử lại." };
  }
};
