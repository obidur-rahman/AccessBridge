import { NextResponse } from "next/server";
import { getReviewer } from "@/lib/auth";
import { decideReport, isDecision } from "@/lib/data/reports";

/**
 * Reviewer decision endpoint. Authorization comes from the database session,
 * never from the request body, and the audit event is written with the decision.
 */
export async function POST(request: Request) {
  const reviewer = await getReviewer();
  if (!reviewer) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "unsupported_media_type" }, { status: 415 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { id, decision, reason, edits } = body as Record<string, unknown>;

  if (typeof id !== "string" || id.length === 0 || id.length > 64) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  if (!isDecision(decision)) {
    return NextResponse.json({ error: "invalid_decision" }, { status: 400 });
  }

  if (edits !== undefined && (edits === null || typeof edits !== "object" || Array.isArray(edits))) {
    return NextResponse.json({ error: "invalid_edits" }, { status: 400 });
  }

  const result = await decideReport({
    id,
    reviewer,
    decision,
    reason: typeof reason === "string" ? reason : "",
    edits,
  });

  if (!result.ok) {
    const status = result.error === "reason_required" ? 422 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ ok: true });
}
