import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { buildProfile, parseTags } from "../../../lib/styles";

// Public: a client submits their votes; we compute & store the profile.
// votes: [{ id, liked }]  — only image ids are sent, so the payload stays tiny
// even when images are large uploaded files. Tags are read from the database.
export async function POST(req) {
  const { token, votes } = await req.json().catch(() => ({}));
  if (!token || !Array.isArray(votes) || votes.length === 0) {
    return NextResponse.json({ error: "token and votes are required." }, { status: 400 });
  }
  const session = await prisma.session.findUnique({
    where: { token },
    include: { result: true },
  });
  if (!session) return NextResponse.json({ error: "Link not found" }, { status: 404 });
  if (session.result) {
    return NextResponse.json({ id: session.result.id }, { status: 200 });
  }

  const ids = votes.map((v) => v.id).filter(Boolean);
  const images = await prisma.image.findMany({ where: { id: { in: ids } } });
  const byId = new Map(images.map((im) => [im.id, im]));

  // Join votes to stored tags for the profile engine.
  const voteData = votes
    .filter((v) => byId.has(v.id))
    .map((v) => {
      const im = byId.get(v.id);
      return { styles: parseTags(im.styles), attrs: parseTags(im.attrs), liked: !!v.liked };
    });

  if (voteData.length === 0) {
    return NextResponse.json({ error: "No matching images found." }, { status: 400 });
  }

  const profile = buildProfile(voteData);
  // Store liked image IDs (not the heavy image data); URLs are resolved on read.
  const likedIds = votes.filter((v) => v.liked && byId.has(v.id)).map((v) => v.id);

  const result = await prisma.result.create({
    data: {
      sessionId: session.id,
      clientName: session.clientName,
      profile: JSON.stringify(profile),
      liked: JSON.stringify(likedIds),
      ratedCount: voteData.length,
      likedCount: likedIds.length,
    },
  });
  return NextResponse.json({ id: result.id }, { status: 201 });
}
