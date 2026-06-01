import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";

// Public: fetch a single result (so a client can see their own profile).
export async function GET(req, { params }) {
  const r = await prisma.result.findUnique({ where: { id: params.id } });
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    id: r.id,
    clientName: r.clientName,
    profile: JSON.parse(r.profile),
    liked: JSON.parse(r.liked),
    ratedCount: r.ratedCount,
    likedCount: r.likedCount,
    createdAt: r.createdAt,
  });
}
