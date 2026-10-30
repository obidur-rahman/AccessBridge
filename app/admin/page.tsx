import { redirect } from "next/navigation";
import { getReviewer } from "@/lib/auth";
import { getDemoAdminSnapshot } from "@/lib/data/demo";
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

  const { reports, staff, audit } = getDemoAdminSnapshot();
  const reviewers = staff.filter((member) => member.role === "reviewer" && member.active);
  const openReports = reports.filter(
    (report) => report.review_status === "pending" || report.review_status === "needs_more_info",
  );

  return (
    <div>
      <header className="sheet pb-4 pt-3 sm:pt-4">
        <span className="pill bg-signal-soft text-signal">{t(lang, "common.demoLabel")}</span>
        <h1 className="mt-1 text-[clamp(1.9rem,4.4vw,2.7rem)]">{t(lang, "admin.title")}</h1>
        <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-ink-soft">
          {t(lang, "admin.intro")}
        </p>
        <p className="mt-2 max-w-[70ch] text-xs leading-relaxed text-ink-faint">
          {t(lang, "admin.memoryNotice")}
        </p>
      </header>

      {params.error ? (
        <p
          role="alert"
          className="sheet mb-4 rounded-[0.625rem] border border-no/30 bg-no-soft px-4 py-2.5 text-sm text-no"
        >
          {t(lang, `admin.error.${params.error}` as "admin.error.staff" | "admin.error.last-admin" | "admin.error.assignment" | "admin.error.escalation" | "admin.error.resolution")}
        </p>
      ) : null}

      <div className="sheet grid gap-6 pb-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)] lg:items-start">
        <div className="min-w-0 space-y-6">
          <section aria-labelledby="reports-heading">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="reports-heading" className="text-[1.3rem]">
                {t(lang, "admin.reports")}
              </h2>
              <span className="tag tabular text-ink-faint">
                {openReports.length} {t(lang, "admin.open")}
              </span>
            </div>

            {reports.length === 0 ? (
              <p className="card mt-2 p-5 text-sm text-ink-faint">{t(lang, "admin.noReports")}</p>
            ) : (
              <ul className="mt-2 grid list-none gap-2.5">
                {reports.map((report) => {
                  const open =
                    report.review_status === "pending" || report.review_status === "needs_more_info";
                  return (
                    <li key={report.id} className="card p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display text-[1.15rem] font-medium leading-snug">
                            {report.listing_name ?? t(lang, "review.proposedPlace")}
                          </h3>
                          <p className="mt-0.5 text-xs text-ink-faint">
                            {t(lang, `status.${report.review_status}` as "status.pending" | "status.accepted" | "status.rejected" | "status.needs_more_info")}
                            {` · ${formatDate(report.submitted_at, lang)}`}
                          </p>
                        </div>
                        {report.escalated ? (
                          <span className="pill bg-no-soft text-no">{t(lang, "admin.escalated")}</span>
                        ) : null}
                      </div>

                      {open ? (
                        <div className="mt-3 grid gap-3 border-t border-line pt-3 md:grid-cols-2">
                          <form action={assignReportAction} className="flex flex-wrap items-end gap-2">
                            <input type="hidden" name="reportId" value={report.id} />
                            <div className="min-w-0 flex-1">
                              <label className="tag mb-1 block text-ink-faint" htmlFor={`assign-${report.id}`}>
                                {t(lang, "admin.assignee")}
                              </label>
                              <select
                                id={`assign-${report.id}`}
                                name="assignedTo"
                                defaultValue={report.assigned_to ?? ""}
                                className="field min-h-9 py-1.5 text-sm"
                              >
                                <option value="">{t(lang, "admin.unassigned")}</option>
                                {reviewers.map((member) => (
                                  <option key={member.id} value={member.id}>
                                    {member.display_name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <button className="btn btn-secondary min-h-9 px-3 text-sm" type="submit">
                              {t(lang, "admin.assign")}
                            </button>
                          </form>

                          {!report.escalated ? (
                            <form action={escalateReportAction} className="flex flex-wrap items-end gap-2">
                              <input type="hidden" name="reportId" value={report.id} />
                              <div className="min-w-0 flex-1">
                                <label className="tag mb-1 block text-ink-faint" htmlFor={`escalate-${report.id}`}>
                                  {t(lang, "admin.escalationReason")}
                                </label>
                                <input
                                  id={`escalate-${report.id}`}
                                  name="reason"
                                  required
                                  maxLength={500}
                                  className="field min-h-9 py-1.5 text-sm"
                                />
                              </div>
                              <button className="btn btn-secondary min-h-9 px-3 text-sm" type="submit">
                                {t(lang, "admin.escalate")}
                              </button>
                            </form>
                          ) : (
                            <form action={resolveEscalationAction} className="flex flex-wrap items-end gap-2">
                              <input type="hidden" name="reportId" value={report.id} />
                              <div className="min-w-0 flex-1">
                                <label className="tag mb-1 block text-ink-faint" htmlFor={`resolve-${report.id}`}>
                                  {t(lang, "admin.resolution")}
                                </label>
                                <input
                                  id={`resolve-${report.id}`}
                                  name="resolution"
                                  required
                                  maxLength={500}
                                  className="field min-h-9 py-1.5 text-sm"
                                />
                              </div>
                              <button className="btn btn-secondary min-h-9 px-3 text-sm" type="submit">
                                {t(lang, "admin.resolve")}
                              </button>
                            </form>
                          )}
                        </div>
                      ) : (
                        <p className="mt-1 text-xs text-ink-faint">
                          {t(lang, "admin.assignedTo")}:{" "}
                          {report.assigned_to_name ?? t(lang, "admin.unassigned")}
                        </p>
                      )}

                      {report.escalated && report.escalation_reason ? (
                        <p className="mt-2 rounded-[0.5rem] bg-no-soft px-3 py-2 text-sm text-no">
                          {report.escalation_reason}
                        </p>
                      ) : null}
                      {report.escalation_resolution ? (
                        <p className="mt-2 text-sm text-ink-soft">
                          {t(lang, "admin.resolvedNote")}: {report.escalation_resolution}
                        </p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section aria-labelledby="audit-heading">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="audit-heading" className="text-[1.3rem]">
                {t(lang, "admin.audit")}
              </h2>
              <span className="tag tabular text-ink-faint">{audit.length}</span>
            </div>
            {audit.length === 0 ? (
              <p className="card mt-2 p-5 text-sm text-ink-faint">{t(lang, "admin.noAudit")}</p>
            ) : (
              <ol className="card mt-2 list-none divide-y divide-line px-4">
                {audit.map((event) => (
                  <li
                    key={event.id}
                    className="grid gap-0.5 py-2.5 sm:grid-cols-[8rem_1fr_auto] sm:items-baseline"
                  >
                    <time className="tabular text-xs text-ink-faint">
                      {formatDate(event.created_at, lang)}
                    </time>
                    <span className="text-sm">
                      {t(lang, `admin.action.${event.action}` as "admin.action.staff_created" | "admin.action.staff_updated" | "admin.action.report_assigned" | "admin.action.report_unassigned" | "admin.action.report_escalated" | "admin.action.escalation_resolved" | "admin.action.observation_accept" | "admin.action.observation_accept_edited" | "admin.action.observation_reject" | "admin.action.observation_need_info")}
                    </span>
                    <span className="truncate text-xs text-ink-faint">
                      {event.reason ?? event.actor_name}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <section aria-labelledby="staff-heading" className="card p-4">
            <h2 id="staff-heading" className="text-[1.3rem]">
              {t(lang, "admin.staff")}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-ink-faint">{t(lang, "admin.staffNotice")}</p>

            <ul className="mt-2 list-none divide-y divide-line">
              {staff.map((member) => (
                <li key={member.id} className="py-3">
                  <form action={updateStaffAction} className="grid gap-2">
                    <input type="hidden" name="staffId" value={member.id} />
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold">{member.display_name}</span>
                      <span
                        className={`pill ${member.active ? "bg-yes-soft text-yes" : "bg-surface-muted text-ink-faint"}`}
                      >
                        {member.active ? t(lang, "admin.active") : t(lang, "admin.inactive")}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 items-end gap-1.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                      <div>
                        <label className="tag mb-1 block text-ink-faint" htmlFor={`role-${member.id}`}>
                          {t(lang, "admin.role")}
                        </label>
                        <select
                          id={`role-${member.id}`}
                          name="role"
                          defaultValue={member.role}
                          disabled={member.id === "demo-reviewer"}
                          className="field min-h-9 py-1.5 text-sm"
                        >
                          <option value="reviewer">{t(lang, "admin.reviewerRole")}</option>
                          <option value="admin">{t(lang, "admin.adminRole")}</option>
                        </select>
                      </div>
                      <div>
                        <label className="tag mb-1 block text-ink-faint" htmlFor={`active-${member.id}`}>
                          {t(lang, "admin.status")}
                        </label>
                        <select
                          id={`active-${member.id}`}
                          name="active"
                          defaultValue={String(member.active)}
                          disabled={member.id === "demo-reviewer"}
                          className="field min-h-9 py-1.5 text-sm"
                        >
                          <option value="true">{t(lang, "admin.active")}</option>
                          <option value="false">{t(lang, "admin.inactive")}</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={member.id === "demo-reviewer"}
                        className="btn btn-secondary min-h-9 px-3 text-sm"
                      >
                        {t(lang, "admin.save")}
                      </button>
                    </div>
                  </form>
                </li>
              ))}
            </ul>
          </section>

          <section className="card p-4">
            <form action={createStaffAction} className="grid gap-2.5">
              <h2 className="text-[1.15rem]">{t(lang, "admin.addStaff")}</h2>
              <label className="sr-only" htmlFor="new-staff-name">
                {t(lang, "admin.name")}
              </label>
              <input
                id="new-staff-name"
                name="displayName"
                required
                maxLength={80}
                className="field"
                placeholder={t(lang, "admin.namePlaceholder")}
              />
              <div className="flex gap-2">
                <label className="sr-only" htmlFor="new-staff-role">
                  {t(lang, "admin.role")}
                </label>
                <select id="new-staff-role" name="role" className="field">
                  <option value="reviewer">{t(lang, "admin.reviewerRole")}</option>
                  <option value="admin">{t(lang, "admin.adminRole")}</option>
                </select>
                <button type="submit" className="btn btn-primary shrink-0 px-4">
                  {t(lang, "admin.add")}
                </button>
              </div>
            </form>
          </section>
        </aside>
      </div>
    </div>
  );
}
