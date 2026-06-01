import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";

// Public: fetch a single result (so a client can see their own profile).
export async function GET(req, { params }) {
  const r = await prisma.result.findUnique({ where: { id: params.id } });
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // `liked` is stored as image IDs. Resolve them to URLs for the gallery.
  // (Falls back gracefully if an entry is already a URL from an older result.)
  const likedEntries = JSON.parse(r.liked || "[]");
  const ids = likedEntries.filter((e) => typeof e === "string" && !e.startsWith("http") && !e.startsWith("data:"));
  let likedUrls = likedEntries.filter((e) => typeof e === "string" && (e.startsWith("http") || e.startsWith("data:")));
  if (ids.length) {
    const imgs = await prisma.image.findMany({ where: { id: { in: ids } } });
    const byId = new Map(imgs.map((im) => [im.id, im.url]));
    likedUrls = likedUrls.concat(ids.map((id) => byId.get(id)).filter(Boolean));
  }

  return NextResponse.json({
    id: r.id,
    clientName: r.clientName,
    profile: JSON.parse(r.profile),
    liked: likedUrls,
    ratedCount: r.ratedCount,
    likedCount: r.likedCount,
    createdAt: r.createdAt,
  });
}
