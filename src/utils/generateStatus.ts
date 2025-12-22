export type StatusActivity = { label: string; color: string };

export const statusActivities = (status: string): StatusActivity => {
  switch (status) {
    case "PENDING":
      return { label: "Đang chờ", color: "#FFC107" }; // amber
    case "APPROVED":
      return { label: "Đã duyệt", color: "#28A745" }; // green
    case "CHECKED_IN":
      return { label: "Đã check-in", color: "#007BFF" }; // blue
    case "QUOTE_APPROVED":
      return { label: "Báo giá đã duyệt", color: "#17A2B8" }; // cyan
    case "REPAIR_COMPLETED":
      return { label: "Hoàn thành sửa chữa", color: "#17A2B8" }; // cyan
    case "WAITING_FOR_PAYMENT":
      return { label: "Chờ thanh toán", color: "#FD7E14" }; // orange
    case "PAYMENT_FAILED":
      return { label: "Thanh toán thất bại", color: "#DC3545" }; // red
    case "COMPLETED":
      return { label: "Hoàn thành", color: "#28A745" }; // green
    case "CANCELED":
      return { label: "Đã hủy", color: "#6C757D" }; // gray
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
      return "Hoàn thành";
    case "NO_START":
      return "Chưa bắt đầu";
    case "EXPIRED":
    case "EXPAIRED":
      return "Hết hạn";
    case "OVERDUE":
      return "Quá hạn";
    default:
      return "Không xác định";
  }
};

// Trả về màu chữ tương ứng với trạng thái (dựa trên statusLabel)
export const statusColor = (status: string): string => {
  if (!status) return "#120D26";
  switch (status) {
    case "PENDING":
      return "#F4C03E"; // warning
    case "APPROVED":
      return "#28A745"; // green
    case "CHECKED_IN":
      return "#007BFF"; // blue
    case "QUOTE_APPROVED":
      return "#17A2B8"; // cyan
    case "REPAIR_COMPLETED":
      return "#17A2B8"; // cyan
    case "WAITING_FOR_PAYMENT":
      return "#FD7E14"; // orange
    case "PAYMENT_FAILED":
      return "#DC3545"; // red/danger
    case "COMPLETED":
      return "#80CF95"; // success50
    case "CANCELED":
      return "#6C757D"; // gray
    // Legacy statuses
    case "UPCOMING":
      return "#F4C03E"; // primary (teal)
    case "SUCCESS":
      return "#80CF95"; // success50
    case "NO_START":
      return "#64748B"; // gray2
    case "EXPIRED":
    case "EXPAIRED":
      return "#EF2A39"; // danger
    case "OVERDUE":
      return "#EF2A39"; // danger
    default:
      return "#120D26"; // text
  }
};

export const formatKM = (text: string) => {
  const number = text.replace("KM", "");
  return `${number} KM`;
};

export const formatMonth = (text: string) => {
  const number = text.replace("MONTH_", "");
  return `Tháng thứ ${number}`;
};

export const formatActionType = (type: string) => {
  switch (type) {
    case "INSPECTION":
      return "Kiểm tra";
    case "LUBRICATION":
      return "Bôi trơn";
  }
};

export const formatRemedies = (remedies: string) => {
  switch (remedies) {
    case "REPLACE":
      return "Thay thế";
    case "REPAIR":
      return "Sửa chữa";
    case "TUNE":
      return "Điều chỉnh";
    case "CLEAN":
      return "Vệ sinh";
    case "WARRANTY":
      return "Bảo hành";
    case "NONE":
      return "Không cần xử lý";
  }
};

export const formatServiceType = (type: string) => {
  switch (type) {
    case "MAINTENANCE_TYPE":
      return "Bảo dưỡng";
    case "REPAIR_TYPE":
      return "Sửa chữa";
  }
};

export const formatStaffRole = (role: string) => {
  switch (role) {
    case "TECHNICIAN_STAFF":
      return "Kỹ thuật viên";
    case "SERVICE_STAFF":
      return "Tư vấn dịch vụ";
  }
};
