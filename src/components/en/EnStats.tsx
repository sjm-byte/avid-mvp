const STATS = [
  { value: "15+", label: "Completed projects" },
  { value: "50+", unit: "billion Toman", label: "Total participation recorded" },
  { value: "5%+", label: "Average realised monthly return" },
] as const;

/** Track-record figures set as large serif numerals between hairline rules. */
export function EnStats() {
  return (
    <dl className="grid border-y border-navy/15 sm:grid-cols-3">
      {STATS.map((s, i) => (
        <div
          key={s.label}
          className={
            "px-6 py-8 text-center sm:py-10 " +
            (i > 0 ? "border-t border-navy/15 sm:border-l sm:border-t-0" : "")
          }
        >
          <dt className="sr-only">{s.label}</dt>
          <dd>
            <span className="font-display text-[3.25rem] font-semibold leading-none text-navy [font-variant-numeric:lining-nums]">
              {s.value}
            </span>
            {"unit" in s ? (
              <span className="ms-2 font-display text-xl italic text-navy/80">{s.unit}</span>
            ) : null}
          </dd>
          <dd className="mt-3 text-[0.95rem] text-muted-foreground">{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}
