import { getAllProjectOps } from "@/lib/data/mock/project-ops-store";
import {
  ActiveProjectUpdateItem,
  SettlementOutlook,
  UpdateMediaKind,
} from "@/lib/data/mock/active-project-updates-mock";

/** Latest status report per active project from shared project-ops store. */
export async function getActiveProjectUpdatesFromOps(): Promise<
  ActiveProjectUpdateItem[]
> {
  const projects = await getAllProjectOps();
  const items: ActiveProjectUpdateItem[] = [];

  for (const project of projects) {
    if (project.lifecycle !== "active") continue;
    const latest = project.reports[0];
    if (!latest) continue;

    items.push({
      id: latest.id,
      projectId: project.id,
      projectSlug: project.slug,
      projectName: project.title,
      updateTitle: latest.title,
      updateDate: latest.reportDate,
      shortStatus: latest.shortStatus,
      settlementOutlook: latest.settlementOutlook as SettlementOutlook,
      adminNote: latest.adminNote,
      media:
        latest.mediaKind && latest.mediaLabel
          ? {
              kind: latest.mediaKind as UpdateMediaKind,
              label: latest.mediaLabel,
            }
          : null,
    });
  }

  return items.sort(
    (a, b) =>
      new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime(),
  );
}
