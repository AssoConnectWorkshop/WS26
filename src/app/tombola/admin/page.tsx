"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

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

const MOCK_PARTICIPANTS = [
  { id: 1, prenom: "Sophie", nom: "Martin", email: "sophie.martin@email.com", billets: 3, date: "12/06/2025", statut: "confirmé" },
  { id: 2, prenom: "Lucas", nom: "Bernard", email: "lucas.b@gmail.com", billets: 1, date: "13/06/2025", statut: "confirmé" },
  { id: 3, prenom: "Emma", nom: "Dupont", email: "emma.dupont@outlook.fr", billets: 5, date: "14/06/2025", statut: "confirmé" },
  { id: 4, prenom: "Thomas", nom: "Leroy", email: "t.leroy@email.com", billets: 2, date: "15/06/2025", statut: "en attente" },
  { id: 5, prenom: "Chloé", nom: "Moreau", email: "chloe.m@email.fr", billets: 1, date: "16/06/2025", statut: "confirmé" },
  { id: 6, prenom: "Aurélien", nom: "Ciesco", email: "aurelien.ciesco@assoconnect.com", billets: 5, date: "17/06/2025", statut: "confirmé" },
  { id: 7, prenom: "Marion", nom: "Chat", email: "marion@ws26.fr", billets: 3, date: "18/06/2025", statut: "confirmé" },
];

type Winner = { participant: (typeof MOCK_PARTICIPANTS)[0]; lot: (typeof LOTS)[0] };

function StatCard({ label, value, icon, color, sub }: { label: string; value: string | number; icon: string; color: string; sub?: string }) {
  return (
    <motion.div className="relative rounded-2xl p-6 overflow-hidden" style={{ background: "rgba(255,255,255,0.8)", border: `1.5px solid ${color}22`, backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }}>
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</div>
          <div className="text-3xl font-black" style={{ color }}>{value}</div>
          {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${color}12` }}>{icon}</div>
      </div>
    </motion.div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [participants] = useState(MOCK_PARTICIPANTS);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const [search, setSearch] = useState("");

  const totalBillets = participants.reduce((s, p) => s + p.billets, 0);
  const recette = totalBillets * 2;
  const confirmes = participants.filter((p) => p.statut === "confirmé").length;

  const filtered = participants.filter(
    (p) => p.nom.toLowerCase().includes(search.toLowerCase()) || p.prenom.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())
  );

  const lancerTirage = () => {
    if (drawn) return;
    setDrawing(true);
    setTimeout(() => {
      // Weighted random draw based on ticket count
      const pool: (typeof MOCK_PARTICIPANTS)[0][] = [];
      participants.forEach((p) => { for (let i = 0; i < p.billets; i++) pool.push(p); });

      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      const drawnWinners: Winner[] = [];
      const usedIds = new Set<number>();

      for (const lot of LOTS) {
        const winner = shuffled.find((p) => !usedIds.has(p.id));
        if (winner) { drawnWinners.push({ participant: winner, lot }); usedIds.add(winner.id); }
      }

      setWinners(drawnWinners);
      setDrawing(false);
      setDrawn(true);
    }, 2800);
  };

  return (
    <div className="relative min-h-screen" style={{ background: BG }}>
      {/* Persistent background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full opacity-[0.10]" style={{ background: `radial-gradient(circle, ${BLUE} 0%, transparent 70%)` }} />
        <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full opacity-[0.08]" style={{ background: `radial-gradient(circle, ${TEAL} 0%, transparent 70%)` }} />
        <div className="absolute inset-0 opacity-[0.045]" style={{ backgroundImage: `radial-gradient(${BLUE} 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
      </div>

      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 z-20 flex flex-col" style={{ background: BLUE, boxShadow: "4px 0 24px rgba(36,84,212,0.25)" }}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm bg-white">AC</div>
            <div>
              <div className="text-white font-bold text-sm">WS26</div>
              <div className="text-white/50 text-xs">Administration</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {[
            { icon: "📊", label: "Tableau de bord", active: true },
            { icon: "👥", label: "Participants", active: false },
            { icon: "🎁", label: "Lots", active: false },
            { icon: "🎰", label: "Tirage", active: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all text-sm font-medium"
              style={{ background: item.active ? "rgba(255,255,255,0.15)" : "transparent", color: item.active ? "white" : "rgba(255,255,255,0.55)" }}>
              <span>{item.icon}</span><span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 flex flex-col gap-2">
          <button onClick={() => router.push("/tombola/user")} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all">
            👤 Espace participant
          </button>
          <button onClick={() => router.push("/tombola")} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all">
            ← Retour tombola
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 ml-64 p-8 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: TEAL }}>Administration</div>
              <h1 className="text-3xl font-black" style={{ color: BLUE }}>Tableau de bord</h1>
            </div>
            <motion.button
              onClick={lancerTirage}
              disabled={drawing || drawn}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white disabled:opacity-60"
              style={{ background: drawn ? `linear-gradient(90deg, ${TEAL2}, ${TEAL})` : `linear-gradient(90deg, ${BLUE}, ${TEAL})` }}
              whileHover={!drawn && !drawing ? { scale: 1.04 } : {}}
              whileTap={!drawn && !drawing ? { scale: 0.97 } : {}}
            >
              {drawing ? (
                <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}>⟳</motion.span> Tirage en cours…</>
              ) : drawn ? (
                <><span>✓</span> Tirage effectué</>
              ) : (
                <><span>🎰</span> Lancer le tirage</>
              )}
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Participants" value={participants.length} icon="👥" color={BLUE} sub={`${confirmes} confirmés`} />
          <StatCard label="Billets vendus" value={totalBillets} icon="🎟" color={TEAL} sub="au total" />
          <StatCard label="Recette" value={`${recette} €`} icon="💰" color={TEAL2} sub="à 2€ le billet" />
          <StatCard label="Lots à attribuer" value={LOTS.length} icon="🎁" color={BLUE2} sub="tirage unique" />
        </div>

        {/* Winners */}
        <AnimatePresence>
          {(drawing || drawn) && (
            <motion.div className="mb-8 rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.85)", border: `1.5px solid ${TEAL}33`, backdropFilter: "blur(8px)" }}
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold" style={{ color: BLUE }}>🎰 Résultats du tirage</h2>
              </div>
              <div className="p-6">
                {drawing ? (
                  <div className="flex flex-col items-center gap-4 py-8">
                    <motion.div className="text-5xl" animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>🎰</motion.div>
                    <div className="text-sm font-semibold text-gray-500">Tirage en cours, veuillez patienter…</div>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i} className="w-2 h-2 rounded-full" style={{ background: BLUE }} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {winners.map((w, i) => (
                      <motion.div key={i} className="relative p-5 rounded-xl text-center" style={{ background: `${w.lot.color}0d`, border: `1.5px solid ${w.lot.color}33` }}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: i * 0.2, type: "spring", stiffness: 300 }}>
                        <div className="text-3xl mb-2">{w.lot.emoji}</div>
                        <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: w.lot.color }}>{w.lot.rank}</div>
                        <div className="font-bold text-gray-800 text-sm">{w.participant.prenom} {w.participant.nom}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{w.lot.label}</div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Code */}
        <motion.div className="mb-8 rounded-2xl overflow-hidden flex flex-col sm:flex-row items-center gap-6 p-6"
          style={{ background: "rgba(255,255,255,0.85)", border: `1.5px solid ${BLUE}18`, backdropFilter: "blur(8px)" }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="p-3 rounded-2xl bg-white" style={{ boxShadow: `0 4px 20px ${BLUE}18`, border: `1px solid ${BLUE}10` }}>
            <QRCodeSVG
              value={typeof window !== "undefined" ? `${window.location.origin}/tombola/register` : "/tombola/register"}
              size={140}
              fgColor={BLUE}
              bgColor="white"
              level="M"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: TEAL }}>Inscription rapide</div>
            <h3 className="text-xl font-black mb-2" style={{ color: BLUE }}>QR code participants</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Affichez ce QR code lors de l&apos;événement. Les participants scannent et s&apos;inscrivent en 10 secondes avec juste leur nom et prénom.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: `${TEAL}15`, color: TEAL2 }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: TEAL }} />
                /tombola/register
              </span>
            </div>
          </div>
        </motion.div>

        {/* Participants table */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.85)", border: `1px solid ${BLUE}14`, backdropFilter: "blur(8px)" }}>
          <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold" style={{ color: BLUE }}>Participants ({participants.length})</h2>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher…"
              className="px-3 py-2 rounded-xl text-sm outline-none" style={{ background: BG, border: `1.5px solid ${BLUE}22`, width: "220px" }}
              onFocus={(e) => (e.target.style.borderColor = BLUE)} onBlur={(e) => (e.target.style.borderColor = `${BLUE}22`)} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: `${BG}` }}>
                  {["Participant", "Email", "Billets", "Date", "Statut"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p, i) => (
                  <motion.tr key={p.id} className="hover:bg-blue-50/30 transition-colors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: BLUE }}>
                          {p.prenom[0]}{p.nom[0]}
                        </div>
                        <span className="font-semibold text-gray-800">{p.prenom} {p.nom}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{p.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="font-bold" style={{ color: BLUE }}>{p.billets}</span>
                        <span className="text-gray-400 text-xs">billet{p.billets > 1 ? "s" : ""}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs font-mono">{p.date}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                        style={{ background: p.statut === "confirmé" ? `${TEAL}15` : `${BLUE}10`, color: p.statut === "confirmé" ? TEAL2 : BLUE }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.statut === "confirmé" ? TEAL : BLUE }} />
                        {p.statut}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-50 flex justify-between text-xs text-gray-400">
            <span>{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</span>
            <span>Total billets affichés : {filtered.reduce((s, p) => s + p.billets, 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
