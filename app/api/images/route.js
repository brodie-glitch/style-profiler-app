import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { isAuthed } from "../../../lib/auth";

export async function GET() {
  const images = await prisma.image.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(images);
}

export async function POST(req) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { url, styles, attrs, note } = body;
  if (!url || !Array.isArray(styles) || styles.length === 0) {
    return NextResponse.json({ error: "Image URL and at least one style tag are required." }, { status: 400 });
  }
  const image = await prisma.image.create({
    data: {
      url,
      styles: JSON.stringify(styles),
      attrs: JSON.stringify(Array.isArray(attrs) ? attrs : []),
      note: note || null,
    },
  });
  return NextResponse.json(image, { status: 201 });
}
