"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Rate() {
  const { token } = useParams();
  const router = useRouter();
  const [state, setState] = useState({ loading: true });
  const [i, setI] = useState(0);
  const [votes, setVotes] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState("");

  useEffect(() => {
    fetch(`/api/sessions/${token}`)
      .then((r) => r.json())
      .then((d) => setState({ loading: false, ...d }))
      .catch(() => setState({ loading: false, error: "Something went wrong." }));
  }, [token]);

  if (state.loading) return <div className="center"><p className="lead">Loading…</p></div>;
  if (state.error || !state.deck && !state.completed)
    return <div className="center"><div className="empty">{state.error || "This link isn’t valid."}</div></div>;

  if (state.completed) {
    return (
      <div className="center">
        <div className="card">
          <h1 style={{ marginTop: 0 }}>All done</h1>
          <p className="lead">You’ve already completed this. Thanks!</p>
          {state.resultId && <button className="btn" onClick={() => router.push(`/results/${state.resultId}`)}>See your style profile</button>}
        </div>
      </div>
    );
  }

  const deck = state.deck;
  const total = deck.length;

  async function vote(liked) {
    const im = deck[i];
    const next = [...votes, { id: im.id, liked }];
    setVotes(next);
    if (i + 1 >= total) return submit(next);
    setI(i + 1);
  }

  async function submit(allVotes) {
    setSubmitting(true);
    setSubmitErr("");
    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, votes: allVotes }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.id) {
        router.push(`/results/${d.id}`);
        return;
      }
      setSubmitErr(d.error || "Couldn’t save your results. Please try again.");
    } catch {
      setSubmitErr("Network problem saving your results. Please try again.");
    }
    setSubmitting(false);
  }

  if (submitting) return <div className="center"><p className="lead">Building your style profile…</p></div>;
  if (submitErr) return (
    <div className="center">
      <div className="card">
        <h1 style={{ marginTop: 0 }}>Almost there</h1>
        <p className="err">{submitErr}</p>
        <button className="btn" onClick={() => submit(votes)}>Try again</button>
      </div>
    </div>
  );

  const im = deck[i];
  return (
    <>
      <div className="topbar">
        <span className="brand"><span className="dot" /> Style Profiler</span>
      </div>
      <h1 style={{ fontSize: 20 }}>{state.clientName ? `${state.clientName} — ` : ""}rate the look</h1>
      <p className="lead" style={{ marginBottom: 8 }}>Tap whether each space appeals to you. There are no wrong answers.</p>
      <div className="progress"><i style={{ width: `${(i / total) * 100}%` }} /></div>
      <div className="stage">
        <div className="photo" style={{ backgroundImage: `url('${im.url}')` }} />
      </div>
      <div className="voterow">
        <button className="vote down" onClick={() => vote(false)}>✕ Not for me</button>
        <button className="vote up" onClick={() => vote(true)}>♥ Love it</button>
      </div>
      <div className="count">{i + 1} of {total}</div>
    </>
  );
}
