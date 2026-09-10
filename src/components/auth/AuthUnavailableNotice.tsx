import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AuthUnavailableNotice({
  title,
}: {
  title: string;
}) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="leading-relaxed">
          ثبت‌نام و ورود سرمایه‌گذار در نسخه فعلی فعال نیست. می‌توانید طرح‌ها و
          صفحه شفافیت را مرور کنید؛ برای اعلام آمادگی با دفتر آوید تماس بگیرید.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button asChild className="w-full">
          <Link href="/contact">تماس با دفتر آوید</Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/projects">مشاهده پروژه‌ها</Link>
        </Button>
      </CardContent>
      <CardFooter className="justify-center border-t pt-4">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          بازگشت به صفحه اصلی
        </Link>
      </CardFooter>
    </Card>
  );
}
