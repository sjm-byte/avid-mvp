/** Question-and-answer list with hairline separators (no cards). */
export function EnFaqList({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <dl className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <div key={item.q} className="grid gap-2 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] md:gap-10">
          <dt className="font-display text-[1.45rem] font-semibold leading-snug text-navy">
            {item.q}
          </dt>
          <dd className="text-[1.0625rem] leading-relaxed text-muted-foreground">{item.a}</dd>
        </div>
      ))}
    </dl>
  );
}
