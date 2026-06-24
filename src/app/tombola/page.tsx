"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

const BLUE  = "#2454D4";
const BLUE2 = "#1A3FAA";
const TEAL  = "#00BFA5";
const TEAL2 = "#00897B";
const BG    = "#F0F4FF";
const WHITE = "#FFFFFF";

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
          left: `${(i * 137.5) % 100}%`,
          top: "-16px",
          width: `${7 + (i % 5) * 2}px`,
          height: `${7 + (i % 5) * 2}px`,
          backgroundColor: COLORS[i % COLORS.length],
          borderRadius: i % 2 === 0 ? "50%" : "2px",
          animation: `confettiFall ${1.4 + (i % 5) * 0.3}s ${(i % 8) * 0.1}s ease-in forwards`,
        }} />
      ))}
    </div>
  );
}

// ── Barcode ───────────────────────────────────────────────────────────────────
function Barcode({ dark = false }: { dark?: boolean }) {
  const widths = [1.5, 2.5, 1.5, 3, 1.5, 2, 1.5, 2.5, 1, 3, 1.5, 2, 1.5, 2.5, 1, 2, 1.5, 3, 1, 2.5, 1.5, 2, 1.5, 2.5, 1, 3, 1.5, 2];
  let x = 0;
  const bars = widths.map((w) => { const b = { x, w }; x += w + 1.5; return b; });
  const fill = dark ? "rgba(36,84,212,0.45)" : "rgba(255,255,255,0.65)";
  return (
    <svg width={x} height="32" viewBox={`0 0 ${x} 32`}>
      {bars.map((b, i) => <rect key={i} x={b.x} y={0} width={b.w} height={32} fill={fill} rx="0.5" />)}
    </svg>
  );
}

// ── Serpentine path ───────────────────────────────────────────────────────────
const SERP_PATH = "M 250 40 C 440 120, 440 220, 250 280 C 60 340, 60 440, 250 500 C 440 560, 440 650, 250 710 C 60 760, 80 800, 250 830";

function SerpentinePath({ progress }: { progress: MotionValue<number> }) {
  const raw = useTransform(progress, [0.02, 0.92], [0, 1]);
  const pathLen = useSpring(raw, { stiffness: 32, damping: 14 });
  // Tip offset: a tiny bright segment at the leading edge
  const tipOffset = useTransform(pathLen, (v) => Math.max(0, v - 0.055));

  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 5 }}
      viewBox="0 0 500 870"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={TEAL} />
          <stop offset="100%" stopColor={BLUE} />
        </linearGradient>
        <filter id="glow1">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow2">
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Wide outer halo */}
      <motion.path d={SERP_PATH} fill="none" stroke="url(#sg)" strokeWidth="22" strokeLinecap="round"
        filter="url(#glow2)" style={{ pathLength: pathLen, opacity: 0.12 }} />
      {/* Medium glow */}
      <motion.path d={SERP_PATH} fill="none" stroke="url(#sg)" strokeWidth="8" strokeLinecap="round"
        filter="url(#glow1)" style={{ pathLength: pathLen, opacity: 0.3 }} />
      {/* Crisp main line */}
      <motion.path d={SERP_PATH} fill="none" stroke="url(#sg)" strokeWidth="2" strokeLinecap="round"
        style={{ pathLength: pathLen, opacity: 0.9 }} />
      {/* Bright tip */}
      <motion.path d={SERP_PATH} fill="none" stroke="white" strokeWidth="5" strokeLinecap="round"
        filter="url(#glow2)" style={{ pathLength: 0.06 as unknown as MotionValue<number>, pathOffset: tipOffset, opacity: 0.95 }} />
    </svg>
  );
}

// ── 3D Ticket ─────────────────────────────────────────────────────────────────
function Ticket3D({ heroProgress }: { heroProgress: MotionValue<number> }) {
  const rotateY = useTransform(heroProgress, [0, 1], [-38, 38]);
  const rotateX = useTransform(heroProgress, [0, 0.5, 1], [14, -7, 14]);
  const sRotY   = useSpring(rotateY, { stiffness: 50, damping: 18 });
  const sRotX   = useSpring(rotateX, { stiffness: 50, damping: 18 });

  return (
    <div style={{ perspective: "900px" }}>
      <motion.div style={{ rotateY: sRotY, rotateX: sRotX, transformStyle: "preserve-3d" }}>
        <div style={{
          width: 300,
          background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE2} 45%, ${TEAL2} 100%)`,
          borderRadius: 20,
          boxShadow: `0 32px 80px rgba(36,84,212,0.5), 0 8px 24px rgba(0,191,165,0.25), inset 0 1px 0 rgba(255,255,255,0.22)`,
          overflow: "hidden", position: "relative",
        }}>
          {/* Glossy sheen */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(140deg, rgba(255,255,255,0.2) 0%, transparent 55%)", pointerEvents: "none" }} />
          {/* Dot texture */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px", pointerEvents: "none" }} />

          <div style={{ padding: "20px 22px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: WHITE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🎟️</div>
                <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 700, fontSize: 12, letterSpacing: "0.8px" }}>TOMBOLA</span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 600, letterSpacing: "2px" }}>2025</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 9, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", margin: "0 0 3px" }}>Ticket officiel</p>
            <h3 style={{ color: WHITE, fontSize: 21, fontWeight: 900, letterSpacing: "-0.5px", textShadow: "0 2px 12px rgba(0,0,0,0.3)", margin: "0 0 10px" }}>Grand Tirage</h3>
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.13)", borderRadius: 6, padding: "3px 10px", border: "1px solid rgba(255,255,255,0.18)", marginBottom: 16 }}>
              <span style={{ color: TEAL, fontSize: 10, fontWeight: 700, letterSpacing: "2px" }}>AC-2025-00742</span>
            </div>
          </div>

          {/* Serrated separator */}
          <div style={{ position: "relative", height: 22 }}>
            <div style={{ position: "absolute", left: -12, top: "50%", transform: "translateY(-50%)", width: 24, height: 24, borderRadius: "50%", background: BG }} />
            <div style={{ position: "absolute", right: -12, top: "50%", transform: "translateY(-50%)", width: 24, height: 24, borderRadius: "50%", background: BG }} />
            <svg style={{ position: "absolute", inset: 0, top: "50%", transform: "translateY(-50%)" }} width="300" height="2">
              <line x1="14" y1="1" x2="286" y2="1" stroke="rgba(255,255,255,0.25)" strokeDasharray="6 4" strokeWidth="1.5" />
            </svg>
          </div>

          <div style={{ padding: "10px 22px 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Barcode />
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 8, letterSpacing: "2px" }}>BONNE CHANCE</span>
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 8, letterSpacing: "2px" }}>★ ★ ★</span>
            </div>
          </div>
        </div>
        {/* Shadow layer */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: `linear-gradient(135deg, ${BLUE2}, ${TEAL2})`, transform: "translateZ(-14px) translateY(8px) scale(0.96)", opacity: 0.45, filter: "blur(3px)", pointerEvents: "none" }} />
      </motion.div>
    </div>
  );
}

// ── Fancy button ──────────────────────────────────────────────────────────────
function FancyButton({
  onClick, disabled = false, variant = "primary", children, fullWidth = false,
}: {
  onClick?: () => void; disabled?: boolean; variant?: "primary" | "secondary" | "ghost";
  children: React.ReactNode; fullWidth?: boolean;
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: `linear-gradient(135deg, ${BLUE} 0%, ${TEAL2} 100%)`, color: WHITE, boxShadow: "0 8px 28px rgba(36,84,212,0.38), inset 0 1px 0 rgba(255,255,255,0.18)" },
    secondary: { background: WHITE, color: BLUE, boxShadow: "0 4px 16px rgba(36,84,212,0.14), inset 0 1px 0 rgba(255,255,255,0.8)", border: `1.5px solid rgba(36,84,212,0.18)` },
    ghost: { background: `rgba(36,84,212,0.08)`, color: BLUE, border: `1.5px solid rgba(36,84,212,0.22)` },
  };
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.025, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      style={{
        ...styles[variant],
        padding: "13px 26px", borderRadius: 14, fontWeight: 800, fontSize: 14,
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
        fontFamily: "inherit", border: styles[variant].border ?? "none",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9,
        position: "relative", overflow: "hidden", width: fullWidth ? "100%" : undefined,
        transition: "opacity 0.2s",
      }}
    >
      {/* Shimmer */}
      {!disabled && variant === "primary" && (
        <span style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)",
          animation: "shimmer 2.8s infinite",
        }} />
      )}
      <span style={{ position: "relative", display: "flex", alignItems: "center", gap: 9 }}>{children}</span>
    </motion.button>
  );
}

// ── Drum roll ─────────────────────────────────────────────────────────────────
function DrumRoll({ names, spinning }: { names: string[]; spinning: boolean }) {
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number | null>(null);
  const speedRef = useRef(0);
  useEffect(() => {
    if (spinning) {
      speedRef.current = 30;
      const animate = () => {
        speedRef.current = Math.max(speedRef.current * 0.991, 3);
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
  const ITEM_H = 50;
  const repeated = [...names, ...names, ...names, ...names, ...names];
  const totalH = repeated.length * ITEM_H;
  const y = -(offset % totalH);

  return (
    <div style={{ position: "relative", width: "100%", height: 148, overflow: "hidden", borderRadius: 14, background: "#EEF2FF", border: `1.5px solid ${BLUE}20` }}>
      <div style={{ position: "absolute", inset: "0 0 auto", height: 44, background: `linear-gradient(to bottom, #EEF2FF, transparent)`, zIndex: 2 }} />
      <div style={{ position: "absolute", inset: "auto 0 0", height: 44, background: `linear-gradient(to top, #EEF2FF, transparent)`, zIndex: 2 }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", zIndex: 1, pointerEvents: "none" }}>
        <div style={{ width: "100%", height: ITEM_H, background: `${BLUE}0A`, borderTop: `1.5px solid ${BLUE}20`, borderBottom: `1.5px solid ${BLUE}20` }} />
      </div>
      <div style={{ transform: `translateY(${y + totalH / 2 - ITEM_H * 2.5}px)`, willChange: "transform" }}>
        {repeated.map((name, i) => (
          <div key={i} style={{ height: ITEM_H, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, color: BLUE2 }}>{name}</div>
        ))}
      </div>
    </div>
  );
}

// needed for DrumRoll
import { useEffect } from "react";

// ── Page ──────────────────────────────────────────────────────────────────────
export default function TombolaPage() {
  const heroRef  = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end end"] });

  // Text parallax: moves up faster than the sticky viewport
  const textY  = useTransform(heroProgress, [0, 1], [0, -220]);
  const sTextY = useSpring(textY, { stiffness: 70, damping: 20 });

  // Scroll progress for the whole page (progress bar)
  const { scrollYProgress } = useScroll();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [input, setInput]       = useState("");
  const [nextId, setNextId]     = useState(1);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner]     = useState<Participant | null>(null);
  const [showWinner, setShowWinner] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [winners, setWinners]   = useState<Winner[]>([]);
  const [round, setRound]       = useState(1);

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
    setSpinning(true); setShowWinner(false); setWinner(null);
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setTimeout(() => {
      setSpinning(false); setWinner(picked); setShowWinner(true);
      setConfetti(true);
      setWinners((prev) => [{ participant: picked, round }, ...prev]);
      setRound((r) => r + 1);
      setTimeout(() => setConfetti(false), 3500);
    }, 2800);
  }, [pool, spinning, round]);

  function reset() { setWinners([]); setRound(1); setWinner(null); setShowWinner(false); }

  return (
    <>
      <style>{`
        @keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(720deg);opacity:0} }
        @keyframes winnerPop { 0%{transform:scale(0.6) translateY(20px);opacity:0} 70%{transform:scale(1.06);opacity:1} 100%{transform:scale(1) translateY(0);opacity:1} }
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(300%)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-11px)} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 8px 28px rgba(36,84,212,0.38),inset 0 1px 0 rgba(255,255,255,0.18)} 50%{box-shadow:0 8px 40px rgba(36,84,212,0.6),0 0 0 6px rgba(36,84,212,0.12),inset 0 1px 0 rgba(255,255,255,0.18)} }
        .winner-pop { animation: winnerPop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .float-ticket { animation: float 3.8s ease-in-out infinite; }
        .draw-pulse { animation: pulseGlow 2s ease-in-out infinite; }
      `}</style>

      <Confetti active={confetti} />

      {/* ── Scroll progress bar ── */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 100, background: "rgba(0,0,0,0.06)" }}>
        <motion.div style={{ height: "100%", scaleX: scrollYProgress, transformOrigin: "left", background: `linear-gradient(to right, ${TEAL}, ${BLUE})` }} />
      </div>

      {/* ══════════════════════════════════════════════
          HERO — 290vh tall, ticket is sticky inside
         ══════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{ height: "290vh", position: "relative", background: `linear-gradient(160deg, ${BLUE} 0%, ${BLUE2} 55%, ${TEAL2} 100%)` }}
      >
        {/* Sticky viewport */}
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>

          {/* Bg blobs */}
          <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", top: -150, right: -100, background: `radial-gradient(circle, ${TEAL}20, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", width: 450, height: 450, borderRadius: "50%", bottom: -100, left: -80, background: "radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)", pointerEvents: "none" }} />

          {/* Serpentine path overlay */}
          <SerpentinePath progress={heroProgress} />

          {/* Layout: text left — ticket right */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(32px,6vw,80px)", padding: "0 32px", width: "100%", maxWidth: 960, position: "relative", zIndex: 10 }}>

            {/* Left: text — moves FASTER than the ticket */}
            <motion.div style={{ y: sTextY, flex: "0 0 auto", maxWidth: 380 }}>
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", marginBottom: 14 }}
              >
                AssoConnect · Outil interne
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                style={{ color: WHITE, fontSize: "clamp(2.4rem,5vw,3.6rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: 18 }}
              >
                Grand Tirage<br /><span style={{ color: TEAL }}>au Sort</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}
              >
                Ajoutez vos participants et laissez le hasard révéler le gagnant en quelques secondes.
              </motion.p>

              {/* Stats pills */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}
              >
                {[
                  { icon: "👥", label: "Participants", val: participants.length },
                  { icon: "⚡", label: "En lice", val: pool.length },
                  { icon: "🔄", label: "Tour", val: round },
                ].map(({ icon, label, val }) => (
                  <div key={label} style={{ background: "rgba(255,255,255,0.11)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 12, padding: "10px 18px", textAlign: "center", minWidth: 80 }}>
                    <div style={{ color: WHITE, fontWeight: 900, fontSize: 20 }}>{icon} {val}</div>
                    <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: 600, marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
              >
                <span style={{ animation: "float 1.5s ease-in-out infinite" }}>↓</span> Faire défiler pour animer le ticket
              </motion.p>
            </motion.div>

            {/* Right: sticky ticket — less parallax (only rotates) */}
            <motion.div
              className="float-ticket"
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
              style={{ flex: "0 0 auto", zIndex: 10 }}
            >
              <Ticket3D heroProgress={heroProgress} />
            </motion.div>
          </div>

          {/* Scroll cue */}
          <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 24, height: 38, border: "2px solid rgba(255,255,255,0.25)", borderRadius: 12, display: "flex", justifyContent: "center", paddingTop: 6 }}>
              <motion.div style={{ width: 4, height: 8, background: WHITE, borderRadius: 4 }}
                animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }} />
            </div>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: "1.5px" }}>SCROLL</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PARTICIPANTS
         ══════════════════════════════════════════════ */}
      <section style={{ background: BG, padding: "72px 16px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {/* Section header */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${BLUE}16`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👥</div>
            <div>
              <h2 style={{ fontWeight: 900, fontSize: 22, color: BLUE2, margin: 0 }}>Participants</h2>
              <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>Un nom par ligne ou séparés par une virgule</p>
            </div>
          </div>

          <div style={{ background: WHITE, borderRadius: 20, border: "1px solid #E2E8F0", boxShadow: "0 4px 24px rgba(36,84,212,0.07)", overflow: "hidden" }}>
            {/* Input row */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", gap: 12 }}>
              <div style={{ flex: 1, position: "relative" }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addParticipant(); } }}
                  placeholder="Alice&#10;Bob, Charlie&#10;David…"
                  rows={3}
                  style={{
                    width: "100%", boxSizing: "border-box", borderRadius: 12, padding: "11px 14px",
                    fontSize: 14, fontWeight: 500, border: `1.5px solid #E2E8F0`, outline: "none",
                    resize: "none", background: "#F8FAFF", color: BLUE2, fontFamily: "inherit",
                    lineHeight: 1.6,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = BLUE)}
                  onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
                />
              </div>
              <FancyButton onClick={addParticipant} disabled={!input.trim()}>
                <span>＋</span><span>Ajouter</span>
              </FancyButton>
            </div>

            {participants.length > 0 ? (
              <div style={{ padding: "18px 24px", display: "flex", flexWrap: "wrap", gap: 8 }}>
                {participants.map((p) => {
                  const drawn = winners.some((w) => w.participant.id === p.id);
                  return (
                    <motion.span
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "5px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600,
                        background: drawn ? "#F1F5F9" : `${BLUE}13`,
                        color: drawn ? "#94A3B8" : BLUE,
                        border: `1px solid ${drawn ? "#E2E8F0" : `${BLUE}28`}`,
                        textDecoration: drawn ? "line-through" : "none",
                      }}
                    >
                      {drawn ? "🏆 " : ""}{p.name}
                      {!drawn && (
                        <button onClick={() => setParticipants((prev) => prev.filter((x) => x.id !== p.id))}
                          style={{ background: "none", border: "none", cursor: "pointer", color: `${BLUE}70`, padding: 0, fontSize: 15, lineHeight: 1, fontFamily: "inherit" }}>
                          ×
                        </button>
                      )}
                    </motion.span>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: "36px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🎫</div>
                <p style={{ color: "#94A3B8", fontSize: 14, fontWeight: 500 }}>Aucun participant — commencez par en ajouter !</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TIRAGE
         ══════════════════════════════════════════════ */}
      <section style={{ background: WHITE, padding: "72px 16px 88px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 4 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${TEAL}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🎰</div>
            <div>
              <h2 style={{ fontWeight: 900, fontSize: 22, color: BLUE2, margin: 0 }}>Tirage au sort</h2>
              <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>{pool.length} participant{pool.length !== 1 ? "s" : ""} en lice</p>
            </div>
          </div>

          <div style={{ background: BG, borderRadius: 24, border: "1px solid #E2E8F0", boxShadow: "0 4px 24px rgba(36,84,212,0.06)", padding: "28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
            {pool.length > 0 ? (
              <>
                <DrumRoll names={pool.map((p) => p.name)} spinning={spinning} />

                {showWinner && winner && (
                  <motion.div
                    className="winner-pop"
                    style={{
                      width: "100%", borderRadius: 18, padding: "22px 26px", textAlign: "center",
                      background: `linear-gradient(135deg, ${BLUE}12, ${TEAL}0E)`,
                      border: `2px solid ${TEAL}50`,
                    }}
                  >
                    <p style={{ color: "#64748B", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 8 }}>
                      🏆 Gagnant — Tour {round - 1}
                    </p>
                    <p style={{ fontSize: 30, fontWeight: 900, color: BLUE2 }}>{winner.name}</p>
                  </motion.div>
                )}

                <div className={spinning ? "" : "draw-pulse"} style={{ width: "100%", borderRadius: 14 }}>
                  <FancyButton onClick={draw} disabled={spinning} fullWidth>
                    <span style={{ fontSize: 18 }}>{spinning ? "⏳" : "🎰"}</span>
                    <span>{spinning ? "Tirage en cours…" : "Lancer le tirage"}</span>
                    {!spinning && <span style={{ marginLeft: 4, opacity: 0.6 }}>→</span>}
                  </FancyButton>
                </div>
              </>
            ) : participants.length === 0 ? (
              <div style={{ padding: "24px 0", textAlign: "center" }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>🎟️</div>
                <p style={{ color: "#94A3B8", fontSize: 15, fontWeight: 500 }}>Ajoutez des participants pour commencer</p>
              </div>
            ) : (
              <div style={{ padding: "24px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 18, textAlign: "center" }}>
                <div style={{ fontSize: 52 }}>🎉</div>
                <div>
                  <p style={{ fontWeight: 900, fontSize: 20, color: BLUE2, marginBottom: 6 }}>Tous les participants ont été tirés !</p>
                  <p style={{ color: "#64748B", fontSize: 14 }}>Réinitialisez pour recommencer une nouvelle tombola.</p>
                </div>
                <FancyButton onClick={reset} variant="ghost">
                  <span>↺</span><span>Recommencer</span>
                </FancyButton>
              </div>
            )}
          </div>

          {/* Palmarès */}
          {winners.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: BG, borderRadius: 20, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 2px 16px rgba(36,84,212,0.05)" }}
            >
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontWeight: 800, fontSize: 17, color: BLUE2, margin: 0 }}>🏆 Palmarès</h3>
                <FancyButton onClick={reset} variant="ghost">
                  <span style={{ fontSize: 12 }}>↺ Réinitialiser</span>
                </FancyButton>
              </div>
              {winners.map((w, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  style={{ padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: i < winners.length - 1 ? "1px solid #F1F5F9" : "none" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                      background: i === 0 ? "#FFF7ED" : i === 1 ? "#F0F9FF" : i === 2 ? "#F0FDF4" : "#F8FAFF" }}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🎖️"}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 15, color: BLUE2 }}>{w.participant.name}</span>
                  </div>
                  <div style={{ background: `${BLUE}11`, color: BLUE, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: "0.5px" }}>
                    Tour {w.round}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: BLUE2, padding: "28px 24px", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, margin: 0 }}>
          Propulsé par <span style={{ color: TEAL, fontWeight: 700 }}>AssoConnect</span> — la plateforme de gestion pour associations
        </p>
      </footer>
    </>
  );
}
