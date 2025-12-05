export const parseDate = (s: string) => {
  if (!s || typeof s !== "string") throw new Error("Invalid date");
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

export const formatDate = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};
