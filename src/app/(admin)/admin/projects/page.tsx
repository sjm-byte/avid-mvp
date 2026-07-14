import { AdminProjectsExcelTable } from "./AdminProjectsExcelTable";
import { mapProjectOpsToTableRows } from "@/lib/data/admin-project-table";
import { getAllProjectOps } from "@/lib/data/mock/project-ops-store";

export default async function AdminProjectsPage() {
  const projects = await getAllProjectOps();
  const rows = mapProjectOpsToTableRows(projects);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">مدیریت پروژه‌ها</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          نمای جدولی مشارکت‌ها — ویرایش، گزارش وضعیت و تسویه از صفحه «مدیریت»
          هر پروژه. داده‌ها با داشبورد سرمایه‌گذار همگام است.
        </p>
      </div>

      <AdminProjectsExcelTable rows={rows} />
    </div>
  );
}
