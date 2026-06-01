// Style taxonomy + profile engine — shared by client and server.

export const STYLE_TAGS = [
  "Minimalist", "Mid-century modern", "Scandinavian", "Industrial", "Bohemian",
  "Traditional", "Coastal", "Farmhouse", "Art Deco", "Japandi", "Brutalist",
  "Maximalist", "Rustic", "Contemporary", "Mediterranean",
];

export const ATTR_TAGS = [
  "Warm tones", "Cool tones", "Neutral palette", "Bold color", "Natural materials",
  "Lots of greenery", "Open & airy", "Cozy & layered", "Clean lines", "Ornate detail",
  "Monochrome", "Wood-heavy", "Stone/concrete", "Soft textiles",
];

// votes: [{ styles:[], attrs:[], liked:bool }]
// Liked images add weight; disliked subtract a little so strong dislikes pull
// a style down. Scores normalised to percentages of the top score.
export function buildProfile(votes) {
  const styleScore = {};
  const attrScore = {};
  const bump = (obj, k, w) => { obj[k] = (obj[k] || 0) + w; };

  for (const v of votes) {
    const w = v.liked ? 1 : -0.4;
    (v.styles || []).forEach((s) => bump(styleScore, s, w));
    (v.attrs || []).forEach((a) => bump(attrScore, a, w));
  }

  const rank = (obj) => {
    const pos = Object.entries(obj).filter(([, v]) => v > 0);
    const max = Math.max(1, ...pos.map(([, v]) => v));
    return pos
      .sort((a, b) => b[1] - a[1])
      .map(([name, v]) => ({ name, pct: Math.round((v / max) * 100) }));
  };

  return { styles: rank(styleScore), attrs: rank(attrScore) };
}

export function parseTags(s) {
  try { return JSON.parse(s || "[]"); } catch { return []; }
}
