import { appointment, appointments, postAppointment } from "../apis/appointment.api";

export const createAppointment = async (data: any) => {
  try {
    const res = await postAppointment(data);
    if (res.success) {
      return {
        success: true,
        message: "Tạo lịch hẹn thành công",
        data: res.data,
      };
    } else {
      return {
        success: false,
        message: res.message || "Tạo lịch hẹn thất bại",
      };
    }
  } catch (error) {
    return { success: false, message: "Tạo lịch hẹn thất bại" };
  }
};

export const getAppointmentById = async (id: string) => {
  try {
    const res = await appointment(id);
    if (res.success) {
      return { success: true, data: res.data };
    } else {
      return {
        success: false,
        message: res.message || "Lấy thông tin lịch hẹn thất bại",
      };
    }
  } catch (error) {
    return { success: false, message: "Lấy thông tin lịch hẹn thất bại" };
  }
};

export const getAppointments = async (params: any) => {
  try {
    const res = await appointments(params);
    if (res.success) {
      return { success: true, data: res.data };
    } else {
      return {
        success: false,
        message: res.message || "Lấy thông tin lịch hẹn thất bại",
      };
    }
  } catch (error) {
    return { success: false, message: "Lấy thông tin lịch hẹn thất bại" };
  }
};
