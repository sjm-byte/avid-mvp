const REQUEST_CONFIRMATION_LABELS = [
  "پذیرش ریسک",
  "پذیرش بازده پیش‌بینی‌شده",
  "پذیرش شرایط",
] as const;

interface RequestCheckboxConfirmationsProps {
  compact?: boolean;
}

export function RequestCheckboxConfirmations({
  compact = false,
}: RequestCheckboxConfirmationsProps) {
  return (
    <ul className={compact ? "space-y-0.5 text-xs" : "space-y-1 text-xs"}>
      {REQUEST_CONFIRMATION_LABELS.map((label) => (
        <li key={label} className="flex items-center gap-1.5 text-muted-foreground">
          <span className="text-emerald-700" aria-hidden="true">
            ✓
          </span>
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
