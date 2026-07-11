import { ProjectPaymentInstructions } from "@/types/payment";
import { formatToman } from "@/lib/utils";

interface PaymentInstructionsCardProps {
  instructions: ProjectPaymentInstructions;
  requestedAmount: number;
  projectTitle?: string;
}

function formatDeadline(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("fa-IR", {
    dateStyle: "long",
  });
}

export function PaymentInstructionsCard({
  instructions,
  requestedAmount,
  projectTitle,
}: PaymentInstructionsCardProps) {
  return (
    <div className="space-y-3 rounded-md border border-emerald-200 bg-emerald-50/60 p-4 text-sm">
      <div>
        <p className="font-medium text-emerald-900">اطلاعات واریز به حساب پروژه</p>
        {projectTitle && (
          <p className="mt-0.5 text-xs text-emerald-800">{projectTitle}</p>
        )}
      </div>

      <p className="text-xs leading-relaxed text-emerald-900/90">
        پرداخت باید مستقیماً به حساب معرفی‌شده برای این پروژه انجام شود.
        آوید هیچ وجهی دریافت نمی‌کند، درگاه پرداخت آنلاین ندارد، و پول از
        طریق سامانه آوید عبور نمی‌کند.
      </p>

      <dl className="grid gap-2.5 text-sm">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
          <dt className="text-muted-foreground">مبلغ قابل واریز</dt>
          <dd className="font-semibold">{formatToman(requestedAmount)}</dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
          <dt className="text-muted-foreground">صاحب حساب</dt>
          <dd className="font-medium">{instructions.accountHolder}</dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
          <dt className="text-muted-foreground">نام بانک</dt>
          <dd className="font-medium">{instructions.bankName}</dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
          <dt className="text-muted-foreground">شماره حساب / شبا</dt>
          <dd className="font-mono text-xs font-medium" dir="ltr">
            {instructions.accountNumberOrIban}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
          <dt className="text-muted-foreground">مهلت واریز</dt>
          <dd className="font-medium">
            تا {formatDeadline(instructions.paymentDeadline)}
          </dd>
        </div>
        <div className="border-t border-emerald-200/80 pt-2">
          <dt className="text-muted-foreground">دستورالعمل واریز</dt>
          <dd className="mt-1 leading-relaxed">{instructions.instructionNote}</dd>
        </div>
      </dl>

      <p className="text-xs text-muted-foreground">
        پس از واریز، در مرحله بعد امکان ثبت رسید پرداخت فراهم می‌شود.
      </p>
    </div>
  );
}
