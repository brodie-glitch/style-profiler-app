"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TopBar({ active }) {
  const router = useRouter();
  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }
  return (
    <div className="topbar">
      <Link href="/dashboard" className="brand"><span className="dot" /> Style Profiler</Link>
      <div className="nav">
        <Link href="/dashboard" className="navlink" style={active === "dashboard" ? { color: "var(--ink)", borderColor: "var(--ink)" } : {}}>Dashboard</Link>
        <Link href="/admin" className="navlink" style={active === "admin" ? { color: "var(--ink)", borderColor: "var(--ink)" } : {}}>Library</Link>
        <button className="navlink" onClick={logout}>Sign out</button>
      </div>
    </div>
  );
}
