export type TransparencySectionId = "history" | "methodology" | "contracts";

export interface TransparencySection {
  id: TransparencySectionId;
  label: string;
  description: string;
}

export const transparencySections: TransparencySection[] = [
  {
    id: "history",
    label: "سابقه",
    description: "",
  },
  {
    id: "methodology",
    label: "اصول قراردادی",
    description: "",
  },
  {
    id: "contracts",
    label: "متن قراردادها",
    description: "",
  },
];

export function isTransparencySectionId(
  value: string | null | undefined,
): value is TransparencySectionId {
  return (
    value === "history" ||
    value === "methodology" ||
    value === "contracts"
  );
}

export function transparencySectionHref(id: TransparencySectionId): string {
  return id === "history" ? "/transparency" : `/transparency?section=${id}`;
}
