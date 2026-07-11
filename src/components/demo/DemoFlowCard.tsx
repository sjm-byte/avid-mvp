import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface DemoFlowStep {
  href: string;
  label: string;
}

interface DemoFlowCardProps {
  title?: string;
  description?: string;
  steps: DemoFlowStep[];
}

export function DemoFlowCard({
  title = "مسیر نمایشی پیشنهادی",
  description = "برای آشنایی سریع با جریان اصلی آوید، این صفحات را به‌ترتیب باز کنید.",
  steps,
}: DemoFlowCardProps) {
  return (
    <Card className="border-dashed border-primary/25 bg-primary/[0.03]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="space-y-2.5">
          {steps.map((step, index) => (
            <li key={step.href} className="flex items-start gap-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {index + 1}
              </span>
              <Link
                href={step.href}
                className="leading-relaxed text-primary hover:underline"
              >
                {step.label}
              </Link>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
