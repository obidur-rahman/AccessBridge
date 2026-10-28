"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getReviewer } from "@/lib/auth";
import {
  assignDemoReport,
  createDemoStaff,
  escalateDemoReport,
  resolveDemoEscalation,
  updateDemoStaff,
} from "@/lib/data/demo";
import type { DemoStaffRole } from "@/lib/types";

async function requireDemoAdmin() {
  const reviewer = await getReviewer();
  if (!reviewer || !reviewer.demo || reviewer.role !== "admin") redirect("/login");
  return reviewer;
}

function refreshAdmin() {
  revalidatePath("/admin");
  revalidatePath("/review");
}

export async function createStaffAction(formData: FormData) {
  await requireDemoAdmin();
  const name = String(formData.get("displayName") ?? "").trim().slice(0, 80);
  const role = formData.get("role");
  if (!name || (role !== "reviewer" && role !== "admin")) redirect("/admin?error=staff");
  createDemoStaff(name, role as DemoStaffRole);
  refreshAdmin();
  redirect("/admin");
}

export async function updateStaffAction(formData: FormData) {
  const actor = await requireDemoAdmin();
  const id = String(formData.get("staffId") ?? "");
  const role = formData.get("role");
  const activeValue = formData.get("active");
  if (activeValue !== "true" && activeValue !== "false") redirect("/admin?error=staff");
  const active = activeValue === "true";
  if (!id || (role !== "reviewer" && role !== "admin")) redirect("/admin?error=staff");
  const updated = updateDemoStaff(id, { role, active }, actor.id);
  if (!updated) redirect("/admin?error=last-admin");
  refreshAdmin();
  redirect("/admin");
}

export async function assignReportAction(formData: FormData) {
  const actor = await requireDemoAdmin();
  const reportId = String(formData.get("reportId") ?? "");
  const assignedTo = String(formData.get("assignedTo") ?? "");
  if (!reportId || !assignDemoReport(reportId, assignedTo || null, actor.id)) redirect("/admin?error=assignment");
  refreshAdmin();
  redirect("/admin");
}

export async function escalateReportAction(formData: FormData) {
  const actor = await requireDemoAdmin();
  const reportId = String(formData.get("reportId") ?? "");
  const reason = String(formData.get("reason") ?? "").trim().slice(0, 500);
  if (!reportId || !reason || !escalateDemoReport(reportId, reason, actor.id)) redirect("/admin?error=escalation");
  refreshAdmin();
  redirect("/admin");
}

export async function resolveEscalationAction(formData: FormData) {
  const actor = await requireDemoAdmin();
  const reportId = String(formData.get("reportId") ?? "");
  const resolution = String(formData.get("resolution") ?? "").trim().slice(0, 500);
  if (!reportId || !resolution || !resolveDemoEscalation(reportId, resolution, actor.id)) redirect("/admin?error=resolution");
  refreshAdmin();
  redirect("/admin");
}
