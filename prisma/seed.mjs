import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Sample library. Placeholder images load reliably so the app is demoable
// immediately; replace them with your own tagged photos in /admin.
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

async function main() {
  await prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, ratingsCount: 30 },
  });

  const count = await prisma.image.count();
  if (count === 0) {
    for (const [s, styles, attrs] of seedDefs) {
      await prisma.image.create({
        data: {
          url: `https://picsum.photos/seed/sp${s}/800/800`,
          styles: JSON.stringify(styles),
          attrs: JSON.stringify(attrs),
          note: "Sample image — replace in Admin",
        },
      });
    }
    console.log(`Seeded ${seedDefs.length} sample images.`);
  } else {
    console.log(`Library already has ${count} images; skipped seeding.`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
