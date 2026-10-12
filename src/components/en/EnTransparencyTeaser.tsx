import Link from "next/link";

export const EN_TRANSPARENCY_SECTIONS = [
  {
    id: "history" as const,
    title: "Track record",
    hook: "Settlement table, and the gap between projection and outcome",
  },
  {
    id: "methodology" as const,
    title: "Contract principles",
    hook: "Credit risk, economic risk, and where your money sits",
  },
  {
    id: "contracts" as const,
    title: "Contract texts",
    hook: "Murabaha, salaf and musharakah: how each model is structured",
  },
];

export function enTransparencyHref(id: "history" | "methodology" | "contracts") {
  return id === "history" ? "/en/transparency" : `/en/transparency?section=${id}`;
}

/** The three transparency sections are read in order, so they are numbered. */
export function EnTransparencyTeaser() {
  return (
    <ol className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
      {EN_TRANSPARENCY_SECTIONS.map((s, i) => (
        <li key={s.id} className="bg-card">
          <Link
            href={enTransparencyHref(s.id)}
            className="group flex h-full flex-col p-7 transition-colors hover:bg-[hsl(43_54%_54%/0.06)]"
          >
            <span className="font-display text-4xl font-semibold leading-none text-gold [font-variant-numeric:lining-nums]">
              {i + 1}
            </span>
            <h3 className="mt-5 text-2xl text-navy">{s.title}</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">{s.hook}</p>
            <span className="mt-6 text-sm font-semibold text-navy underline decoration-gold/50 underline-offset-4 group-hover:decoration-gold">
              Read this section
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
