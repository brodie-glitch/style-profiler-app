import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { buildProfile } from "../../../lib/styles";

// Public: a client submits their votes; we compute & store the profile.
// votes: [{ url, styles:[], attrs:[], liked:bool }]
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

  const profile = buildProfile(votes);
  const liked = votes.filter((v) => v.liked).map((v) => v.url);

  const result = await prisma.result.create({
    data: {
      sessionId: session.id,
      clientName: session.clientName,
      profile: JSON.stringify(profile),
      liked: JSON.stringify(liked),
      ratedCount: votes.length,
      likedCount: liked.length,
    },
  });
  return NextResponse.json({ id: result.id }, { status: 201 });
}
