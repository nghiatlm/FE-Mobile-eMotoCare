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
