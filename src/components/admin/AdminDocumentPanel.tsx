"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createDocument } from "@/lib/actions/documents";
import {
  AvidDocumentRecord,
  AvidDocumentType,
  AvidDocumentVisibility,
  AVID_DOCUMENT_TYPE_LABELS,
  AVID_DOCUMENT_VISIBILITY_LABELS,
  DOCUMENT_CENTER_DISCLAIMER,
  INVESTOR_DOCUMENT_TYPES,
} from "@/types/document";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AvidDocumentList } from "@/components/documents/AvidDocumentList";

export interface DocumentProjectOption {
  id: string;
  title: string;
}

interface AdminDocumentPanelProps {
  projects: DocumentProjectOption[];
  documents: AvidDocumentRecord[];
}

const DOCUMENT_TYPES = Object.keys(
  AVID_DOCUMENT_TYPE_LABELS
) as AvidDocumentType[];

const VISIBILITY_OPTIONS = Object.keys(
  AVID_DOCUMENT_VISIBILITY_LABELS
) as AvidDocumentVisibility[];

export function AdminDocumentPanel({
  projects,
  documents,
}: AdminDocumentPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] =
    useState<AvidDocumentType>("project_document");
  const [visibility, setVisibility] =
    useState<AvidDocumentVisibility>("investor_only");
  const [documentDate, setDocumentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [filePlaceholder, setFilePlaceholder] = useState("");
  const [investorId, setInvestorId] = useState("");

  const showInvestorField = INVESTOR_DOCUMENT_TYPES.includes(documentType);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await createDocument({
        projectId,
        title,
        documentType,
        visibility,
        documentDate,
        notes,
        filePlaceholder,
        investorId: showInvestorField ? investorId : null,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess("سند با موفقیت ثبت شد.");
      setTitle("");
      setNotes("");
      setFilePlaceholder("");
      setInvestorId("");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-4 text-sm text-amber-900">
          {DOCUMENT_CENTER_DISCLAIMER}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">ثبت سند جدید</CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              پروژه‌ای برای ثبت سند وجود ندارد.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="doc-project">پروژه</Label>
                  <select
                    id="doc-project"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc-title">عنوان سند</Label>
                  <Input
                    id="doc-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc-type">نوع سند</Label>
                  <select
                    id="doc-type"
                    value={documentType}
                    onChange={(e) =>
                      setDocumentType(e.target.value as AvidDocumentType)
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    {DOCUMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {AVID_DOCUMENT_TYPE_LABELS[type]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc-visibility">سطح دسترسی</Label>
                  <select
                    id="doc-visibility"
                    value={visibility}
                    onChange={(e) =>
                      setVisibility(e.target.value as AvidDocumentVisibility)
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    {VISIBILITY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {AVID_DOCUMENT_VISIBILITY_LABELS[option]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc-date">تاریخ سند</Label>
                  <Input
                    id="doc-date"
                    type="date"
                    value={documentDate}
                    onChange={(e) => setDocumentDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc-placeholder">مسیر فایل نمایشی</Label>
                  <Input
                    id="doc-placeholder"
                    value={filePlaceholder}
                    onChange={(e) => setFilePlaceholder(e.target.value)}
                    placeholder="مثلاً قرارداد-پروژه.pdf"
                  />
                </div>
                {showInvestorField && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="doc-investor">شناسه سرمایه‌گذار (اختیاری)</Label>
                    <Input
                      id="doc-investor"
                      value={investorId}
                      onChange={(e) => setInvestorId(e.target.value)}
                      placeholder="شناسه سرمایه‌گذار (در حالت نمایشی)"
                    />
                    <p className="text-xs text-muted-foreground">
                      برای رسید یا تسویه، در صورت نیاز به محدودیت فردی وارد کنید.
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="doc-notes">یادداشت</Label>
                <Textarea
                  id="doc-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-emerald-700">{success}</p>}
              <Button type="submit" disabled={isPending}>
                {isPending ? "در حال ثبت…" : "ثبت سند"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-4 text-lg font-semibold">اسناد ثبت‌شده</h2>
        <AvidDocumentList documents={documents} showVisibility />
      </section>
    </div>
  );
}
