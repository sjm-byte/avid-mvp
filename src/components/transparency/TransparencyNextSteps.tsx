import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  transparencyPillars,
  type TransparencyPillarId,
} from "@/components/transparency/transparency-pillars";

const nextStepCopy: Record<
  TransparencyPillarId,
  { intro: string; showProjects?: boolean }
> = {
  transparency: {
    intro:
      "برای آشنایی با اصول کار و تفکیک ریسک‌ها، صفحه روش کار را بخوانید؛ سپس قراردادها و ریسک هر مدل را بررسی کنید.",
  },
  "risk-disclosure": {
    intro:
      "پس از مطالعه اصول و ریسک‌ها، قراردادها و مدل‌های اجرایی را ببینید و سپس سابقه عملکرد پروژه‌های گذشته را مقایسه کنید.",
    showProjects: true,
  },
  contracts: {
    intro:
      "پس از مطالعه انواع قراردادها، اصول و تفکیک ریسک را در صفحه روش کار بخوانید و سابقه عملکرد پروژه‌ها را ببینید.",
    showProjects: true,
  },
};

interface TransparencyNextStepsProps {
  current: TransparencyPillarId;
}

export function TransparencyNextSteps({ current }: TransparencyNextStepsProps) {
  const { intro, showProjects } = nextStepCopy[current];
  const otherPillars = transparencyPillars.filter((pillar) => pillar.id !== current);

  return (
    <Card className="mt-10 border-primary/20 bg-muted/30">
      <CardHeader>
        <CardTitle className="text-base">گام بعدی</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{intro}</p>
        <div className="flex flex-wrap gap-3">
          {otherPillars.map((pillar) => (
            <Button key={pillar.id} variant="outline" asChild>
              <Link href={pillar.href}>{pillar.title}</Link>
            </Button>
          ))}
          {showProjects && (
            <Button asChild>
              <Link href="/projects">مشاهده پروژه‌ها</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
