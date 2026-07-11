import { ProjectDocumentRow } from "@/types/database";
import { FileText } from "lucide-react";

const DOC_TYPE_LABELS: Record<string, string> = {
  contract: "قرارداد",
  invoice: "فاکتور",
  report: "گزارش",
  image: "تصویر",
  video: "ویدیو",
  audit: "حسابرسی",
  other: "سایر",
};

interface DocumentListProps {
  documents: ProjectDocumentRow[];
}

export function DocumentList({ documents }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        هنوز سند عمومی برای این پروژه منتشر نشده است. پس از بارگذاری توسط تیم پروژه، اینجا نمایش داده می‌شود.
      </p>
    );
  }

  return (
    <ul className="divide-y rounded-md border">
      {documents.map((doc) => (
        <li
          key={doc.id}
          className="flex items-center gap-3 px-4 py-3 text-sm"
        >
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="flex-1">
            <p className="font-medium">{doc.title}</p>
            <p className="text-xs text-muted-foreground">
              {DOC_TYPE_LABELS[doc.document_type] ?? doc.document_type}
            </p>
          </div>
          <span className="text-xs text-muted-foreground">نسخه نمایشی</span>
        </li>
      ))}
    </ul>
  );
}
