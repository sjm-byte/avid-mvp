import { AdminDocumentPanel } from "@/components/admin/AdminDocumentPanel";
import { getAllDocuments } from "@/lib/data/documents";
import { getPublicProjects } from "@/lib/data/projects";

export default async function AdminDocumentsPage() {
  const [projects, documents] = await Promise.all([
    getPublicProjects(),
    getAllDocuments(),
  ]);

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">مرکز اسناد</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ثبت و مدیریت اسناد پروژه، قراردادها و پیوست‌های مرتبط
        </p>
      </div>

      <AdminDocumentPanel
        projects={projects.map((p) => ({ id: p.id, title: p.title }))}
        documents={documents}
      />
    </div>
  );
}
