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
    case "CHECKED_IN":
      return { label: "Đã check-in", color: "#007BFF" }; // blue
    default:
      return { label: "Không xác định", color: "#343A40" }; // dark
  }
};

// Trả về chuỗi mô tả trạng thái (không kèm màu)
export const statusLabel = (status: string): string => {
  if (!status) return "Không xác định";
  switch (status) {
    case "UPCOMING":
      return "Sắp tới";
    case "SUCCESS":
    case "COMPLETED":
      return "Hoàn thành";
    case "NO_START":
      return "Chưa bắt đầu";
    case "EXPIRED":
    case "EXPAIRED":
      return "Hết hạn";
    case "OVERDUE":
      return "Quá hạn";
    case "PENDING":
      return "Đang chờ";
    default:
      return "Không xác định";
  }
};
