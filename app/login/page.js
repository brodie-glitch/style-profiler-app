"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="center"><p className="lead">Loading…</p></div>}>
      <Login />
    </Suspense>
  );
}

function Login() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setBusy(false);
    if (res.ok) {
      router.push(params.get("next") || "/dashboard");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setErr(d.error || "Login failed.");
    }
  }

  return (
    <div className="center">
      <div className="topbar">
        <span className="brand"><span className="dot" /> Style Profiler</span>
      </div>
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Designer sign in</h1>
        <p className="lead">Enter the admin password to manage your image library and view client profiles.</p>
        <form onSubmit={submit}>
          <label className="field">Password</label>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
          {err && <div className="err">{err}</div>}
          <div style={{ height: 14 }} />
          <button className="btn" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        </form>
      </div>
    </div>
  );
}
