export const formatMileage = (mileage: string): string => {
  if (!mileage) return "";
  
  // Extract number from format like "KM3000"
  const match = mileage.match(/KM(\d+)/);
  if (match && match[1]) {
    const km = parseInt(match[1]);
    if (km >= 1000) {
      return `${km / 1000}K km`;
    }
    return `${km} km`;
  }
  
  return mileage;
};

export const formatDurationMonth = (duration: string): string => {
  if (!duration) return "";
  
  // Extract number from format like "MONTH_9"
  const match = duration.match(/MONTH_(\d+)/);
  if (match && match[1]) {
    const months = parseInt(match[1]);
    if (months === 1) {
      return "1 tháng";
    }
    return `${months} tháng`;
  }
  
  return duration;
};
