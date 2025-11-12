export type StatusActivity = { label: string; color: string };

export const statusActivities = (status: string): StatusActivity => {
  switch (status) {
    case "ACTIVE":
      return { label: "Đang hoạt động", color: "#28A745" }; // green
    case "INACTIVE":
      return { label: "Không hoạt động", color: "#6C757D" }; // gray
    case "PENDING":
      return { label: "Đang chờ", color: "#FFC107" }; // amber
    case "CANCELLED":
      return { label: "Đã hủy", color: "#DC3545" }; // red
    default:
      return { label: "Không xác định", color: "#343A40" }; // dark
  }
};
