/**
 * Format slot time from format "H10_12" to "10:00 - 12:00"
 * @param slotTime string in format "HXX_YY" where XX is start hour and YY is end hour
 * @returns formatted time string like "10:00 - 12:00"
 */
export const formatSlotTime = (slotTime: string): string => {
  try {
    if (!slotTime) return "";
    
    // Extract hours from format like "H10_12"
    const match = slotTime.match(/H(\d+)_(\d+)/);
    if (!match) return slotTime;
    
    const startHour = parseInt(match[1], 10);
    const endHour = parseInt(match[2], 10);
    
    // Format as HH:00 - HH:00
    const startTime = `${String(startHour).padStart(2, "0")}:00`;
    const endTime = `${String(endHour).padStart(2, "0")}:00`;
    
    return `${startTime} - ${endTime}`;
  } catch (error) {
    console.warn("Error formatting slot time:", error);
    return slotTime;
  }
};
