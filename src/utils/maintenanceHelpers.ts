import { formatDateDDMMYYYY } from "./formatDate";

type RowData = {
  maintenanceStage?: { name?: string } | null;
  status?: string | null;
  dateOfImplementation?: string | null;
};

type BuildOptions = {
  includeDate?: boolean; // append formatted date to label
};

/**
 * Build steps and current index from maintenance `rowDatas` returned by API.
 * - `steps`: array of labels (defaults to maintenanceStage.name or "Lần N")
 * - `current`: 1-based index for the active step (first non-COMPLETED). If all completed -> last step index.
 *
 * Sorting: tries to order by numeric suffix in `maintenanceStage.name` (e.g. "Bảo dưỡng lần 1").
 * Falls back to original array order if numeric parsing fails.
 */
export function buildMaintenanceSteps(
  rowDatas: RowData[] | undefined | null,
  opts: BuildOptions = { includeDate: false }
): { steps: string[]; current: number } {
  if (!Array.isArray(rowDatas) || rowDatas.length === 0) {
    return { steps: ["Lần 1"], current: 1 };
  }

  // attach sort key extracted from name like '... lần 3' or fallback to index
  const enriched = rowDatas.map((r, idx) => {
    const name = r?.maintenanceStage?.name ?? "";
    const m = name.match(/(\d+)\s*$/); // number at end
    const foundNumber = m ? parseInt(m[1], 10) : undefined;
    return { r, idx, name, foundNumber };
  });

  // If at least one foundNumber exists, sort by it; otherwise keep original order
  const hasNumber = enriched.some((e) => typeof e.foundNumber === "number");
  const sorted = hasNumber
    ? enriched.slice().sort((a, b) => (a.foundNumber! - b.foundNumber!))
    : enriched.slice().sort((a, b) => a.idx - b.idx);

  const steps = sorted.map((e, i) => {
    const base = e.name && e.name.trim() !== "" ? e.name : `Lần ${i + 1}`;
    if (opts.includeDate && e.r?.dateOfImplementation) {
      const d = formatDateDDMMYYYY(e.r.dateOfImplementation as string);
      return d ? `${base} (${d})` : base;
    }
    return base;
  });

  // determine current: first index where status !== 'COMPLETED'
  const firstNotCompleted = sorted.findIndex((e) => {
    const s = (e.r?.status ?? "") as string;
    return s.toUpperCase() !== "COMPLETED";
  });

  const current = firstNotCompleted === -1 ? steps.length : firstNotCompleted + 1;

  return { steps, current };
}

export default buildMaintenanceSteps;
