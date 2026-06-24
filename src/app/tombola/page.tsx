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

const BLUE = "#2454D4";
const BLUE2 = "#1A3FAA";
const TEAL = "#00BFA5";
const TEAL2 = "#00897B";
const BG = "#F0F4FF";

type SubPage = "lots" | "reglement" | "inscrire" | null;

const LOTS = [
  {
    rank: "1er Prix",
    label: "Une glace",
    emoji: "🍦",
    color: TEAL,
    description: "La douce récompense de la victoire",
  },
  {
    rank: "2e Prix",
    label: "Des fruits",
    emoji: "🍎",
    color: BLUE,
    description: "Un panier de saison généreux",
  },
  {
    rank: "3e Prix",
    label: "Un shot de génépi",
    emoji: "🥃",
    color: BLUE2,
    description: "Pour fêter ça comme il se doit",
  },
  {
    rank: "Lot Bonus",
    label: "Photo du chat de Marion encadrée",
    emoji: "🐱",
    color: TEAL2,
    description: "Collector unique et inestimable",
  },
];

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
      className="relative w-80 h-48 md:w-[420px] md:h-56"
    >
      <div
        className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE2} 100%)`,
          boxShadow: `0 20px 60px ${BLUE}55, 0 4px 20px ${BLUE}33`,
        }}
      >
        {/* Shimmer */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)",
            backgroundSize: "200% 200%",
            animation: "shimmer 3s linear infinite",
          }}
        />

        {/* Teal accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: TEAL }} />

        {/* Perfo line */}
        <div
          className="absolute left-[28%] top-0 bottom-0"
          style={{ borderLeft: "2px dashed rgba(255,255,255,0.2)" }}
        />

        <div className="absolute inset-0 flex">
          {/* Stub */}
          <div className="w-[28%] flex flex-col items-center justify-center gap-2 px-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}
            >
              <span className="text-xs">🎟</span>
            </div>
            <span
              className="text-white font-bold"
              style={{ writingMode: "vertical-rl", fontSize: "8px", letterSpacing: "0.2em", opacity: 0.6 }}
            >
              TOMBOLA WS26
            </span>
          </div>

          {/* Main */}
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-4">
            <div className="text-center">
              <div className="text-xs font-semibold tracking-[0.3em] text-white/60 mb-1 uppercase">
                Grand Tirage
              </div>
              <div className="text-3xl md:text-4xl font-black text-white tracking-tight">
                TOMBOLA
              </div>
              <div
                className="text-xs font-semibold tracking-[0.2em] mt-1 uppercase"
                style={{ color: TEAL }}
              >
                Édition 2025
              </div>
            </div>

            <div className="flex gap-px items-end h-6 opacity-50">
              {[4,7,2,9,5,3,8,1,6,4,7,2,5,8,3,6,1,9,4,7,2,5,8,3].map((h, i) => (
                <div
                  key={i}
                  className="w-0.5"
                  style={{
                    height: `${h * 10}%`,
                    background: i % 4 === 0 ? TEAL : "rgba(255,255,255,0.5)",
                  }}
                />
              ))}
            </div>

            <div className="text-xs font-mono text-white/30 tracking-widest">#2025-4217</div>
          </div>
        </div>

        {/* Corner dots */}
        {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos) => (
          <div
            key={pos}
            className={`absolute ${pos} w-2 h-2 rounded-full`}
            style={{ background: TEAL, boxShadow: `0 0 6px ${TEAL}` }}
          />
        ))}
      </div>

      {/* Shadow depth */}
      <div
        className="absolute inset-0 rounded-2xl -z-10"
        style={{ transform: "translateZ(-12px) translateY(8px)", background: `${BLUE2}44`, filter: "blur(8px)" }}
      />
    </motion.div>
  );
}

function LotsPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      {LOTS.map((lot, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-4 p-4 rounded-xl"
          style={{ background: `${lot.color}0d`, border: `1px solid ${lot.color}33` }}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07 }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: `${lot.color}1a` }}
          >
            {lot.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold tracking-wider uppercase" style={{ color: lot.color }}>
              {lot.rank}
            </div>
            <div className="font-bold text-gray-800">{lot.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{lot.description}</div>
          </div>
        </motion.div>
      ))}
      <motion.button
        className="w-full py-3 rounded-xl font-semibold text-sm text-white mt-2"
        style={{ background: `linear-gradient(90deg, ${BLUE}, ${TEAL})` }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClose}
      >
        Fermer
      </motion.button>
    </div>
  );
}

function ReglementPanel({ onClose }: { onClose: () => void }) {
  const articles = [
    { num: "Art. 1", titre: "Organisateur", texte: "Cette tombola est organisée par l'association WS26." },
    { num: "Art. 2", titre: "Participation", texte: "Ouverte à toute personne ayant acheté un ou plusieurs billets. 1 billet = 1 chance de gagner." },
    { num: "Art. 3", titre: "Tirage au sort", texte: "Le tirage aura lieu publiquement lors de l'événement WS26 2025." },
    { num: "Art. 4", titre: "Lots", texte: "Les lots sont attribués dans l'ordre du tirage. Ils ne peuvent être ni échangés ni remboursés." },
    { num: "Art. 5", titre: "Résultats", texte: "Les gagnants seront annoncés sur place et notifiés par email dans les 24h." },
  ];

  return (
    <div className="flex flex-col gap-3">
      {articles.map((a, i) => (
        <motion.div
          key={i}
          className="p-4 rounded-xl"
          style={{ background: BG, border: "1px solid rgba(36,84,212,0.1)" }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
        >
          <div className="flex gap-3">
            <span className="text-xs font-bold font-mono shrink-0 mt-0.5" style={{ color: TEAL }}>{a.num}</span>
            <div>
              <div className="text-sm font-semibold text-gray-800">{a.titre}</div>
              <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{a.texte}</div>
            </div>
          </div>
        </motion.div>
      ))}
      <motion.button
        className="w-full py-3 rounded-xl font-semibold text-sm text-white mt-1"
        style={{ background: `linear-gradient(90deg, ${BLUE}, ${TEAL})` }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClose}
      >
        Fermer
      </motion.button>
    </div>
  );
}

function InscrirePanel({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", billets: "1" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        className="flex flex-col items-center gap-6 py-6 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
          style={{ background: `${TEAL}1a`, border: `2px solid ${TEAL}` }}
        >
          ✓
        </div>
        <div>
          <div className="text-xl font-bold text-gray-800">Inscription confirmée !</div>
          <div className="text-sm text-gray-500 mt-2">
            Bonjour {form.prenom}, vous avez {form.billets} billet{Number(form.billets) > 1 ? "s" : ""} pour le grand tirage.
            <br />Un email de confirmation sera envoyé à {form.email}.
          </div>
        </div>
        <motion.button
          className="px-8 py-3 rounded-xl font-semibold text-sm text-white"
          style={{ background: `linear-gradient(90deg, ${BLUE}, ${TEAL})` }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
        >
          Fermer
        </motion.button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Prénom</label>
          <input
            required
            value={form.prenom}
            onChange={(e) => setForm({ ...form, prenom: e.target.value })}
            placeholder="Jean"
            className="px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{
              background: BG,
              border: "1.5px solid rgba(36,84,212,0.15)",
            }}
            onFocus={(e) => (e.target.style.borderColor = BLUE)}
            onBlur={(e) => (e.target.style.borderColor = "rgba(36,84,212,0.15)")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom</label>
          <input
            required
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            placeholder="Dupont"
            className="px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{ background: BG, border: "1.5px solid rgba(36,84,212,0.15)" }}
            onFocus={(e) => (e.target.style.borderColor = BLUE)}
            onBlur={(e) => (e.target.style.borderColor = "rgba(36,84,212,0.15)")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="jean.dupont@email.com"
          className="px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
          style={{ background: BG, border: "1.5px solid rgba(36,84,212,0.15)" }}
          onFocus={(e) => (e.target.style.borderColor = BLUE)}
          onBlur={(e) => (e.target.style.borderColor = "rgba(36,84,212,0.15)")}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre de billets</label>
        <div className="grid grid-cols-3 gap-2">
          {["1", "3", "5"].map((n) => (
            <motion.button
              key={n}
              type="button"
              onClick={() => setForm({ ...form, billets: n })}
              className="py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: form.billets === n ? BLUE : BG,
                color: form.billets === n ? "white" : "#374151",
                border: `1.5px solid ${form.billets === n ? BLUE : "rgba(36,84,212,0.15)"}`,
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {n} billet{Number(n) > 1 ? "s" : ""}
            </motion.button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {Number(form.billets) * 2} € · {Number(form.billets) > 1 ? `${Number(form.billets)} chances de gagner` : "1 chance de gagner"}
        </p>
      </div>

      <motion.button
        type="submit"
        className="w-full py-3.5 rounded-xl font-bold text-sm text-white mt-1"
        style={{ background: `linear-gradient(90deg, ${BLUE}, ${TEAL})` }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Confirmer mon inscription →
      </motion.button>

      <p className="text-xs text-gray-400 text-center">
        Vos données ne seront utilisées que dans le cadre de cette tombola.
      </p>
    </form>
  );
}

function SubPageOverlay({ page, onClose }: { page: SubPage; onClose: () => void }) {
  const configs: Record<NonNullable<SubPage>, { title: string; icon: string; color: string }> = {
    lots: { title: "Lots à Gagner", icon: "🎁", color: TEAL },
    reglement: { title: "Règlement", icon: "📋", color: BLUE },
    inscrire: { title: "S'inscrire à la tombola", icon: "🎟", color: BLUE },
  };

  if (!page) return null;
  const cfg = configs[page];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 cursor-pointer"
        style={{ background: "rgba(15,25,60,0.55)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
        style={{ maxHeight: "90vh" }}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 32 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: `${cfg.color}15` }}
            >
              {cfg.icon}
            </div>
            <h2 className="text-lg font-bold text-gray-800">{cfg.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {page === "lots" && <LotsPanel onClose={onClose} />}
          {page === "reglement" && <ReglementPanel onClose={onClose} />}
          {page === "inscrire" && <InscrirePanel onClose={onClose} />}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ActionButton({
  label,
  icon,
  primary,
  onClick,
}: {
  label: string;
  icon: string;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
      style={
        primary
          ? { background: `linear-gradient(90deg, ${BLUE}, ${TEAL})`, color: "white" }
          : { background: "white", color: BLUE, border: `1.5px solid ${BLUE}33` }
      }
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
    >
      <span>{icon}</span>
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

  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });

  const rotateX = useTransform(smooth, [0, 0.5, 1], [10, 0, -10]);
  const rotateY = useTransform(smooth, [0, 1], [-22, 22]);
  const ticketScale = useTransform(smooth, [0, 0.3, 0.7, 1], [0.88, 1, 1, 0.92]);
  const titleY = useTransform(smooth, [0, 1], [0, -140]);
  const titleOpacity = useTransform(smooth, [0, 0.35, 0.65], [1, 1, 0]);
  const subtitleOpacity = useTransform(smooth, [0.25, 0.5, 0.8], [0, 1, 0]);
  const ctaOpacity = useTransform(smooth, [0.62, 0.85], [0, 1]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const bgY = useTransform(smooth, [0, 1], ["0%", "30%"]);

  return (
    <div className="relative" style={{ background: BG }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% -200%; }
          100% { background-position: 200% 200%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      {/* Sticky immersive section */}
      <div ref={heroRef} style={{ height: "300vh" }}>
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

          {/* Background shapes */}
          <motion.div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ y: bgY }}>
            <div
              className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20"
              style={{ background: `radial-gradient(circle, ${BLUE} 0%, transparent 70%)` }}
            />
            <div
              className="absolute -bottom-48 -left-24 w-[400px] h-[400px] rounded-full opacity-15"
              style={{ background: `radial-gradient(circle, ${TEAL} 0%, transparent 70%)` }}
            />
          </motion.div>

          {/* Dots grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.07]"
            style={{
              backgroundImage: `radial-gradient(${BLUE} 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
            }}
          />

          {/* AssoConnect logo area */}
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ background: BLUE }}
            >
              AC
            </div>
            <span className="text-sm font-semibold" style={{ color: BLUE }}>WS26</span>
          </div>

          {/* Title block */}
          <motion.div
            className="absolute top-20 text-center px-6 z-10"
            style={{ y: titleY, opacity: titleOpacity }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{ background: `${TEAL}18`, color: TEAL, border: `1px solid ${TEAL}44` }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: TEAL }} />
              Inscriptions ouvertes · Édition 2025
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-black tracking-tight"
              style={{ color: BLUE }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              Tombola
            </motion.h1>

            <motion.p
              className="text-base text-gray-500 mt-3 max-w-sm mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              Faites défiler pour découvrir votre billet
            </motion.p>
          </motion.div>

          {/* Ticket */}
          <div style={{ perspective: "1200px" }}>
            <Ticket3D rotateX={rotateX} rotateY={rotateY} scale={ticketScale} />
          </div>

          {/* Mid-scroll caption */}
          <motion.p
            className="absolute bottom-36 text-sm font-medium text-center"
            style={{ color: "rgba(36,84,212,0.5)", opacity: subtitleOpacity }}
          >
            4 lots exceptionnels à gagner · Tirage au sort
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="absolute bottom-12 flex flex-wrap gap-3 justify-center px-6"
            style={{ opacity: ctaOpacity }}
          >
            <ActionButton label="Lots à gagner" icon="🎁" onClick={() => setActivePage("lots")} />
            <ActionButton label="Règlement" icon="📋" onClick={() => setActivePage("reglement")} />
            <ActionButton label="S'inscrire" icon="🎟" primary onClick={() => setActivePage("inscrire")} />
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{ opacity: scrollHintOpacity }}
          >
            <motion.div
              className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
              style={{ border: `1.5px solid ${BLUE}44` }}
            >
              <motion.div
                className="w-1 h-1.5 rounded-full"
                style={{ background: BLUE }}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Below-fold section: lots cards + inscription */}
      <div className="relative bg-white">
        {/* Lots section */}
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{ background: `${BLUE}10`, color: BLUE }}
            >
              🎁 Les lots
            </div>
            <h2 className="text-3xl font-black" style={{ color: BLUE }}>Ce que vous pouvez gagner</h2>
            <p className="text-gray-500 mt-2 text-sm">4 lots pour 4 chanceux</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LOTS.map((lot, i) => (
              <motion.div
                key={i}
                className="relative p-6 rounded-2xl overflow-hidden"
                style={{ background: BG, border: `1.5px solid ${lot.color}22` }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: `0 12px 40px ${lot.color}22` }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: `linear-gradient(90deg, ${lot.color}, transparent)` }}
                />
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: `${lot.color}15` }}
                  >
                    {lot.emoji}
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-wider uppercase mb-1" style={{ color: lot.color }}>
                      {lot.rank}
                    </div>
                    <div className="font-bold text-gray-800 text-lg leading-snug">{lot.label}</div>
                    <div className="text-xs text-gray-400 mt-1">{lot.description}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Inscription section */}
        <div style={{ background: BG }} className="py-20 px-6">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-10">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                style={{ background: `${TEAL}18`, color: TEAL, border: `1px solid ${TEAL}44` }}
              >
                🎟 Participez maintenant
              </div>
              <h2 className="text-3xl font-black" style={{ color: BLUE }}>S&apos;inscrire à la tombola</h2>
              <p className="text-gray-500 mt-2 text-sm">Remplissez le formulaire pour réserver vos billets</p>
            </div>

            <div
              className="bg-white rounded-3xl p-8"
              style={{ boxShadow: `0 4px 40px ${BLUE}12`, border: `1px solid ${BLUE}14` }}
            >
              <InscrirePanel onClose={() => {}} />
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              Des questions ? Contactez-nous à{" "}
              <a href="mailto:contact@ws26.fr" style={{ color: BLUE }}>contact@ws26.fr</a>
            </p>
          </div>
        </div>
      </div>

      {/* Sub-page overlays */}
      <AnimatePresence>
        {activePage && (
          <SubPageOverlay page={activePage} onClose={() => setActivePage(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
