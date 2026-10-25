import { NextResponse } from "next/server";
import { submitReport } from "@/lib/data/reports";
import { todayIso } from "@/lib/i18n/core";
import { validateReport } from "@/lib/validation/report";

const MAX_BODY_BYTES = 20_000;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 5;

/**
 * Best-effort in-memory rate limit. It protects a single server instance only,
 * which is enough for the free-tier pilot. Replace with a shared limiter if the
 * app is ever deployed across several instances.
 */
const RATE_STORE = Symbol.for("accessbridge.rateLimit");

type RateStore = Map<string, number[]>;

function rateStore(): RateStore {
  const holder = globalThis as unknown as Record<symbol, RateStore | undefined>;
  if (!holder[RATE_STORE]) holder[RATE_STORE] = new Map();
  return holder[RATE_STORE] as RateStore;
}

function isRateLimited(key: string, now: number): boolean {
  const store = rateStore();
  const recent = (store.get(key) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX_REQUESTS) {
    store.set(key, recent);
    return true;
  }
  recent.push(now);
  store.set(key, recent);
  return false;
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "unsupported_media_type" }, { status: 415 });
  }

  if (isRateLimited(clientKey(request), Date.now())) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const validation = validateReport(body, todayIso());
  if (!validation.ok) {
    return NextResponse.json({ error: "validation_failed", errors: validation.errors }, { status: 422 });
  }

  const result = await submitReport(validation.value);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  // The receipt is the only identifier a visitor receives. Internal IDs stay private.
  return NextResponse.json({ receipt: result.receipt }, { status: 201 });
}
