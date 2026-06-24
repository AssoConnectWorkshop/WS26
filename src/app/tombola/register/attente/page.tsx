"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";

const BLUE = "#2454D4";
const TEAL = "#00BFA5";
const TEAL2 = "#00897B";
const BG = "#F0F4FF";

const LOTS = [
  { emoji: "🍦", label: "Une glace" },
  { emoji: "🍎", label: "Des fruits" },
  { emoji: "🥃", label: "Un shot de génépi" },
  { emoji: "🐱", label: "Photo du chat de Marion" },
];

function AttenteContent() {
  const params = useSearchParams();
  const prenom = params.get("prenom") ?? "vous";
  const nom = params.get("nom") ?? "";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden" style={{ background: BG }}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 right-0 w-[450px] h-[450px] rounded-full opacity-[0.09]" style={{ background: `radial-gradient(circle, ${BLUE} 0%, transparent 70%)` }} />
        <div className="absolute bottom-0 -left-16 w-[350px] h-[350px] rounded-full opacity-[0.07]" style={{ background: `radial-gradient(circle, ${TEAL} 0%, transparent 70%)` }} />
        <div className="absolute inset-0 opacity-[0.045]" style={{ backgroundImage: `radial-gradient(${BLUE} 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
      </div>

      <div className="relative w-full max-w-sm flex flex-col items-center gap-6 text-center">

        {/* Animated checkmark */}
        <motion.div
          className="relative w-28 h-28"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        >
          {/* Rings */}
          {[1, 0.6, 0.3].map((opacity, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full"
              style={{ border: `2px solid ${TEAL}`, opacity }}
              animate={{ scale: [1, 1.3 + i * 0.2], opacity: [opacity, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
            />
          ))}
          <div className="absolute inset-0 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${TEAL}20, ${BLUE}20)`, border: `3px solid ${TEAL}` }}>
            <motion.span
              className="text-4xl"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 400 }}
            >
              ✓
            </motion.span>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: TEAL }}>Inscription confirmée</div>
          <h1 className="text-3xl font-black" style={{ color: BLUE }}>
            Bonne chance,<br />{prenom} {nom} !
          </h1>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            Votre billet est enregistré pour le grand tirage du <strong className="text-gray-600">31 décembre 2025</strong>.
          </p>
        </motion.div>

        {/* Ticket visuel */}
        <motion.div
          className="w-full rounded-2xl overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${BLUE}, #1A3FAA)`, boxShadow: `0 16px 48px ${BLUE}44` }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
        >
          <div className="h-1" style={{ background: TEAL }} />
          <div className="flex">
            <div className="w-[22%] flex items-center justify-center py-5 border-r-2 border-dashed border-white/20">
              <span className="text-2xl">🎟</span>
            </div>
            <div className="flex-1 px-5 py-4 flex flex-col justify-center gap-1">
              <div className="text-xs font-semibold tracking-widest text-white/50 uppercase">Votre billet</div>
              <div className="text-white font-black text-lg">{prenom} {nom}</div>
              <div className="text-xs font-mono" style={{ color: TEAL }}>#2025-{String(Math.abs(prenom.length * 17 + nom.length * 31) % 9000 + 1000)}</div>
            </div>
          </div>
        </motion.div>

        {/* Lots */}
        <motion.div className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Lots en jeu</div>
          <div className="grid grid-cols-2 gap-2">
            {LOTS.map((lot, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.7)", border: `1px solid ${BLUE}14` }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + i * 0.08 }}
              >
                <span className="text-lg">{lot.emoji}</span>
                <span className="text-xs font-medium text-gray-600 leading-tight">{lot.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Waiting indicator */}
        <motion.div
          className="flex flex-col items-center gap-3 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ background: BLUE }}
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400">
            En attente du tirage · Édition 2025
          </p>
        </motion.div>

        {/* Footer badge */}
        <motion.div
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: `${TEAL2}12`, border: `1px solid ${TEAL}33` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: TEAL }} />
          <span className="text-xs font-semibold" style={{ color: TEAL2 }}>Vous serez notifié(e) par email après le tirage</span>
        </motion.div>
      </div>
    </div>
  );
}

export default function AttentePage() {
  return (
    <Suspense>
      <AttenteContent />
    </Suspense>
  );
}
