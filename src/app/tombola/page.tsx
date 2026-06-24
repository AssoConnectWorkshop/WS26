"use client";

import { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";

const NEON_BLUE = "#4FC3F7";
const NEON_PURPLE = "#CE93D8";
const NEON_TEAL = "#00E5FF";
const NEON_PINK = "#FF4081";

type SubPage = "lots" | "reglement" | "acheter" | null;

function LaserRing({ progress }: { progress: MotionValue<number> }) {
  const rotate = useTransform(progress, [0, 1], [0, 720]);
  const opacity = useTransform(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.4]);

  return (
    <motion.div
      style={{ rotate, opacity }}
      className="absolute inset-0 pointer-events-none"
    >
      <svg viewBox="0 0 400 400" className="w-full h-full">
        <defs>
          <filter id="glow1">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ellipse cx="200" cy="200" rx="185" ry="110"
          fill="none" stroke={NEON_TEAL} strokeWidth="1" strokeOpacity="0.3"
          strokeDasharray="12 6" filter="url(#glow1)" />

        <path d="M 15 200 Q 200 60 385 200" fill="none"
          stroke={NEON_TEAL} strokeWidth="2" strokeOpacity="0.9"
          strokeLinecap="round" filter="url(#glow1)" />

        <path d="M 15 200 Q 200 340 385 200" fill="none"
          stroke={NEON_PURPLE} strokeWidth="1.5" strokeOpacity="0.7"
          strokeLinecap="round" filter="url(#glow1)" />

        {[0, 60, 120, 180, 240, 300].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x = 200 + 185 * Math.cos(rad);
          const y = 200 + 110 * Math.sin(rad);
          return (
            <circle key={angle} cx={x} cy={y} r="4"
              fill={angle % 120 === 0 ? NEON_PINK : NEON_TEAL}
              filter="url(#glow2)" opacity="0.9" />
          );
        })}
      </svg>
    </motion.div>
  );
}

function Ticket3D({
  rotateX,
  rotateY,
  scale,
}: {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  scale: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d", transformPerspective: 1200 }}
      className="relative w-80 h-48 md:w-96 md:h-56"
    >
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0d1117 0%, #161b22 40%, #0d1117 100%)",
          border: "1px solid rgba(79, 195, 247, 0.3)",
          boxShadow: `0 0 40px rgba(79,195,247,0.2), 0 0 80px rgba(79,195,247,0.1), inset 0 0 40px rgba(0,229,255,0.05)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: "linear-gradient(45deg, transparent 30%, rgba(79,195,247,0.4) 50%, transparent 70%)",
            backgroundSize: "200% 200%",
            animation: "shimmer 3s linear infinite",
          }}
        />

        <div
          className="absolute left-1/4 top-0 bottom-0 w-px"
          style={{ borderLeft: "2px dashed rgba(79,195,247,0.2)" }}
        />

        <div className="absolute inset-0 flex">
          <div className="w-1/4 flex flex-col items-center justify-center gap-1 opacity-50">
            <span
              className="text-xs font-mono text-cyan-400"
              style={{ writingMode: "vertical-rl", letterSpacing: "0.2em", fontSize: "9px" }}
            >
              TOMBOLA 2025
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-4">
            <div className="text-center">
              <div className="text-xs font-mono tracking-[0.3em] text-cyan-400 opacity-60 mb-1">
                GRAND TIRAGE
              </div>
              <div
                className="text-2xl md:text-3xl font-bold tracking-wider"
                style={{
                  background: `linear-gradient(90deg, ${NEON_TEAL}, ${NEON_BLUE}, ${NEON_PURPLE})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                TOMBOLA
              </div>
              <div className="text-xs font-mono tracking-[0.2em] text-purple-300 opacity-60 mt-1">
                PRIX EXCEPTIONNELS
              </div>
            </div>

            <div className="flex gap-px items-end h-8">
              {[
                3,7,2,5,8,1,6,4,9,2,7,3,8,5,1,4,9,6,2,7,3,8,5,1,4,9,6,2
              ].map((h, i) => (
                <div
                  key={i}
                  className="w-px"
                  style={{
                    height: `${h * 10}%`,
                    background:
                      i % 7 === 0 ? NEON_TEAL : i % 3 === 0 ? NEON_BLUE : "rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>

            <div className="text-xs font-mono text-white opacity-30 tracking-widest">
              #2025-4217
            </div>
          </div>
        </div>

        {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((pos) => (
          <div
            key={pos}
            className={`absolute ${pos} w-2 h-2 rounded-full`}
            style={{ background: NEON_TEAL, boxShadow: `0 0 8px ${NEON_TEAL}` }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          transform: "translateZ(-8px)",
          background: "linear-gradient(135deg, #00E5FF22, #CE93D822)",
          border: "1px solid rgba(206,147,216,0.1)",
        }}
      />
    </motion.div>
  );
}

function SubPageOverlay({ page, onClose }: { page: SubPage; onClose: () => void }) {
  const configs = {
    lots: {
      title: "Lots à Gagner",
      icon: "✦",
      color: NEON_TEAL,
      items: [
        { rank: "1er Prix", label: "Voyage pour 2 personnes", value: "5 000 €", icon: "✈" },
        { rank: "2e Prix", label: "Smartphone dernière génération", value: "1 200 €", icon: "◈" },
        { rank: "3e Prix", label: "Bon d'achat restaurant gastronomique", value: "500 €", icon: "◇" },
        { rank: "4e–10e Prix", label: "Bon cadeau boutique partenaire", value: "100 €", icon: "◆" },
      ],
    },
    reglement: {
      title: "Règlement",
      icon: "◈",
      color: NEON_PURPLE,
      items: [
        { rank: "Article 1", label: "Organisateur", value: "Association WS26", icon: "◦" },
        { rank: "Article 2", label: "Participation", value: "Ouverte à tous, 1 billet = 1 chance", icon: "◦" },
        { rank: "Article 3", label: "Tirage au sort", value: "Le 31 décembre 2025, en public", icon: "◦" },
        { rank: "Article 4", label: "Résultats", value: "Publiés sur le site officiel sous 48h", icon: "◦" },
      ],
    },
    acheter: {
      title: "Acheter un Billet",
      icon: "◆",
      color: NEON_PINK,
      items: [],
    },
  };

  const cfg = page ? configs[page] : null;
  if (!cfg) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="absolute inset-0 cursor-pointer"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)" }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0d1117 0%, #161b22 100%)",
          border: `1px solid ${cfg.color}44`,
          boxShadow: `0 0 60px ${cfg.color}22, 0 0 120px ${cfg.color}11`,
        }}
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: -20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="relative p-8 pb-6">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-2xl" style={{ color: cfg.color }}>{cfg.icon}</span>
            <h2 className="text-2xl font-bold tracking-wide text-white">{cfg.title}</h2>
          </div>
          <div
            className="h-px w-full mt-4"
            style={{ background: `linear-gradient(90deg, ${cfg.color}88, transparent)` }}
          />
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white opacity-40 hover:opacity-100 transition-opacity"
            style={{ border: "1px solid rgba(255,255,255,0.15)" }}
          >
            ✕
          </button>
        </div>

        <div className="px-8 pb-8">
          {page === "acheter" ? (
            <div className="flex flex-col gap-6">
              <p className="text-white/60 text-sm leading-relaxed">
                Chaque billet vous donne une chance de gagner l&apos;un de nos prix exceptionnels.
                Sécurisé, instantané, inoubliable.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { qty: "1 billet", price: "5 €" },
                  { qty: "5 billets", price: "20 €" },
                  { qty: "10 billets", price: "35 €" },
                ].map((opt) => (
                  <motion.button
                    key={opt.qty}
                    className="flex flex-col items-center gap-1 p-4 rounded-2xl text-center"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${NEON_PINK}44`,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="text-lg font-bold" style={{ color: NEON_PINK }}>{opt.price}</span>
                    <span className="text-xs text-white/40">{opt.qty}</span>
                  </motion.button>
                ))}
              </div>
              <motion.button
                className="w-full py-4 rounded-2xl text-black font-bold tracking-widest text-sm"
                style={{ background: `linear-gradient(90deg, ${NEON_PINK}, ${NEON_PURPLE})` }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ACHETER MAINTENANT
              </motion.button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cfg.items.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <span className="text-xl" style={{ color: cfg.color }}>{item.icon}</span>
                  <div className="flex-1">
                    <div className="text-xs font-mono tracking-wider opacity-40 text-white">{item.rank}</div>
                    <div className="text-white font-medium text-sm">{item.label}</div>
                  </div>
                  <div className="text-sm font-bold" style={{ color: cfg.color }}>{item.value}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function NavButton({
  label,
  icon,
  color,
  onClick,
}: {
  label: string;
  icon: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="relative group flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium tracking-wider overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${color}44`,
        color: "rgba(255,255,255,0.7)",
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse at center, ${color}22 0%, transparent 70%)`,
        }}
      />
      <span style={{ color }}>{icon}</span>
      <span>{label}</span>
    </motion.button>
  );
}

export default function TombolaPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState<SubPage>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });

  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [12, 0, -12]);
  const rotateY = useTransform(smoothProgress, [0, 1], [-25, 25]);
  const ticketScale = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.9]);
  const titleY = useTransform(smoothProgress, [0, 1], [0, -160]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.4, 0.7], [1, 1, 0]);
  const subtitleY = useTransform(smoothProgress, [0, 1], [0, -240]);
  const subtitleOpacity = useTransform(smoothProgress, [0.2, 0.5, 0.8], [0, 1, 0]);
  const laserOpacity = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.5]);
  const bgGlowScale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.3, 1.1]);
  const counterRotate = useTransform(smoothProgress, [0, 1], [0, -360]);
  const counterOpacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 0.5, 0.5, 0.2]);
  const ctaOpacity = useTransform(smoothProgress, [0.6, 0.85], [0, 1]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <div className="relative" style={{ background: "#060810" }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% -200%; }
          100% { background-position: 200% 200%; }
        }
      `}</style>

      <div ref={heroRef} style={{ height: "300vh" }}>
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

          <motion.div className="absolute inset-0 pointer-events-none" style={{ scale: bgGlowScale }}>
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,229,255,0.06) 0%, transparent 70%)`,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 40% 40% at 30% 60%, rgba(206,147,216,0.04) 0%, transparent 60%)`,
              }}
            />
          </motion.div>

          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(79,195,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,247,0.5) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          <motion.div
            className="absolute top-24 text-center z-10"
            style={{ y: titleY, opacity: titleOpacity }}
          >
            <motion.div
              className="text-xs font-mono tracking-[0.5em] mb-4"
              style={{ color: NEON_TEAL }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              ÉDITION 2025
            </motion.div>
            <motion.h1
              className="text-5xl md:text-7xl font-black tracking-tight"
              style={{
                background: `linear-gradient(135deg, #fff 0%, ${NEON_BLUE} 50%, ${NEON_PURPLE} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              TOMBOLA
            </motion.h1>
            <motion.p
              className="text-sm font-mono tracking-[0.3em] mt-3"
              style={{ color: "rgba(255,255,255,0.3)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              FAITES DÉFILER POUR RÉVÉLER
            </motion.p>
          </motion.div>

          <div className="relative flex items-center justify-center" style={{ perspective: "1200px" }}>
            <motion.div
              className="absolute"
              style={{
                width: "480px",
                height: "480px",
                marginLeft: "-240px",
                marginTop: "-240px",
                left: "50%",
                top: "50%",
                opacity: laserOpacity,
              }}
            >
              <LaserRing progress={smoothProgress} />
            </motion.div>

            <motion.div
              className="absolute pointer-events-none"
              style={{
                width: "560px",
                height: "560px",
                marginLeft: "-280px",
                marginTop: "-280px",
                left: "50%",
                top: "50%",
                rotate: counterRotate,
                opacity: counterOpacity,
              }}
            >
              <svg viewBox="0 0 560 560" className="w-full h-full">
                <ellipse
                  cx="280" cy="280" rx="265" ry="160"
                  fill="none" stroke={NEON_PURPLE} strokeWidth="1" strokeOpacity="0.25"
                  strokeDasharray="4 20"
                  style={{ filter: "blur(1px)" }}
                />
              </svg>
            </motion.div>

            <Ticket3D rotateX={rotateX} rotateY={rotateY} scale={ticketScale} />
          </div>

          <motion.div
            className="absolute bottom-32 text-center"
            style={{ y: subtitleY, opacity: subtitleOpacity }}
          >
            <p className="text-sm font-mono tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
              10 LOTS EXCEPTIONNELS · TIRAGE AU SORT · 31 DÉC 2025
            </p>
          </motion.div>

          <motion.div
            className="absolute bottom-12 flex flex-wrap gap-3 justify-center"
            style={{ opacity: ctaOpacity }}
          >
            <NavButton label="Lots à Gagner" icon="✦" color={NEON_TEAL} onClick={() => setActivePage("lots")} />
            <NavButton label="Règlement" icon="◈" color={NEON_PURPLE} onClick={() => setActivePage("reglement")} />
            <NavButton label="Acheter" icon="◆" color={NEON_PINK} onClick={() => setActivePage("acheter")} />
          </motion.div>

          <motion.div
            className="absolute bottom-8 right-8 flex items-center gap-2"
            style={{ opacity: scrollIndicatorOpacity }}
          >
            <motion.div
              className="w-px h-12 origin-top"
              style={{ background: `linear-gradient(to bottom, ${NEON_TEAL}, transparent)` }}
              animate={{ scaleY: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <span
              className="text-xs font-mono tracking-widest"
              style={{ color: NEON_TEAL, writingMode: "vertical-rl" }}
            >
              SCROLL
            </span>
          </motion.div>
        </div>
      </div>

      <div
        className="relative py-24 px-8 text-center border-t"
        style={{ borderColor: "rgba(79,195,247,0.1)" }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-xs font-mono tracking-[0.4em] mb-4" style={{ color: NEON_TEAL }}>
            GRAND TIRAGE 2025
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Tentez votre chance</h2>
          <p className="text-sm leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.4)" }}>
            Participez à notre tombola caritative et remportez des lots exceptionnels tout en soutenant une cause noble.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <NavButton label="Voir les lots" icon="✦" color={NEON_TEAL} onClick={() => setActivePage("lots")} />
            <NavButton label="Acheter un billet" icon="◆" color={NEON_PINK} onClick={() => setActivePage("acheter")} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activePage && (
          <SubPageOverlay page={activePage} onClose={() => setActivePage(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
