import appointmentAPI from "../apis/appointment.api";

export const CreateAppointment = async (values: any) => {
  try {
    const res = await appointmentAPI.HandleAppointment(
      "appointments",
      values,
      "post"
    );
    if (res.data.success) {
      return { success: true, data: res.data.data };
    } else {
      return { success: false, message: res.data.message || "Tạo thất bại" };
    }
  } catch (error: any) {
    const apiMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data ||
      error?.message;
    return {
      success: false,
      message: apiMessage ?? "Tạo thất bại. Vui lòng thử lại.",
    };
  }
};

export const getAppointmentDetail = async (id: string) => {
  try {
    const res = await appointmentAPI.HandleAppointment(
      `appointments/${id}`,
      null,
      "get"
    );
    if (res.data.success) {
      return { success: true, data: res.data.data };
    } else {
      return {
        success: false,
        message: res.data.message || "Lấy thông tin thất bại.",
      };
    }
  } catch (error: any) {
    const apiMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data ||
      error?.message;
    console.error("Get Failed:", apiMessage ?? error);
    return {
      success: false,
      message: apiMessage ?? "Lấy thông tin thất bại. Vui lòng thử lại.",
    };
  }
};

export const getAppointments = async (params: any) => {
  try {
    const res = await appointmentAPI.HandleAppointment(
      "appointments",
      null,
      "get",
      params
    );
    if (res.data.success) {
      return { success: true, data: res.data.data };
    } else {
      return {
        success: false,
        message: res.data.message || "Lấy thông tin thất bại.",
      };
    }
  } catch (error: any) {
    const apiMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data ||
      error?.message;
    console.error("Get Failed:", apiMessage ?? error);
    return {
      success: false,
      message: apiMessage ?? "Lấy thông tin thất bại. Vui lòng thử lại.",
    };
  }
};
