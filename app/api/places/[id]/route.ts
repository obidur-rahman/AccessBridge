import { NextResponse } from "next/server";
import { getPlace } from "@/lib/data/places";

/**
 * Public place details for one listing. This uses the same public read model
 * as the place page, so pending reports and staff fields never appear.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const result = await getPlace(id);

  if (!result.ok) {
    return NextResponse.json({ error: "read_failed" }, { status: 500 });
  }

  if (!result.place) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ place: result.place });
}
