import apiClient from "../apis/custom.api";

export const postAppointment = async (data: any) => {
  const res = await apiClient.post("/appointments", data);
  return res.data;
};

export const appointment = async (id: string) => {
  const res = await apiClient.get(`/appointments/${id}`);
  return res.data;
};

export const appointments = async (params: any) => {
  const res = await apiClient.get("/appointments", { params });
  return res.data;
};
