"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Participant {
  id: number;
  name: string;
}
interface Winner {
  participant: Participant;
  drawnAt: Date;
  round: number;
}

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti({ active }: { active: boolean }) {
  const pieces = Array.from({ length: 60 }, (_, i) => i);
  const colors = ["#6B4FD8", "#9B7FF4", "#F59E0B", "#10B981", "#EF4444", "#3B82F6", "#EC4899"];

  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((i) => {
        const left = `${Math.random() * 100}%`;
        const delay = `${Math.random() * 0.8}s`;
        const duration = `${1.5 + Math.random() * 1.5}s`;
        const color = colors[i % colors.length];
        const size = `${6 + Math.floor(Math.random() * 8)}px`;
        const rotate = `${Math.random() * 720}deg`;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left,
              top: "-20px",
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
              animation: `confettiFall ${duration} ${delay} ease-in forwards`,
              transform: `rotate(${rotate})`,
            }}
          />
        );
      })}
    </div>
  );
}

// ── Drum animation ────────────────────────────────────────────────────────────
function DrumRoll({ names, spinning }: { names: string[]; spinning: boolean }) {
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number | null>(null);
  const speedRef = useRef(0);

  useEffect(() => {
    if (spinning) {
      speedRef.current = 25;
      const animate = () => {
        speedRef.current = Math.max(speedRef.current * 0.99, 3);
        setOffset((o) => o + speedRef.current);
        rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [spinning]);

  if (names.length === 0) return null;
  const ITEM_H = 48;
  const repeated = [...names, ...names, ...names, ...names, ...names];
  const totalH = repeated.length * ITEM_H;
  const y = -(offset % totalH);

  return (
    <div className="relative w-full h-36 overflow-hidden rounded-xl border border-white/20" style={{ background: "rgba(255,255,255,0.07)" }}>
      {/* Fade top/bottom */}
      <div className="absolute inset-x-0 top-0 h-10 z-10 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(107,79,216,0.95), transparent)" }} />
      <div className="absolute inset-x-0 bottom-0 h-10 z-10 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(107,79,216,0.95), transparent)" }} />
      {/* Center line */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 z-0" style={{ background: "rgba(255,255,255,0.1)", borderTop: "1px solid rgba(255,255,255,0.2)", borderBottom: "1px solid rgba(255,255,255,0.2)" }} />
      <div style={{ transform: `translateY(${y + totalH / 2 - ITEM_H * 2.5}px)`, willChange: "transform" }}>
        {repeated.map((name, i) => (
          <div key={i} className="flex items-center justify-center text-white font-semibold text-lg" style={{ height: ITEM_H }}>
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function TombolaPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [input, setInput] = useState("");
  const [nextId, setNextId] = useState(1);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [showWinner, setShowWinner] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [round, setRound] = useState(1);
  const [scrollY, setScrollY] = useState(0);
  const drawSectionRef = useRef<HTMLDivElement>(null);
  const pool = participants.filter((p) => !winners.some((w) => w.participant.id === p.id));

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-driven values
  const maxScroll = typeof window !== "undefined" ? (document.body.scrollHeight || 1800) - window.innerHeight : 1800;
  const scrollProgress = Math.min(scrollY / Math.max(maxScroll, 1), 1);

  // Background: deep purple → rich indigo → soft violet → light lavender
  const heroOpacity = Math.max(0, 1 - scrollY / 300);
  const navBg = scrollY > 60 ? "rgba(255,255,255,0.92)" : "transparent";
  const navShadow = scrollY > 60 ? "0 1px 20px rgba(107,79,216,0.12)" : "none";
  const navTextColor = scrollY > 60 ? "#1A1533" : "white";

  // Section background shifts
  const sectionBg = `linear-gradient(to bottom,
    hsl(${255 + scrollProgress * 20}, 60%, ${12 + scrollProgress * 60}%) 0%,
    hsl(${255 + scrollProgress * 30}, 55%, ${25 + scrollProgress * 55}%) 100%)`;

  function addParticipant() {
    const names = input.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);
    if (!names.length) return;
    setParticipants((prev) => [
      ...prev,
      ...names.map((name) => ({ id: nextId + names.indexOf(name), name })),
    ]);
    setNextId((id) => id + names.length);
    setInput("");
  }

  function removeParticipant(id: number) {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  }

  const draw = useCallback(() => {
    if (pool.length === 0 || spinning) return;
    setSpinning(true);
    setShowWinner(false);
    setWinner(null);

    const picked = pool[Math.floor(Math.random() * pool.length)];
    const duration = 2800;

    setTimeout(() => {
      setSpinning(false);
      setWinner(picked);
      setShowWinner(true);
      setConfetti(true);
      setWinners((prev) => [{ participant: picked, drawnAt: new Date(), round }, ...prev]);
      setRound((r) => r + 1);
      setTimeout(() => setConfetti(false), 3500);
    }, duration);
  }, [pool, spinning, round]);

  function reset() {
    setWinners([]);
    setRound(1);
    setWinner(null);
    setShowWinner(false);
  }

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes winnerPop {
          0% { transform: scale(0.5) translateY(40px); opacity: 0; }
          70% { transform: scale(1.08) translateY(-4px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(155,127,244,0.5); }
          50% { box-shadow: 0 0 0 16px rgba(155,127,244,0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .winner-pop { animation: winnerPop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .float { animation: float 3s ease-in-out infinite; }
        .fade-in-up { animation: fadeInUp 0.5s ease forwards; }
      `}</style>

      <Confetti active={confetti} />

      {/* Sticky nav */}
      <nav
        className="fixed top-0 inset-x-0 z-40 px-6 py-3.5 flex items-center justify-between transition-all duration-300"
        style={{ background: navBg, boxShadow: navShadow, backdropFilter: scrollY > 60 ? "blur(12px)" : "none" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🎟️</span>
          <span className="font-bold text-base" style={{ color: navTextColor }}>Tombola</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium" style={{ color: scrollY > 60 ? "#6B4FD8" : "rgba(255,255,255,0.8)" }}>
            {participants.length} participant{participants.length !== 1 ? "s" : ""}
          </span>
          {pool.length > 0 && (
            <button
              onClick={() => drawSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="text-sm font-semibold px-4 py-1.5 rounded-full transition-all"
              style={{
                background: scrollY > 60 ? "#6B4FD8" : "rgba(255,255,255,0.2)",
                color: "white",
                border: scrollY > 60 ? "none" : "1px solid rgba(255,255,255,0.4)",
              }}
            >
              Tirer au sort ↓
            </button>
          )}
        </div>
      </nav>

      {/* Page */}
      <div className="min-h-screen transition-all duration-500" style={{ background: sectionBg }}>

        {/* Hero */}
        <section className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 overflow-hidden" style={{ minHeight: "85vh" }}>
          {/* Background blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute rounded-full blur-3xl opacity-30 float"
              style={{ width: 400, height: 400, top: "10%", left: "5%", background: "radial-gradient(circle, #9B7FF4, transparent 70%)" }} />
            <div className="absolute rounded-full blur-3xl opacity-20 float"
              style={{ width: 300, height: 300, bottom: "10%", right: "5%", background: "radial-gradient(circle, #F59E0B, transparent 70%)", animationDelay: "1.5s" }} />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-6 fade-in-up">
            <div className="text-7xl float">🎰</div>
            <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight tracking-tight" style={{ textShadow: "0 2px 40px rgba(107,79,216,0.4)" }}>
              Tombola
            </h1>
            <p className="text-lg text-white/70 max-w-md">
              Ajoutez vos participants, lancez le tirage, découvrez les gagnants en direct.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <span className="text-white/60 text-sm">Tour</span>
                <span className="text-white font-bold text-lg">{round}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <span className="text-white/60 text-sm">Restants</span>
                <span className="text-white font-bold text-lg">{pool.length}</span>
              </div>
            </div>
            <div className="mt-6 text-white/40 text-sm animate-bounce">↓ Défiler pour commencer</div>
          </div>
        </section>

        {/* Add participants */}
        <section className="max-w-2xl mx-auto px-4 py-16">
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(12px)" }}>
            <div className="px-8 py-6 border-b" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
              <h2 className="text-xl font-bold text-white">👥 Participants</h2>
              <p className="text-white/50 text-sm mt-1">Un nom par ligne, ou séparés par des virgules</p>
            </div>
            <div className="px-8 py-6 flex flex-col gap-4">
              <div className="flex gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addParticipant(); } }}
                  placeholder="Alice, Bob, Charlie…"
                  rows={3}
                  className="flex-1 rounded-xl px-4 py-3 text-sm font-medium resize-none outline-none transition-all placeholder-white/30"
                  style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "white" }}
                />
                <button
                  onClick={addParticipant}
                  disabled={!input.trim()}
                  className="self-end px-5 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40"
                  style={{ background: "rgba(255,255,255,0.9)", color: "#6B4FD8" }}
                >
                  Ajouter
                </button>
              </div>

              {participants.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {participants.map((p) => {
                    const isDrawn = winners.some((w) => w.participant.id === p.id);
                    return (
                      <span
                        key={p.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                        style={{
                          background: isDrawn ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.18)",
                          color: isDrawn ? "rgba(255,255,255,0.35)" : "white",
                          border: `1px solid ${isDrawn ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.25)"}`,
                          textDecoration: isDrawn ? "line-through" : "none",
                        }}
                      >
                        {isDrawn ? "🏆 " : ""}{p.name}
                        {!isDrawn && (
                          <button onClick={() => removeParticipant(p.id)} className="opacity-50 hover:opacity-100 transition-opacity ml-0.5">×</button>
                        )}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Draw section */}
        <section ref={drawSectionRef} className="max-w-2xl mx-auto px-4 py-8 pb-24">
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(12px)" }}>
            <div className="px-8 py-6 border-b" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
              <h2 className="text-xl font-bold text-white">🎰 Tirage au sort</h2>
            </div>
            <div className="px-8 py-8 flex flex-col items-center gap-6">
              {pool.length > 0 ? (
                <>
                  <DrumRoll names={pool.map((p) => p.name)} spinning={spinning} />

                  {showWinner && winner && (
                    <div className="winner-pop w-full rounded-2xl py-6 px-8 text-center"
                      style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(251,191,36,0.15))", border: "2px solid rgba(245,158,11,0.5)" }}>
                      <p className="text-white/60 text-sm font-medium mb-1">🏆 Gagnant{round > 2 ? ` du tour ${round - 1}` : ""}</p>
                      <p className="text-3xl font-black text-white">{winner.name}</p>
                    </div>
                  )}

                  <button
                    onClick={draw}
                    disabled={spinning}
                    className="pulse-glow w-full py-4 rounded-xl font-black text-lg text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: "linear-gradient(135deg, #6B4FD8, #9B7FF4)" }}
                  >
                    {spinning ? "🎲 Tirage en cours…" : "🎰 Lancer le tirage"}
                  </button>
                </>
              ) : participants.length === 0 ? (
                <p className="text-white/40 text-center py-6">Ajoutez des participants pour commencer</p>
              ) : (
                <div className="text-center py-6 flex flex-col items-center gap-4">
                  <div className="text-5xl">🎉</div>
                  <p className="text-white font-bold text-xl">Tous les participants ont été tirés !</p>
                  <button onClick={reset} className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all"
                    style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>
                    Recommencer
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Winners list */}
          {winners.length > 0 && (
            <div className="mt-6 rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <div className="px-8 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <h3 className="font-bold text-white">🏆 Palmarès</h3>
                <button onClick={reset} className="text-xs text-white/40 hover:text-white/70 transition-colors">Réinitialiser</button>
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                {winners.map((w, i) => (
                  <div key={i} className="px-8 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎖️"}</span>
                      <span className="font-semibold text-white">{w.participant.name}</span>
                    </div>
                    <span className="text-xs text-white/35">Tour {w.round}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Scroll progress bar */}
        <div className="fixed bottom-0 inset-x-0 h-1 z-50" style={{ background: "rgba(255,255,255,0.1)" }}>
          <div className="h-full transition-all duration-100" style={{ width: `${scrollProgress * 100}%`, background: "linear-gradient(to right, #9B7FF4, #F59E0B)" }} />
        </div>
      </div>
    </>
  );
}
