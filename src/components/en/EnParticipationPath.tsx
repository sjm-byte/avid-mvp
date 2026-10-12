import Link from "next/link";
import { EnConsultationForm } from "@/components/en/EnConsultationForm";

const STEPS = [
  {
    title: (
      <>
        Read the{" "}
        <Link
          href="/en/transparency"
          className="underline decoration-gold/60 underline-offset-4 hover:decoration-gold"
        >
          transparency page
        </Link>
      </>
    ),
    body: "Review our track record, contract principles and contract texts before taking part.",
  },
  {
    title: "Express your interest",
    body: "Leave a phone number and the Avid team will call to coordinate with you.",
  },
  {
    title: "Sign the contract and transfer funds",
    body: "Once agreed, the contract is drawn up and payment instructions are issued.",
  },
];

export function EnParticipationPath() {
  return (
    <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
      <ol className="relative space-y-10 border-l border-gold/40 ps-8">
        {STEPS.map((s, i) => (
          <li key={i} className="relative">
            <span
              className="absolute -start-[3.15rem] top-0 flex size-9 items-center justify-center rounded-full border border-gold/60 bg-navy font-display text-lg font-semibold text-white [font-variant-numeric:lining-nums]"
              aria-hidden
            >
              {i + 1}
            </span>
            <p className="text-sm text-muted-foreground">Step {i + 1}</p>
            <h3 className="mt-1 text-2xl leading-snug text-navy">{s.title}</h3>
            <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
      <div className="lg:self-start">
        <EnConsultationForm />
      </div>
    </div>
  );
}
