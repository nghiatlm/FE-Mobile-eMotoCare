import { vehicles, vehicleStage } from "../apis/vehicle.api";

export const getVehicle = async (params: any) => {
  try {
    const response = await vehicles(params);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Get vehicle failed:", {
      message: error?.message,
      responseData: error?.response?.data,
      status: error?.rFesponse?.status,
    });

    const message =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "Lấy thông tin xe thất bại. Vui lòng thử lại.";
    return { success: false, message };
  }
};

export const getVehicleById = async (id: string) => {
  try {
    const response = await vehicles({ id });
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Get vehicle by ID failed:", {
      message: error?.message,
      responseData: error?.response?.data,
      status: error?.response?.status,
    });
    const message =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "Lấy thông tin xe thất bại. Vui lòng thử lại.";
    return { success: false, message };
  }
};

export const getVehicleStage = async (id: string) => {
  try {
    const response = await vehicleStage(id);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Get vehicle stage failed:", {
      message: error?.message,
      responseData: error?.response?.data,
      status: error?.response?.status,
    });
    const message =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "Lấy thông tin giai đoạn xe thất bại. Vui lòng thử lại.";
    return { success: false, message };
  }
};
