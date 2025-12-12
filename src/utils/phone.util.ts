export const formatPhoneNumber = (phone?: string | number): string => {
  if (phone === null || phone === undefined) {
    return "";
  }

  const value = String(phone).trim();
  if (!value) return "";

  // keep digits only
  let digits = value.replace(/\D/g, "");
  if (!digits) return "";

  // convert leading 84 to 0 for VN numbers
  if (digits.startsWith("84") && digits.length >= 10) {
    digits = "0" + digits.slice(2);
  }

  const len = digits.length;
  if (len === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  if (len === 11) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }

  // default chunk grouping of 3-3-4 style if possible
  if (len > 7) {
    return `${digits.slice(0, len - 7)} ${digits.slice(len - 7, len - 4)} ${digits.slice(len - 4)}`;
  }

  if (len > 4) {
    return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  }

  return digits;
};
