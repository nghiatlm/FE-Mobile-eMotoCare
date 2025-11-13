import { appColor } from "../constants/appColor";

export function formatMaintenances(vehicleMaintenance: any[] = []) {
  if (!Array.isArray(vehicleMaintenance) || vehicleMaintenance.length === 0)
    return [];

  return vehicleMaintenance.map((m: any, idx: number) => {
    const date = m?.dateOfImplementation
      ? new Date(m.dateOfImplementation).toLocaleDateString()
      : "Chưa có ngày";
    const status = m?.status ?? "NO_START";
    const pillColor =
      status === "COMPLETED"
        ? appColor.primary
        : status === "UPCOMING"
        ? appColor.warning
        : status === "OVERDUE" || status === "EXPIRED"
        ? appColor.danger
        : appColor.gray;
    const cardBg =
      status === "COMPLETED"
        ? appColor.success50
        : status === "UPCOMING"
        ? appColor.warning2
        : status === "OVERDUE" || status === "EXPIRED"
        ? appColor.danger50
        : appColor.white;
    const statusColor =
      status === "COMPLETED"
        ? appColor.primary
        : status === "UPCOMING"
        ? appColor.warning
        : status === "OVERDUE"
        ? appColor.danger
        : appColor.gray;

    return {
      maintenanceId: m.id ?? `local-${idx}`,
      id: m.id ?? idx,
      title: m.name ?? `Lần ${idx + 1}`,
      date,
      status,
      pillColor,
      cardBg,
      statusColor,
      raw: m,
      maintenanceStageId: m.maintenanceStageId || null,
    };
  });
}

export default formatMaintenances;
