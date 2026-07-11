import {
  AvidDocumentRecord,
  AVID_DOCUMENT_TYPE_LABELS,
  AVID_DOCUMENT_VISIBILITY_LABELS,
} from "@/types/document";
import { FileText } from "lucide-react";

interface AvidDocumentListProps {
  documents: AvidDocumentRecord[];
  showVisibility?: boolean;
  emptyMessage?: string;
}

export function AvidDocumentList({
  documents,
  showVisibility = false,
  emptyMessage = "سندی برای نمایش وجود ندارد.",
}: AvidDocumentListProps) {
  if (documents.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <ul className="divide-y rounded-md border">
      {documents.map((doc) => (
        <li
          key={doc.id}
          className="flex flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-start sm:gap-3"
        >
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{doc.title}</p>
              {doc.projectTitle && (
                <span className="text-xs text-muted-foreground">
                  — {doc.projectTitle}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {AVID_DOCUMENT_TYPE_LABELS[doc.documentType]} ·{" "}
              {new Date(doc.documentDate).toLocaleDateString("fa-IR")}
            </p>
            {doc.notes && (
              <p className="text-xs text-muted-foreground">{doc.notes}</p>
            )}
            {showVisibility && (
              <p className="text-xs text-muted-foreground">
                سطح دسترسی: {AVID_DOCUMENT_VISIBILITY_LABELS[doc.visibility]}
              </p>
            )}
          </div>
          <div className="shrink-0 text-left text-xs text-muted-foreground sm:text-right">
            <span className="rounded border bg-muted/40 px-2 py-1">
              نسخه نمایشی
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
