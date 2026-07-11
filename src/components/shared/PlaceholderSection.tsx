import { Card, CardContent } from "@/components/ui/card";

interface PlaceholderSectionProps {
  title: string;
  description: string;
}

export function PlaceholderSection({ title, description }: PlaceholderSectionProps) {
  return (
    <Card>
      <CardContent className="flex min-h-[200px] flex-col items-center justify-center p-8 text-center">
        <p className="text-lg font-medium">{title}</p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <p className="mt-4 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          به‌زودی
        </p>
      </CardContent>
    </Card>
  );
}
