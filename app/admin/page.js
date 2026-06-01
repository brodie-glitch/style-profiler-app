"use client";
import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { STYLE_TAGS, ATTR_TAGS, parseTags } from "../../lib/styles";

export default function Admin() {
  const [images, setImages] = useState([]);
  const [url, setUrl] = useState("");
  const [styles, setStyles] = useState([]);
  const [attrs, setAttrs] = useState([]);
  const [note, setNote] = useState("");
  const [fileData, setFileData] = useState("");
  const [ratingsCount, setRatingsCount] = useState(30);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    const [imgs, set] = await Promise.all([
      fetch("/api/images").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
    ]);
    setImages(Array.isArray(imgs) ? imgs : []);
    setRatingsCount(set.ratingsCount || 30);
  }
  useEffect(() => { load(); }, []);

  function toggle(list, setList, t) {
    setList(list.includes(t) ? list.filter((x) => x !== t) : [...list, t]);
  }

  function onFile(e) {
    const f = e.target.files[0];
    if (!f) return setFileData("");
    const r = new FileReader();
    r.onload = () => setFileData(r.result);
    r.readAsDataURL(f);
  }

  async function add() {
    setErr(""); setMsg("");
    const src = fileData || url.trim();
    if (!src) return setErr("Add an image URL or upload a file.");
    if (styles.length === 0) return setErr("Pick at least one style tag.");
    const res = await fetch("/api/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: src, styles, attrs, note }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return setErr(d.error || "Failed to add image.");
    }
    setUrl(""); setStyles([]); setAttrs([]); setNote(""); setFileData("");
    setMsg("Image added.");
    load();
  }

  async function del(id) {
    await fetch(`/api/images/${id}`, { method: "DELETE" });
    load();
  }

  async function loadSamples() {
    await fetch("/api/seed", { method: "POST" });
    setMsg("Sample images loaded.");
    load();
  }

  async function saveSettings() {
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ratingsCount }),
    });
    setMsg("Settings saved.");
  }

  return (
    <>
      <TopBar active="admin" />
      <h1>Image library</h1>
      <p className="lead">Add images from your Pinterest board (download a pin, then paste its URL or upload it) and tag each one. Tags drive the profile matching.</p>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Add an image</h2>
        <label className="field">Image URL</label>
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://… (hosted image URL)" />
        <label className="field">…or upload a file</label>
        <input type="file" accept="image/*" onChange={onFile} />
        <div className="hint">Uploaded files are stored in the database as data URLs.</div>

        <label className="field">Style tags</label>
        <div className="tagpick">
          {STYLE_TAGS.map((t) => (
            <span key={t} className={"tag" + (styles.includes(t) ? " on" : "")} onClick={() => toggle(styles, setStyles, t)}>{t}</span>
          ))}
        </div>

        <label className="field">Attribute tags (palette, materials, feel)</label>
        <div className="tagpick">
          {ATTR_TAGS.map((t) => (
            <span key={t} className={"tag" + (attrs.includes(t) ? " on" : "")} onClick={() => toggle(attrs, setAttrs, t)}>{t}</span>
          ))}
        </div>

        <label className="field">Note (optional)</label>
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Internal note" />
        {err && <div className="err">{err}</div>}
        {msg && <div className="hint" style={{ color: "var(--accent)" }}>{msg}</div>}
        <div style={{ height: 14 }} />
        <button className="btn" onClick={add}>Add to library</button>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Session settings</h2>
        <label className="field">Images a client rates before profiling</label>
        <input type="number" min="5" max="200" value={ratingsCount} onChange={(e) => setRatingsCount(e.target.value)} />
        <div style={{ height: 12 }} />
        <button className="btn ghost small" onClick={saveSettings}>Save settings</button>
      </div>

      <h2>Library ({images.length})</h2>
      {images.length === 0 ? (
        <div className="empty">
          No images yet.<br /><br />
          <button className="btn small secondary" onClick={loadSamples}>Load 12 sample images</button>
          <div className="hint" style={{ marginTop: 10 }}>A quick way to test the flow — you can remove them and add your own anytime.</div>
        </div>
      ) : (
        <div className="adminlist">
          {images.map((im) => (
            <div className="item" key={im.id}>
              <div className="im" style={{ backgroundImage: `url('${im.url}')` }} />
              <div className="meta">
                <span className="x" onClick={() => del(im.id)}>remove</span>
                {parseTags(im.styles).join(", ") || <i>untagged</i>}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
