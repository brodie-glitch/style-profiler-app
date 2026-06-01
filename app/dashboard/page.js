"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "../components/TopBar";

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [imgCount, setImgCount] = useState(0);
  const [ratingsCount, setRatingsCount] = useState(30);
  const [clientName, setClientName] = useState("");
  const [newLink, setNewLink] = useState("");
  const [origin, setOrigin] = useState("");

  async function load() {
    const [s, imgs, set] = await Promise.all([
      fetch("/api/sessions").then((r) => r.json()),
      fetch("/api/images").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
    ]);
    setSessions(Array.isArray(s) ? s : []);
    setImgCount(Array.isArray(imgs) ? imgs.length : 0);
    setRatingsCount(set.ratingsCount || 30);
  }
  useEffect(() => { setOrigin(window.location.origin); load(); }, []);

  async function createLink() {
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientName }),
    });
    const s = await res.json();
    setNewLink(`${window.location.origin}/r/${s.token}`);
    setClientName("");
    load();
  }

  const completed = sessions.filter((s) => s.result);

  return (
    <>
      <TopBar active="dashboard" />
      <h1>Client design profiles</h1>
      <p className="lead">Create a link, send it to a client, and their style profile lands here when they finish.</p>

      <div className="stat">
        <div><b>{imgCount}</b><span>images in library</span></div>
        <div><b>{ratingsCount}</b><span>ratings per session</span></div>
        <div><b>{completed.length}</b><span>completed profiles</span></div>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>New client link</h2>
        <label className="field">Client name (optional)</label>
        <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. The Hendersons" />
        <div style={{ height: 12 }} />
        <button className="btn" onClick={createLink}>Create shareable link</button>
        {newLink && (
          <>
            <div className="linkbox">
              <input type="text" readOnly value={newLink} onFocus={(e) => e.target.select()} />
              <button className="btn small" onClick={() => navigator.clipboard?.writeText(newLink)}>Copy</button>
            </div>
            <div className="hint">Send this to your client. No login needed on their end.</div>
          </>
        )}
        {imgCount < 4 && <div className="err">Add at least 4 images in the <Link href="/admin">Library</Link> before sending links.</div>}
      </div>

      <h2>Sessions</h2>
      {sessions.length === 0 ? (
        <div className="empty">No client links yet.</div>
      ) : (
        sessions.map((s) => (
          <div className="card" key={s.id}>
            <div className="listrow">
              <div>
                <b>{s.clientName || "Unnamed client"}</b><br />
                <span style={{ fontSize: 12, color: "var(--muted)" }}>
                  {s.result
                    ? `Completed · ${new Date(s.result.createdAt).toLocaleDateString()} · liked ${s.result.likedCount}/${s.result.ratedCount}`
                    : "Awaiting client"}
                </span>
              </div>
              {s.result ? (
                <Link href={`/results/${s.result.id}`} className="btn small secondary">View profile</Link>
              ) : (
                <button className="btn small ghost" onClick={() => navigator.clipboard?.writeText(`${origin}/r/${s.token}`)}>Copy link</button>
              )}
            </div>
          </div>
        ))
      )}
    </>
  );
}
