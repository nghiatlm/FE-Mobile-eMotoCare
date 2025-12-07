export const parseDate = (s: string) => {
  if (!s || typeof s !== "string") throw new Error("Invalid date");
  
  if (s.includes("T")) {
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d;
  }
  
  const parts = s.split("-");
  if (parts.length !== 3) throw new Error("Invalid date format");
  if (parts[0].length === 4) {
    const yyyy = Number(parts[0]);
    const mm = Number(parts[1]) - 1;
    const dd = Number(parts[2]);
    return new Date(yyyy, mm, dd);
  }
  const dd = Number(parts[0]);
  const mm = Number(parts[1]) - 1;
  const yyyy = Number(parts[2]);
  return new Date(yyyy, mm, dd);
};

export const addDays = (d: Date, days: number) =>
  new Date(d.getTime() + days * 24 * 60 * 60 * 1000);

export const formatDate = (input: Date | string) => {
  let d: Date;
  
  if (typeof input === "string") {
    // Handle ISO string or other string formats
    d = new Date(input);
    if (isNaN(d.getTime())) {
      // If invalid, try to parse with parseDate
      try {
        d = parseDate(input);
      } catch {
        throw new Error("Invalid date input");
      }
    }
  } else if (input instanceof Date) {
    d = input;
  } else {
    throw new Error("Invalid date input");
  }
  
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};
