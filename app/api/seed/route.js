import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { isAuthed } from "../../../lib/auth";

const seedDefs = [
  [10, ["Minimalist", "Scandinavian"], ["Neutral palette", "Clean lines", "Open & airy"]],
  [20, ["Industrial", "Contemporary"], ["Stone/concrete", "Cool tones", "Clean lines"]],
  [30, ["Bohemian", "Maximalist"], ["Bold color", "Cozy & layered", "Lots of greenery"]],
  [40, ["Mid-century modern"], ["Warm tones", "Wood-heavy", "Clean lines"]],
  [50, ["Farmhouse", "Rustic"], ["Natural materials", "Wood-heavy", "Cozy & layered"]],
  [60, ["Coastal", "Mediterranean"], ["Cool tones", "Open & airy", "Soft textiles"]],
  [70, ["Japandi", "Minimalist"], ["Neutral palette", "Natural materials", "Open & airy"]],
  [80, ["Art Deco", "Traditional"], ["Ornate detail", "Bold color", "Warm tones"]],
  [90, ["Brutalist", "Industrial"], ["Stone/concrete", "Monochrome", "Cool tones"]],
  [100, ["Scandinavian", "Contemporary"], ["Neutral palette", "Soft textiles", "Clean lines"]],
  [110, ["Maximalist", "Traditional"], ["Ornate detail", "Bold color", "Cozy & layered"]],
  [120, ["Mid-century modern", "Contemporary"], ["Wood-heavy", "Warm tones", "Clean lines"]],
];

// Admin-only: load the 12 sample images. Safe to call; skips if library has items.
export async function POST() {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const count = await prisma.image.count();
  if (count > 0) return NextResponse.json({ added: 0, message: "Library already has images." });
  for (const [s, styles, attrs] of seedDefs) {
    await prisma.image.create({
      data: {
        url: `https://picsum.photos/seed/sp${s}/800/800`,
        styles: JSON.stringify(styles),
        attrs: JSON.stringify(attrs),
        note: "Sample image — replace with your own",
      },
    });
  }
  return NextResponse.json({ added: seedDefs.length });
}
