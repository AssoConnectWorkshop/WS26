"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type MotionValue, useMotionValue, useTransform } from "framer-motion";

const BLUE = "#2454D4";
const BLUE2 = "#1A3FAA";
const TEAL = "#00BFA5";
const TEAL2 = "#00897B";
const BG = "#F0F4FF";

const LOTS = [
  { rank: "1er Prix", label: "Une glace", emoji: "🍦", color: TEAL },
  { rank: "2e Prix", label: "Des fruits", emoji: "🍎", color: BLUE },
  { rank: "3e Prix", label: "Un shot de génépi", emoji: "🥃", color: BLUE2 },
  { rank: "Lot Bonus", label: "Photo du chat de Marion encadrée", emoji: "🐱", color: TEAL2 },
];

const MOCK_USER = {
  prenom: "Aurélien",
  nom: "Ciesco",
  email: "aurelien.ciesco@assoconnect.com",
  billets: [
    { numero: "#2025-4217", date: "17/06/2025" },
    { numero: "#2025-4218", date: "17/06/2025" },
    { numero: "#2025-4219", date: "17/06/2025" },
    { numero: "#2025-4220", date: "17/06/2025" },
    { numero: "#2025-4221", date: "17/06/2025" },
  ],
  statut: "confirmé",
  tirage: "31/12/2025",
};

function InteractiveTicket({ numero, index }: { numero: string; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-60, 60], [12, -12]) as MotionValue<number>;
  const rotateY = useTransform(x, [-80, 80], [-18, 18]) as MotionValue<number>;

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const resetMouse = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      className="cursor-pointer"
      style={{ perspective: "800px" }}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative w-full h-28 rounded-2xl overflow-hidden"
        whileHover={{ scale: 1.03 }}>
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE2} 100%)`, boxShadow: `0 8px 30px ${BLUE}44` }}>
          <div className="absolute inset-0 opacity-10" style={{ background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)", backgroundSize: "200% 200%", animation: "shimmer 3s linear infinite" }} />
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: TEAL }} />
          <div className="absolute left-[22%] top-0 bottom-0" style={{ borderLeft: "2px dashed rgba(255,255,255,0.2)" }} />

          <div className="absolute inset-0 flex">
            <div className="w-[22%] flex items-center justify-center">
              <span className="text-lg">🎟</span>
            </div>
            <div className="flex-1 flex flex-col justify-center px-4 gap-1">
              <div className="text-xs font-semibold tracking-widest text-white/50 uppercase">Billet de tombola</div>
              <div className="text-white font-bold text-base">{numero}</div>
              <div className="flex gap-1 mt-1">
                {[3,7,2,9,5,3,8,1,6,4,7].map((h, i) => (
                  <div key={i} className="w-0.5 rounded-full" style={{ height: `${h * 2}px`, background: i % 4 === 0 ? TEAL : "rgba(255,255,255,0.35)" }} />
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center pr-4">
              <div className="text-white/30 text-xs font-mono">WS26</div>
            </div>
          </div>

          {["top-2 left-2","top-2 right-2","bottom-2 left-2","bottom-2 right-2"].map((pos) => (
            <div key={pos} className={`absolute ${pos} w-1.5 h-1.5 rounded-full`} style={{ background: TEAL }} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function UserPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"billets" | "lots" | "infos">("billets");
  const totalBillets = MOCK_USER.billets.length;
  const chancesPourcentage = Math.round((totalBillets / 20) * 100);

  return (
    <div className="relative min-h-screen" style={{ background: BG }}>
      <style>{`
        @keyframes shimmer { 0% { background-position: -200% -200%; } 100% { background-position: 200% 200%; } }
      `}</style>

      {/* Persistent background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.10]" style={{ background: `radial-gradient(circle, ${BLUE} 0%, transparent 70%)` }} />
        <div className="absolute bottom-0 -left-16 w-[350px] h-[350px] rounded-full opacity-[0.08]" style={{ background: `radial-gradient(circle, ${TEAL} 0%, transparent 70%)` }} />
        <div className="absolute inset-0 opacity-[0.045]" style={{ backgroundImage: `radial-gradient(${BLUE} 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
      </div>

      {/* Nav */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4" style={{ background: "rgba(240,244,255,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(36,84,212,0.08)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/tombola")} className="text-gray-400 hover:text-gray-600 transition-colors text-sm">←</button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: BLUE }}>AC</div>
            <span className="text-sm font-semibold" style={{ color: BLUE }}>Mon espace tombola</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button onClick={() => router.push("/tombola/admin")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: BLUE }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            Admin 🔑
          </motion.button>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-24 pb-12">

        {/* Profile card */}
        <motion.div className="relative rounded-3xl overflow-hidden mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="h-24 relative" style={{ background: `linear-gradient(135deg, ${BLUE}, ${TEAL})` }}>
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)`, backgroundSize: "16px 16px" }} />
          </div>
          <div className="bg-white/90 backdrop-blur-sm px-6 pb-6">
            <div className="flex items-end gap-4 -mt-8 mb-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold border-4 border-white" style={{ background: BLUE }}>
                {MOCK_USER.prenom[0]}{MOCK_USER.nom[0]}
              </div>
              <div className="pb-1">
                <div className="font-black text-xl text-gray-800">{MOCK_USER.prenom} {MOCK_USER.nom}</div>
                <div className="text-sm text-gray-400">{MOCK_USER.email}</div>
              </div>
              <div className="ml-auto pb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: `${TEAL}15`, color: TEAL2 }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: TEAL }} />
                  {MOCK_USER.statut}
                </span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Billets", value: totalBillets, icon: "🎟", color: BLUE },
                { label: "Chances", value: `${chancesPourcentage}%`, icon: "🎯", color: TEAL },
                { label: "Tirage", value: "31 déc.", icon: "📅", color: BLUE2 },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: BG }}>
                  <div className="text-lg mb-0.5">{s.icon}</div>
                  <div className="font-black text-lg" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl mb-6" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}>
          {[{ key: "billets", label: "Mes billets", icon: "🎟" }, { key: "lots", label: "Les lots", icon: "🎁" }, { key: "infos", label: "Infos tirage", icon: "ℹ️" }].map((tab) => (
            <motion.button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: activeTab === tab.key ? "white" : "transparent", color: activeTab === tab.key ? BLUE : "rgba(107,114,128,0.8)", boxShadow: activeTab === tab.key ? "0 2px 12px rgba(36,84,212,0.12)" : "none" }}
              whileTap={{ scale: 0.97 }}>
              <span>{tab.icon}</span><span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === "billets" && (
            <motion.div key="billets" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", border: `1px solid ${BLUE}14` }}>
                <div className="p-5 border-b border-gray-50">
                  <h2 className="font-bold text-gray-800">Vos {totalBillets} billets</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Survolez un billet pour l&apos;effet 3D</p>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  {MOCK_USER.billets.map((b, i) => (
                    <InteractiveTicket key={b.numero} numero={b.numero} index={i} />
                  ))}
                </div>
                <div className="px-5 py-4 border-t border-gray-50" style={{ background: `${TEAL}08` }}>
                  <div className="flex items-center gap-2 text-xs" style={{ color: TEAL2 }}>
                    <span>✓</span>
                    <span>Vos billets sont enregistrés et participent automatiquement au tirage du {MOCK_USER.tirage}.</span>
                  </div>
                </div>
              </div>

              {/* Progression chances */}
              <motion.div className="mt-4 p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", border: `1px solid ${BLUE}14` }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-700">Vos chances d&apos;être tiré au sort</span>
                  <span className="text-sm font-bold" style={{ color: BLUE }}>{totalBillets} / ~20 billets</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: `${BLUE}15` }}>
                  <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${BLUE}, ${TEAL})` }}
                    initial={{ width: 0 }} animate={{ width: `${Math.min(chancesPourcentage, 100)}%` }} transition={{ duration: 1, delay: 0.5, ease: "easeOut" }} />
                </div>
                <p className="text-xs text-gray-400 mt-2">Plus vous avez de billets, plus vous augmentez vos chances de remporter un lot !</p>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "lots" && (
            <motion.div key="lots" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-col gap-3">
                {LOTS.map((lot, i) => (
                  <motion.div key={i} className="relative p-5 rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.85)", border: `1.5px solid ${lot.color}22`, backdropFilter: "blur(8px)" }}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -3, boxShadow: `0 12px 32px ${lot.color}22` }}>
                    <div className="absolute top-0 left-0 bottom-0 w-1 rounded-l-2xl" style={{ background: lot.color }} />
                    <div className="flex items-center gap-4 pl-3">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `${lot.color}12` }}>{lot.emoji}</div>
                      <div className="flex-1">
                        <div className="text-xs font-bold uppercase tracking-wider" style={{ color: lot.color }}>{lot.rank}</div>
                        <div className="font-black text-gray-800 text-lg">{lot.label}</div>
                      </div>
                      <div className="text-2xl opacity-20">→</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "infos" && (
            <motion.div key="infos" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <div className="flex flex-col gap-4">
                {[
                  { icon: "📅", title: "Date du tirage", content: "31 décembre 2025 lors de l'événement WS26. Le tirage sera effectué en public et enregistré.", color: BLUE },
                  { icon: "🎰", title: "Comment ça marche ?", content: "Chaque billet est mis dans le chapeau virtuel. Les lots sont tirés un par un, dans l'ordre. Vous pouvez gagner un seul lot maximum.", color: TEAL },
                  { icon: "📧", title: "Notification", content: "Si vous êtes tiré au sort, vous recevrez un email à l'adresse fournie lors de l'inscription dans les 24h suivant le tirage.", color: BLUE2 },
                  { icon: "❓", title: "Des questions ?", content: "Contactez-nous à contact@ws26.fr. Notre équipe vous répondra dans les meilleurs délais.", color: TEAL2 },
                ].map((item, i) => (
                  <motion.div key={i} className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.85)", border: `1px solid ${item.color}18`, backdropFilter: "blur(8px)" }}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${item.color}12` }}>{item.icon}</div>
                      <div>
                        <div className="font-bold text-gray-800 mb-1">{item.title}</div>
                        <div className="text-sm text-gray-500 leading-relaxed">{item.content}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
