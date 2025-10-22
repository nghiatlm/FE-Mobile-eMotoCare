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
      return { success: false, message: res.data.message };
    }
  } catch (error) {
    console.error("Create Failed:", error);
    return { success: false, message: "Tạo thất bại. Vui lòng thử lại." };
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
      return { success: false, message: res.data.message };
    }
  } catch (error) {
    console.error("Get Failed:", error);
    return {
      success: false,
      message: "Lấy thông tin thất bại. Vui lòng thử lại.",
    };
  }
};
