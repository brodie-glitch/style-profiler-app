import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { isAuthed } from "../../../lib/auth";

async function getSettings() {
  return prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, ratingsCount: 30 },
  });
}

export async function GET() {
  const s = await getSettings();
  return NextResponse.json(s);
}

export async function PUT(req) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { ratingsCount } = await req.json().catch(() => ({}));
  const n = Math.max(5, Math.min(200, parseInt(ratingsCount) || 30));
  const s = await prisma.setting.upsert({
    where: { id: 1 },
    update: { ratingsCount: n },
    create: { id: 1, ratingsCount: n },
  });
  return NextResponse.json(s);
}
