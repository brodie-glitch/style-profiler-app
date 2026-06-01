import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { parseTags } from "../../../../lib/styles";

// Public: a client opens their link and gets a deck to rate.
export async function GET(req, { params }) {
  const session = await prisma.session.findUnique({
    where: { token: params.token },
    include: { result: true },
  });
  if (!session) return NextResponse.json({ error: "Link not found" }, { status: 404 });

  if (session.result) {
    return NextResponse.json({
      clientName: session.clientName,
      completed: true,
      resultId: session.result.id,
    });
  }

  const setting = await prisma.setting.findUnique({ where: { id: 1 } });
  const count = setting?.ratingsCount || 30;
  const all = await prisma.image.findMany();

  // shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  const deck = all.slice(0, count).map((im) => ({
    id: im.id,
    url: im.url,
    styles: parseTags(im.styles),
    attrs: parseTags(im.attrs),
  }));

  return NextResponse.json({
    clientName: session.clientName,
    completed: false,
    deck,
  });
}
