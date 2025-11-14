// Helpers for mileage (KM) and duration (months) options and labels
export const KM_OPTIONS = [
  { code: "KM1000", label: "1.000 Km" },
  { code: "KM5000", label: "5.000 Km" },
  { code: "KM10000", label: "10.000 Km" },
  { code: "KM15000", label: "15.000 Km" },
  { code: "KM20000", label: "20.000 Km" },
  { code: "KM25000", label: "25.000 Km" },
  { code: "KM30000", label: "30.000 Km" },
  { code: "KM35000", label: "35.000 Km" },
  { code: "KM40000", label: "40.000 Km" },
  { code: "KM45000", label: "45.000 Km" },
  { code: "KM50000", label: "50.000 Km" },
];

export const DEFAULT_KM_CODE = "KM5000"; // default to 5.000 Km

export function generateKM() {
  return KM_OPTIONS;
}

export function getKMLabel(value: any): string {
  if (value === null || value === undefined || value === "") {
    value = DEFAULT_KM_CODE;
  }

  // If a number (e.g., 5000), try to match by numeric value
  if (typeof value === "number") {
    const numeric = Number(value);
    const found = KM_OPTIONS.find((o) => Number(String(o.code).replace(/[^0-9]/g, "")) === numeric);
    if (found) return found.label;
    return `${numeric} Km`;
  }

  const str = String(value).trim();
  // If code like KM5000
  const found = KM_OPTIONS.find((o) => o.code === str);
  if (found) return found.label;

  // If string numeric '5000' or '5000 Km'
  const digits = Number(str.replace(/[^0-9]/g, ""));
  if (!isNaN(digits) && digits > 0) return `${digits.toLocaleString()} Km`;

  return str;
}

// Duration month options (codes and labels). Order preserved from user's list.
export const DURATION_OPTIONS = [
  { code: "MONTH_9", label: "9 tháng" },
  { code: "MONTH_60", label: "60 tháng" },
  { code: "MONTH_6", label: "6 tháng" },
  { code: "MONTH_48", label: "48 tháng" },
  { code: "MONTH_36", label: "36 tháng" },
  { code: "MONTH_3", label: "3 tháng" },
  { code: "MONTH_24", label: "24 tháng" },
  { code: "MONTH_18", label: "18 tháng" },
  { code: "MONTH_12", label: "12 tháng" },
  { code: "MONTH_30", label: "30 tháng" },
  { code: "MONTH_42", label: "42 tháng" },
];

export const DEFAULT_DURATION_CODE = "MONTH_6"; // default to 6 months

export function generateDurationMonth() {
  return DURATION_OPTIONS;
}

export function getDurationLabel(value: any): string {
  if (value === null || value === undefined || value === "") value = DEFAULT_DURATION_CODE;

  if (typeof value === "number") return `${value} tháng`;

  const str = String(value).trim();
  const found = DURATION_OPTIONS.find((o) => o.code === str);
  if (found) return found.label;

  // If input like '6' or '6 tháng'
  const digits = Number(str.replace(/[^0-9]/g, ""));
  if (!isNaN(digits) && digits > 0) return `${digits} tháng`;

  return str;
}

export default {
  generateKM,
  getKMLabel,
  generateDurationMonth,
  getDurationLabel,
};
