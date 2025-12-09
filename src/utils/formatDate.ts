function _msToParts(ms: number) {
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const remDays = days - years * 365 - months * 30;
  return { years, months, days, remDays };
}

export const getWarrantyDuration = (
  purchaseDate: string,
  warrantyExpiry: string
) => {
  try {
    const start = Date.parse(purchaseDate);
    const end = Date.parse(warrantyExpiry);
    const diff = Math.max(0, end - start);
    const parts = _msToParts(diff);
    return {
      years: parts.years,
      months: parts.months,
      days: parts.remDays,
      totalDays: parts.days,
      formatted: `${parts.years} năm ${parts.months} tháng ${parts.remDays} ngày`,
    };
  } catch {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      formatted: "Không xác định",
    };
  }
};

export const getWarrantyRemaining = (warrantyExpiry: string) => {
  try {
    const now = Date.now();
    const end = Date.parse(warrantyExpiry);
    const diff = Math.max(0, end - now);
    const parts = _msToParts(diff);
    return {
      expired: end <= now,
      years: parts.years,
      months: parts.months,
      days: parts.remDays,
      totalDays: parts.days,
      formatted:
        end <= now
          ? "Hết hạn"
          : `${parts.years} năm ${parts.months} tháng ${parts.remDays} ngày`,
    };
  } catch {
    return {
      expired: true,
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      formatted: "Không xác định",
    };
  }
};

/**
 * Format a date (string | number | Date) to dd-mm-yyyy
 * Examples:
 *  - formatDateDDMMYYYY('2025-02-10') => '10-02-2025'
 *  - formatDateDDMMYYYY(new Date()) => '23-11-2025'
 */
export const formatDateDDMMYYYY = (input: string | number | Date): string => {
  if (input === null || input === undefined) return "";

  // Try direct Date first
  let d = new Date(input as any);
  if (Number.isNaN(d.getTime())) {
    // Normalize common malformed ISO like '2021-01-01-T00:00:00' -> '2021-01-01T00:00:00'
    try {
      let s = String(input).trim();
      // replace occurrences like '-T' or ' -T' with 'T'
      s = s.replace(/-?T/, "T");
      // keep only date part if there is a time separator
      if (s.includes("T")) s = s.split("T")[0];
      else if (s.includes(" ")) s = s.split(" ")[0];

      d = new Date(s);
    } catch (e) {
      return "";
    }
  }

  if (Number.isNaN(d.getTime())) return "";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

export const checkWarranty = (
  vehicleOrExpiry: string | { warrantyExpiry?: string } | null | undefined
): {
  valid: boolean;
  expired: boolean;
  remaining: string;
  totalDays: number;
} => {
  try {
    if (!vehicleOrExpiry)
      return {
        valid: false,
        expired: true,
        remaining: "Hết hạn",
        totalDays: 0,
      };
    let expiry: string | undefined;
    if (typeof vehicleOrExpiry === "string") expiry = vehicleOrExpiry;
    else expiry = vehicleOrExpiry.warrantyExpiry;

    if (!expiry)
      return {
        valid: false,
        expired: true,
        remaining: "Không xác định",
        totalDays: 0,
      };

    const info = getWarrantyRemaining(expiry);
    return {
      valid: !info.expired,
      expired: info.expired,
      remaining: info.formatted,
      totalDays: info.totalDays,
    };
  } catch {
    return {
      valid: false,
      expired: true,
      remaining: "Không xác định",
      totalDays: 0,
    };
  }
};
