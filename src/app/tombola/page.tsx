"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

// ── Brand colors (AssoConnect) ────────────────────────────────────────────────
const BLUE   = "#2454D4";
const BLUE2  = "#1A3FAA";
const TEAL   = "#00BFA5";
const TEAL2  = "#00897B";
const BG     = "#F0F4FF";
const WHITE  = "#FFFFFF";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Participant { id: number; name: string }
interface Winner      { participant: Participant; round: number }

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const COLORS = [BLUE, TEAL, "#F59E0B", "#EF4444", "#8B5CF6", "#10B981"];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[60]">
      {Array.from({ length: 70 }, (_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${Math.random() * 100}%`,
          top: "-16px",
          width: `${7 + Math.floor(Math.random() * 7)}px`,
          height: `${7 + Math.floor(Math.random() * 7)}px`,
          backgroundColor: COLORS[i % COLORS.length],
          borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          animation: `confettiFall ${1.4 + Math.random() * 1.6}s ${Math.random() * 0.8}s ease-in forwards`,
        }} />
      ))}
    </div>
  );
}

// ── Barcode SVG ───────────────────────────────────────────────────────────────
function Barcode() {
  const bars = Array.from({ length: 28 }, (_, i) => ({
    x: i * 5.5,
    w: [1.5, 2.5, 1.5, 3, 1.5, 2, 1.5][i % 7],
  }));
  return (
    <svg width="160" height="36" viewBox="0 0 160 36">
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={36} fill="rgba(255,255,255,0.7)" />
      ))}
    </svg>
  );
}

// ── 3D Ticket ─────────────────────────────────────────────────────────────────
function Ticket3D({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const rotateY = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, -4, 8]);
  const smoothRotY = useSpring(rotateY, { stiffness: 60, damping: 20 });
  const smoothRotX = useSpring(rotateX, { stiffness: 60, damping: 20 });

  // Ticket number
  const ticketNo = "AC-2025-00742";

  return (
    <div style={{ perspective: "900px", perspectiveOrigin: "50% 50%" }}>
      <motion.div
        style={{ rotateY: smoothRotY, rotateX: smoothRotX, transformStyle: "preserve-3d" }}
        className="relative select-none"
      >
        {/* Main ticket body */}
        <div style={{
          width: 320,
          background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE2} 40%, ${TEAL2} 100%)`,
          borderRadius: "18px",
          boxShadow: "0 30px 80px rgba(36,84,212,0.45), 0 8px 24px rgba(0,191,165,0.2), inset 0 1px 0 rgba(255,255,255,0.25)",
          overflow: "hidden",
          position: "relative",
        }}>

          {/* Glossy sheen */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 50%)",
            pointerEvents: "none", borderRadius: "inherit",
          }} />

          {/* Top section */}
          <div style={{ padding: "22px 24px 0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              {/* Mini logo */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: WHITE, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 14 }}>🎟️</span>
                </div>
                <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, fontSize: 13, letterSpacing: "0.5px" }}>TOMBOLA</span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: 600, letterSpacing: "1px" }}>2025</span>
            </div>

            {/* Title */}
            <div style={{ marginBottom: 4 }}>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 2 }}>Ticket officiel</p>
              <h3 style={{
                color: WHITE, fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px",
                textShadow: "0 2px 12px rgba(0,0,0,0.3)",
              }}>
                Grand Tirage
              </h3>
            </div>

            {/* Ticket number */}
            <div style={{
              display: "inline-block", marginTop: 8, marginBottom: 18,
              background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "4px 10px",
              border: "1px solid rgba(255,255,255,0.2)",
            }}>
              <span style={{ color: TEAL, fontSize: 11, fontWeight: 700, letterSpacing: "2px" }}>{ticketNo}</span>
            </div>
          </div>

          {/* Serrated separator */}
          <div style={{ position: "relative", height: 24, marginBottom: 0 }}>
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.15)" }} />
            {/* Left notch */}
            <div style={{ position: "absolute", left: -14, top: "50%", transform: "translateY(-50%)", width: 28, height: 28, borderRadius: "50%", background: BG }} />
            {/* Right notch */}
            <div style={{ position: "absolute", right: -14, top: "50%", transform: "translateY(-50%)", width: 28, height: 28, borderRadius: "50%", background: BG }} />
            {/* Dashed line */}
            <svg style={{ position: "absolute", top: "50%", left: 20, right: 20, transform: "translateY(-50%)" }} width="280" height="2">
              <line x1="0" y1="1" x2="280" y2="1" stroke="rgba(255,255,255,0.3)" strokeDasharray="6 4" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Bottom section */}
          <div style={{ padding: "12px 24px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Barcode />
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginTop: 4 }}>
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 9, letterSpacing: "1.5px" }}>BONNE CHANCE</span>
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 9, letterSpacing: "1.5px" }}>★ ★ ★</span>
            </div>
          </div>
        </div>

        {/* 3D shadow layer (back face illusion) */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 18,
          background: `linear-gradient(135deg, ${BLUE2}, ${TEAL2})`,
          transform: "translateZ(-12px) translateY(6px) scale(0.97)",
          opacity: 0.5,
          filter: "blur(2px)",
          pointerEvents: "none",
        }} />
      </motion.div>
    </div>
  );
}

// ── Drum roll ─────────────────────────────────────────────────────────────────
function DrumRoll({ names, spinning }: { names: string[]; spinning: boolean }) {
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number | null>(null);
  const speedRef = useRef(0);
  useEffect(() => {
    if (spinning) {
      speedRef.current = 28;
      const animate = () => {
        speedRef.current = Math.max(speedRef.current * 0.992, 3);
        setOffset((o) => o + speedRef.current);
        rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [spinning]);

  if (!names.length) return null;
  const ITEM_H = 48;
  const repeated = [...names, ...names, ...names, ...names, ...names];
  const totalH = repeated.length * ITEM_H;
  const y = -(offset % totalH);

  return (
    <div style={{
      position: "relative", width: "100%", height: 140, overflow: "hidden",
      borderRadius: 12, background: "#EEF2FF", border: `1px solid ${BLUE}22`,
    }}>
      <div style={{ position: "absolute", inset: "0 0 auto", height: 40, background: `linear-gradient(to bottom, ${BG}, transparent)`, zIndex: 2 }} />
      <div style={{ position: "absolute", inset: "auto 0 0", height: 40, background: `linear-gradient(to top, ${BG}, transparent)`, zIndex: 2 }} />
      <div style={{ position: "absolute", inset: "0 0", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, pointerEvents: "none" }}>
        <div style={{ width: "100%", height: 48, background: `${BLUE}11`, borderTop: `1.5px solid ${BLUE}33`, borderBottom: `1.5px solid ${BLUE}33` }} />
      </div>
      <div style={{ transform: `translateY(${y + totalH / 2 - ITEM_H * 2.5}px)`, willChange: "transform" }}>
        {repeated.map((name, i) => (
          <div key={i} style={{ height: ITEM_H, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 15, color: BLUE2 }}>
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function TombolaPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [input, setInput]       = useState("");
  const [nextId, setNextId]     = useState(1);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner]     = useState<Participant | null>(null);
  const [showWinner, setShowWinner] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [winners, setWinners]   = useState<Winner[]>([]);
  const [round, setRound]       = useState(1);
  const [scrollY, setScrollY]   = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navScrolled = scrollY > 60;
  const pool = participants.filter((p) => !winners.some((w) => w.participant.id === p.id));

  function addParticipant() {
    const names = input.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);
    if (!names.length) return;
    setParticipants((prev) => [...prev, ...names.map((name, idx) => ({ id: nextId + idx, name }))]);
    setNextId((id) => id + names.length);
    setInput("");
  }

  const draw = useCallback(() => {
    if (!pool.length || spinning) return;
    setSpinning(true);
    setShowWinner(false);
    setWinner(null);
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setTimeout(() => {
      setSpinning(false);
      setWinner(picked);
      setShowWinner(true);
      setConfetti(true);
      setWinners((prev) => [{ participant: picked, round }, ...prev]);
      setRound((r) => r + 1);
      setTimeout(() => setConfetti(false), 3500);
    }, 2800);
  }, [pool, spinning, round]);

  function reset() {
    setWinners([]); setRound(1); setWinner(null); setShowWinner(false);
  }

  return (
    <>
      <style>{`
        @keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(720deg);opacity:0} }
        @keyframes winnerPop { 0%{transform:scale(0.6) translateY(20px);opacity:0} 70%{transform:scale(1.05);opacity:1} 100%{transform:scale(1) translateY(0);opacity:1} }
        @keyframes pulse-ring { 0%,100%{box-shadow:0 0 0 0 rgba(36,84,212,0.4)} 50%{box-shadow:0 0 0 14px rgba(36,84,212,0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .winner-pop { animation: winnerPop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .pulse-ring  { animation: pulse-ring 2s ease-in-out infinite; }
        .float-anim  { animation: float 3.5s ease-in-out infinite; }
      `}</style>

      <Confetti active={confetti} />

      {/* ── Sticky nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "12px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: navScrolled ? "rgba(255,255,255,0.95)" : "transparent",
        boxShadow: navScrolled ? "0 1px 20px rgba(36,84,212,0.1)" : "none",
        backdropFilter: navScrolled ? "blur(14px)" : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* AssoConnect-style logo */}
          <div style={{ width: 34, height: 34, borderRadius: 10, background: navScrolled ? BLUE : WHITE, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}>
            <span style={{ fontSize: 16 }}>🎟️</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: navScrolled ? BLUE2 : WHITE, transition: "color 0.3s" }}>Tombola</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: navScrolled ? "#64748B" : "rgba(255,255,255,0.75)", transition: "color 0.3s" }}>
            {participants.length} participant{participants.length !== 1 ? "s" : ""}
          </span>
          {pool.length > 0 && (
            <button
              onClick={draw}
              disabled={spinning}
              style={{
                background: navScrolled ? BLUE : "rgba(255,255,255,0.2)",
                color: WHITE,
                border: navScrolled ? "none" : "1px solid rgba(255,255,255,0.4)",
                padding: "6px 16px", borderRadius: 20, fontWeight: 600, fontSize: 13,
                cursor: spinning ? "not-allowed" : "pointer", opacity: spinning ? 0.6 : 1,
                transition: "all 0.3s",
              }}
            >
              {spinning ? "⏳ Tirage…" : "🎰 Tirer"}
            </button>
          )}
        </div>
      </nav>

      {/* ── Page container ── */}
      <div ref={containerRef}>

        {/* ── Hero ── */}
        <section style={{
          minHeight: "100vh",
          background: `linear-gradient(160deg, ${BLUE} 0%, ${BLUE2} 50%, ${TEAL2} 100%)`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "100px 24px 80px", gap: 40, position: "relative", overflow: "hidden",
        }}>
          {/* Background radial blobs */}
          <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", top: -100, right: -100, background: `radial-gradient(circle, ${TEAL}22, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", bottom: -80, left: -80, background: `radial-gradient(circle, rgba(255,255,255,0.06), transparent 70%)`, pointerEvents: "none" }} />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ textAlign: "center", color: WHITE }}
          >
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "3px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", marginBottom: 12 }}>
              AssoConnect · Outil interne
            </p>
            <h1 style={{ fontSize: "clamp(2.5rem,6vw,4rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 16, letterSpacing: "-1px" }}>
              Grand Tirage<br />
              <span style={{ color: TEAL }}>au Sort</span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", maxWidth: 400, margin: "0 auto" }}>
              Ajoutez vos participants et laissez le hasard décider du gagnant.
            </p>
          </motion.div>

          {/* 3D Ticket */}
          <motion.div
            className="float-anim"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          >
            <Ticket3D scrollYProgress={scrollYProgress} />
          </motion.div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { label: "Participants", value: participants.length },
              { label: "En lice", value: pool.length },
              { label: "Tour", value: round },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 14, padding: "10px 20px", textAlign: "center",
              }}>
                <div style={{ color: WHITE, fontWeight: 800, fontSize: 22 }}>{value}</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span>↓ Défiler pour jouer</span>
          </div>
        </section>

        {/* ── Participants ── */}
        <section style={{ background: BG, padding: "60px 16px" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            {/* Section header AssoConnect-style */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${BLUE}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 20 }}>👥</span>
              </div>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 20, color: BLUE2, margin: 0 }}>Participants</h2>
                <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>Un nom par ligne ou séparés par des virgules</p>
              </div>
            </div>

            <div style={{
              background: WHITE, borderRadius: 16, border: "1px solid #E2E8F0",
              boxShadow: "0 2px 16px rgba(36,84,212,0.06)", overflow: "hidden",
            }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", gap: 12 }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addParticipant(); } }}
                  placeholder="Alice, Bob, Charlie…"
                  rows={2}
                  style={{
                    flex: 1, borderRadius: 10, padding: "10px 14px", fontSize: 14, fontWeight: 500,
                    border: `1.5px solid #E2E8F0`, outline: "none", resize: "none",
                    background: "#F8FAFF", color: BLUE2, fontFamily: "inherit",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = BLUE}
                  onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                />
                <button
                  onClick={addParticipant}
                  disabled={!input.trim()}
                  style={{
                    alignSelf: "flex-end", background: BLUE, color: WHITE, border: "none",
                    padding: "10px 20px", borderRadius: 10, fontWeight: 700, fontSize: 14,
                    cursor: input.trim() ? "pointer" : "not-allowed", opacity: input.trim() ? 1 : 0.4,
                    transition: "all 0.2s", fontFamily: "inherit",
                  }}
                >
                  Ajouter
                </button>
              </div>

              {participants.length > 0 ? (
                <div style={{ padding: "16px 24px", display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {participants.map((p) => {
                    const drawn = winners.some((w) => w.participant.id === p.id);
                    return (
                      <span key={p.id} style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "5px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600,
                        background: drawn ? "#F1F5F9" : `${BLUE}14`,
                        color: drawn ? "#94A3B8" : BLUE,
                        border: `1px solid ${drawn ? "#E2E8F0" : `${BLUE}30`}`,
                        textDecoration: drawn ? "line-through" : "none",
                        transition: "all 0.2s",
                      }}>
                        {drawn ? "🏆 " : ""}{p.name}
                        {!drawn && (
                          <button onClick={() => setParticipants((prev) => prev.filter((x) => x.id !== p.id))}
                            style={{ background: "none", border: "none", cursor: "pointer", color: `${BLUE}80`, padding: 0, fontSize: 14, lineHeight: 1 }}>
                            ×
                          </button>
                        )}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: "32px 24px", textAlign: "center", color: "#94A3B8", fontSize: 14 }}>
                  Aucun participant — commencez par en ajouter !
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Draw section ── */}
        <section style={{ background: WHITE, padding: "60px 16px 80px" }}>
          <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${TEAL}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 20 }}>🎰</span>
              </div>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 20, color: BLUE2, margin: 0 }}>Tirage au sort</h2>
                <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>{pool.length} participant{pool.length !== 1 ? "s" : ""} en lice</p>
              </div>
            </div>

            <div style={{
              background: BG, borderRadius: 20, border: "1px solid #E2E8F0",
              boxShadow: "0 2px 20px rgba(36,84,212,0.06)", padding: "28px 28px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
            }}>
              {pool.length > 0 ? (
                <>
                  <DrumRoll names={pool.map((p) => p.name)} spinning={spinning} />

                  {showWinner && winner && (
                    <motion.div
                      className="winner-pop"
                      style={{
                        width: "100%", borderRadius: 16, padding: "20px 24px", textAlign: "center",
                        background: `linear-gradient(135deg, ${BLUE}18, ${TEAL}14)`,
                        border: `2px solid ${TEAL}60`,
                      }}
                    >
                      <p style={{ color: "#64748B", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 }}>
                        🏆 Gagnant — Tour {round - 1}
                      </p>
                      <p style={{ fontSize: 28, fontWeight: 900, color: BLUE2 }}>{winner.name}</p>
                    </motion.div>
                  )}

                  <button
                    onClick={draw}
                    disabled={spinning}
                    className="pulse-ring"
                    style={{
                      width: "100%", padding: "15px 0", borderRadius: 14,
                      background: `linear-gradient(135deg, ${BLUE}, ${TEAL2})`,
                      color: WHITE, border: "none", fontWeight: 800, fontSize: 16,
                      cursor: spinning ? "not-allowed" : "pointer",
                      opacity: spinning ? 0.65 : 1, fontFamily: "inherit",
                      transition: "opacity 0.2s",
                    }}
                  >
                    {spinning ? "🎲 Tirage en cours…" : "🎰 Lancer le tirage"}
                  </button>
                </>
              ) : participants.length === 0 ? (
                <p style={{ color: "#94A3B8", padding: "24px 0", fontSize: 15 }}>
                  Ajoutez des participants pour commencer
                </p>
              ) : (
                <div style={{ textAlign: "center", padding: "24px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: 48 }}>🎉</span>
                  <p style={{ fontWeight: 800, fontSize: 18, color: BLUE2 }}>Tous les participants ont été tirés !</p>
                  <button onClick={reset} style={{
                    background: `${BLUE}14`, color: BLUE, border: `1px solid ${BLUE}30`,
                    padding: "10px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14,
                    cursor: "pointer", fontFamily: "inherit",
                  }}>
                    Recommencer
                  </button>
                </div>
              )}
            </div>

            {/* Palmarès */}
            {winners.length > 0 && (
              <div style={{ background: BG, borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontWeight: 800, fontSize: 16, color: BLUE2, margin: 0 }}>🏆 Palmarès</h3>
                  <button onClick={reset} style={{ fontSize: 12, color: "#94A3B8", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Réinitialiser</button>
                </div>
                {winners.map((w, i) => (
                  <div key={i} style={{
                    padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
                    borderBottom: i < winners.length - 1 ? "1px solid #F1F5F9" : "none",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                        background: i === 0 ? "#FFF7ED" : i === 1 ? "#F0F9FF" : i === 2 ? "#F0FDF4" : "#F8FAFF",
                      }}>
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎖️"}
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 15, color: BLUE2 }}>{w.participant.name}</span>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase",
                      background: `${BLUE}12`, color: BLUE, padding: "3px 10px", borderRadius: 20,
                    }}>Tour {w.round}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background: BLUE2, padding: "24px", textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: 0 }}>
            Propulsé par <span style={{ color: TEAL, fontWeight: 700 }}>AssoConnect</span> — la plateforme de gestion pour associations
          </p>
        </footer>
      </div>

      {/* Scroll progress bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: 3, background: "#E2E8F0", zIndex: 60 }}>
        <motion.div style={{
          height: "100%",
          scaleX: scrollYProgress,
          transformOrigin: "left",
          background: `linear-gradient(to right, ${BLUE}, ${TEAL})`,
        }} />
      </div>
    </>
  );
}
