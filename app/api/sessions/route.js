import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "../../../lib/db";
import { isAuthed } from "../../../lib/auth";

// List sessions + their results (designer dashboard)
export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sessions = await prisma.session.findMany({
    orderBy: { createdAt: "desc" },
    include: { result: true },
  });
  return NextResponse.json(sessions);
}

// Create a shareable client link
export async function POST(req) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { clientName } = await req.json().catch(() => ({}));
  const token = randomBytes(9).toString("base64url");
  const session = await prisma.session.create({
    data: { token, clientName: clientName || null },
  });
  return NextResponse.json(session, { status: 201 });
}
