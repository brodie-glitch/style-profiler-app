import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { isAuthed } from "../../../../lib/auth";

export async function DELETE(req, { params }) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.image.delete({ where: { id: params.id } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
