import Vehicle from "./contants/vehicle.json";

export const getVehicleByCustomer = async () => {
  if (Vehicle?.vehicle) {
    return { success: true, data: Vehicle.vehicle };
  } else {
    return { success: false, message: "Chưa có data" };
  }
};
