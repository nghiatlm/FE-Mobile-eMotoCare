import apiClient from "../apis/custom.api";

export const getNotifications = async (params: {
  receiverId: string;
  page?: number;
  pageSize?: number;
}) => {
  const res = await apiClient.get("/notifications", { params });
  return res.data;
};

