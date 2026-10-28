import { redirect } from "next/navigation";
import { getReviewer } from "@/lib/auth";
import { getDemoAdminData } from "@/lib/data/reports";
import { formatDate, t } from "@/lib/i18n/core";
import { getLang } from "@/lib/i18n/server";
import {
  assignReportAction,
  createStaffAction,
  escalateReportAction,
  resolveEscalationAction,
  updateStaffAction,
} from "@/app/admin/actions";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [reviewer, lang, params] = await Promise.all([getReviewer(), getLang(), searchParams]);
  if (!reviewer || !reviewer.demo || reviewer.role !== "admin") redirect("/review");

  const { reports, staff, audit } = getDemoAdminData();
  const reviewers = staff.filter((member) => member.role === "reviewer" && member.active);
  const openReports = reports.filter(
    (report) => report.review_status === "pending" || report.review_status === "needs_more_info",
  );

  return (
    <div>
      <header className="border-b border-line bg-surface">
        <div className="w-full px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="tag text-ink-faint">{t(lang, "nav.admin")}</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="max-w-[16ch] text-[clamp(2rem,5vw,3.5rem)]">{t(lang, "admin.title")}</h1>
              <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-ink-soft">{t(lang, "admin.intro")}</p>
            </div>
            <span className="pill bg-signal-soft text-partial">{t(lang, "common.demoLabel")}</span>
          </div>
          <p className="mt-5 max-w-[70ch] border-t border-line pt-4 text-xs leading-relaxed text-ink-faint">
            {t(lang, "admin.memoryNotice")}
          </p>
        </div>
      </header>

      {params.error ? (
        <p role="alert" className="mx-4 mt-6 rounded-control border border-no/25 bg-no-soft px-4 py-3 text-sm text-no sm:mx-6 lg:mx-8">
          {t(lang, `admin.error.${params.error}` as "admin.error.staff" | "admin.error.last-admin" | "admin.error.assignment" | "admin.error.escalation" | "admin.error.resolution")}
        </p>
      ) : null}

      <div className="grid gap-12 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)] lg:px-8 lg:py-14">
        <div className="min-w-0 space-y-12">
          <section aria-labelledby="reports-heading">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-3">
              <h2 id="reports-heading" className="text-2xl">{t(lang, "admin.reports")}</h2>
              <span className="tag tabular text-ink-faint">{openReports.length} {t(lang, "admin.open")}</span>
            </div>
            {reports.length === 0 ? (
              <p className="py-8 text-sm text-ink-faint">{t(lang, "admin.noReports")}</p>
            ) : (
              <ul className="list-none divide-y divide-line border-y border-line bg-surface">
                {reports.map((report) => {
                  const open = report.review_status === "pending" || report.review_status === "needs_more_info";
                  return (
                    <li key={report.id} className="instrument-row px-4 py-5 sm:px-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{report.listing_name ?? t(lang, "review.proposedPlace")}</h3>
                          <p className="mt-1 text-xs text-ink-faint">
                            {t(lang, `status.${report.review_status}` as "status.pending" | "status.accepted" | "status.rejected" | "status.needs_more_info")}
                            {` · ${formatDate(report.submitted_at, lang)}`}
                          </p>
                        </div>
                        {report.escalated ? <span className="pill bg-no-soft text-no">{t(lang, "admin.escalated")}</span> : null}
                      </div>

                      {open ? (
                        <div className="mt-4 grid gap-4 border-t border-line pt-4 md:grid-cols-2">
                          <form action={assignReportAction} className="flex flex-wrap items-end gap-2">
                            <input type="hidden" name="reportId" value={report.id} />
                            <div className="min-w-0 flex-1">
                              <label className="tag mb-1.5 block text-ink-faint" htmlFor={`assign-${report.id}`}>{t(lang, "admin.assignee")}</label>
                              <select id={`assign-${report.id}`} name="assignedTo" defaultValue={report.assigned_to ?? ""} className="field min-h-10 text-sm">
                                <option value="">{t(lang, "admin.unassigned")}</option>
                                {reviewers.map((member) => <option key={member.id} value={member.id}>{member.display_name}</option>)}
                              </select>
                            </div>
                            <button className="btn btn-secondary min-h-10 px-3 text-sm" type="submit">{t(lang, "admin.assign")}</button>
                          </form>

                          {!report.escalated ? (
                            <form action={escalateReportAction} className="flex flex-wrap items-end gap-2">
                              <input type="hidden" name="reportId" value={report.id} />
                              <div className="min-w-0 flex-1">
                                <label className="tag mb-1.5 block text-ink-faint" htmlFor={`escalate-${report.id}`}>{t(lang, "admin.escalationReason")}</label>
                                <input id={`escalate-${report.id}`} name="reason" required maxLength={500} className="field min-h-10 text-sm" />
                              </div>
                              <button className="btn btn-secondary min-h-10 px-3 text-sm" type="submit">{t(lang, "admin.escalate")}</button>
                            </form>
                          ) : (
                            <form action={resolveEscalationAction} className="flex flex-wrap items-end gap-2">
                              <input type="hidden" name="reportId" value={report.id} />
                              <div className="min-w-0 flex-1">
                                <label className="tag mb-1.5 block text-ink-faint" htmlFor={`resolve-${report.id}`}>{t(lang, "admin.resolution")}</label>
                                <input id={`resolve-${report.id}`} name="resolution" required maxLength={500} className="field min-h-10 text-sm" />
                              </div>
                              <button className="btn btn-secondary min-h-10 px-3 text-sm" type="submit">{t(lang, "admin.resolve")}</button>
                            </form>
                          )}
                        </div>
                      ) : (
                        <p className="mt-2 text-xs text-ink-faint">{t(lang, "admin.assignedTo")}: {report.assigned_to_name ?? t(lang, "admin.unassigned")}</p>
                      )}
                      {report.escalated && report.escalation_reason ? (
                        <p className="mt-3 rounded-control bg-no-soft px-3 py-2 text-sm text-no">{report.escalation_reason}</p>
                      ) : null}
                      {report.escalation_resolution ? (
                        <p className="mt-3 text-sm text-ink-soft">{t(lang, "admin.resolvedNote")}: {report.escalation_resolution}</p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section aria-labelledby="audit-heading">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-3">
              <h2 id="audit-heading" className="text-2xl">{t(lang, "admin.audit")}</h2>
              <span className="tag tabular text-ink-faint">{audit.length}</span>
            </div>
            {audit.length === 0 ? (
              <p className="py-8 text-sm text-ink-faint">{t(lang, "admin.noAudit")}</p>
            ) : (
              <ol className="list-none divide-y divide-line">
                {audit.map((event) => (
                  <li key={event.id} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr_auto] sm:items-baseline">
                    <time className="tabular text-xs text-ink-faint">{formatDate(event.created_at, lang)}</time>
                    <span className="text-sm">{t(lang, `admin.action.${event.action}` as "admin.action.staff_created" | "admin.action.staff_updated" | "admin.action.report_assigned" | "admin.action.report_unassigned" | "admin.action.report_escalated" | "admin.action.escalation_resolved" | "admin.action.observation_accept" | "admin.action.observation_accept_edited" | "admin.action.observation_reject" | "admin.action.observation_need_info")}</span>
                    <span className="truncate text-xs text-ink-faint">{event.reason ?? event.actor_name}</span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <aside className="space-y-10">
          <section aria-labelledby="staff-heading">
            <div className="border-b border-line pb-3">
              <h2 id="staff-heading" className="text-2xl">{t(lang, "admin.staff")}</h2>
              <p className="mt-2 text-xs leading-relaxed text-ink-faint">{t(lang, "admin.staffNotice")}</p>
            </div>
            <ul className="list-none divide-y divide-line border-y border-line bg-surface px-4">
              {staff.map((member) => (
                <li key={member.id} className="py-4">
                  <form action={updateStaffAction} className="grid gap-3">
                    <input type="hidden" name="staffId" value={member.id} />
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{member.display_name}</span>
                      <span className={`pill ${member.active ? "bg-yes-soft text-yes" : "bg-surface-muted text-ink-faint"}`}>{member.active ? t(lang, "admin.active") : t(lang, "admin.inactive")}</span>
                    </div>
                    <div className="grid grid-cols-1 items-end gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                      <div>
                        <label className="tag mb-1.5 block text-ink-faint" htmlFor={`role-${member.id}`}>{t(lang, "admin.role")}</label>
                        <select id={`role-${member.id}`} name="role" defaultValue={member.role} disabled={member.id === "demo-reviewer"} className="field min-h-10 text-sm">
                          <option value="reviewer">{t(lang, "admin.reviewerRole")}</option>
                          <option value="admin">{t(lang, "admin.adminRole")}</option>
                        </select>
                      </div>
                      <div>
                        <label className="tag mb-1.5 block text-ink-faint" htmlFor={`active-${member.id}`}>{t(lang, "admin.status")}</label>
                        <select id={`active-${member.id}`} name="active" defaultValue={String(member.active)} disabled={member.id === "demo-reviewer"} className="field min-h-10 text-sm">
                          <option value="true">{t(lang, "admin.active")}</option>
                          <option value="false">{t(lang, "admin.inactive")}</option>
                        </select>
                      </div>
                      <button type="submit" disabled={member.id === "demo-reviewer"} className="btn btn-secondary min-h-10 px-3 text-sm">{t(lang, "admin.save")}</button>
                    </div>
                  </form>
                </li>
              ))}
            </ul>
            <form action={createStaffAction} className="mt-5 grid gap-3 border-t border-line pt-5">
              <h3 className="font-semibold">{t(lang, "admin.addStaff")}</h3>
              <label className="sr-only" htmlFor="new-staff-name">{t(lang, "admin.name")}</label>
              <input id="new-staff-name" name="displayName" required maxLength={80} className="field" placeholder={t(lang, "admin.namePlaceholder")} />
              <div className="flex gap-2">
                <label className="sr-only" htmlFor="new-staff-role">{t(lang, "admin.role")}</label>
                <select id="new-staff-role" name="role" className="field">
                  <option value="reviewer">{t(lang, "admin.reviewerRole")}</option>
                  <option value="admin">{t(lang, "admin.adminRole")}</option>
                </select>
                <button type="submit" className="btn btn-primary shrink-0 px-4">{t(lang, "admin.add")}</button>
              </div>
            </form>
          </section>
        </aside>
      </div>
    </div>
  );
}
