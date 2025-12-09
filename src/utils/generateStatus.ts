export type StatusActivity = { label: string; color: string };

export const statusActivities = (status: string): StatusActivity => {
  switch (status) {
    case "ACTIVE":
      return { label: "Đang hoạt động", color: "#28A745" }; // green
    case "APPROVED":
      return { label: "Hoàn thành sửa chữa", color: "#17A2B8" }; // cyan
    case "INACTIVE":
      return { label: "Không hoạt động", color: "#6C757D" }; // gray
    case "PENDING":
      return { label: "Đang chờ", color: "#FFC107" }; // amber
    case "CANCELLED":
      return { label: "Đã hủy", color: "#DC3545" }; // red
    case "REPAIR_COMPLETED":
      return { label: "Hoàn thành sửa chữa", color: "#17A2B8" }; // cyan
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

// Trả về màu chữ tương ứng với trạng thái (dựa trên statusLabel)
export const statusColor = (status: string): string => {
  if (!status) return "#120D26";
  switch (status) {
    case "UPCOMING":
      return "#2F766B"; // primary (teal)
    case "SUCCESS":
    case "APPROVED":
    case "REPAIR_COMPLETED":
    case "COMPLETED":
      return "#80CF95"; // success50
    case "NO_START":
      return "#64748B"; // gray2
    case "EXPIRED":
    case "EXPAIRED":
      return "#EF2A39"; // danger
    case "OVERDUE":
      return "#EF2A39"; // danger
    case "PENDING":
      return "#F4C03E"; // warning
    default:
      return "#120D26"; // text
  }
};
