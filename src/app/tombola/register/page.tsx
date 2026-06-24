"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const BLUE = "#2454D4";
const TEAL = "#00BFA5";
const BG = "#F0F4FF";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ prenom: "", nom: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push(`/tombola/register/attente?prenom=${encodeURIComponent(form.prenom)}&nom=${encodeURIComponent(form.nom)}`);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden" style={{ background: BG }}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full opacity-[0.10]" style={{ background: `radial-gradient(circle, ${BLUE} 0%, transparent 70%)` }} />
        <div className="absolute -bottom-24 -left-24 w-[300px] h-[300px] rounded-full opacity-[0.08]" style={{ background: `radial-gradient(circle, ${TEAL} 0%, transparent 70%)` }} />
        <div className="absolute inset-0 opacity-[0.045]" style={{ backgroundImage: `radial-gradient(${BLUE} 1px, transparent 1px)`, backgroundSize: "28px 28px" }} />
      </div>

      <motion.div
        className="relative w-full max-w-sm"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: BLUE }}>AC</div>
            <span className="font-bold text-lg" style={{ color: BLUE }}>WS26</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8" style={{ boxShadow: `0 8px 48px ${BLUE}14`, border: `1px solid ${BLUE}12` }}>
          {/* Ticket icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
              style={{ background: `linear-gradient(135deg, ${BLUE}15, ${TEAL}15)`, border: `2px solid ${BLUE}20` }}
              animate={{ rotate: [0, -4, 4, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🎟
            </motion.div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-black" style={{ color: BLUE }}>Tombola WS26</h1>
            <p className="text-sm text-gray-400 mt-1">Inscrivez-vous en quelques secondes</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { key: "prenom", label: "Prénom", placeholder: "Jean" },
              { key: "nom", label: "Nom", placeholder: "Dupont" },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</label>
                <input
                  required
                  autoComplete="off"
                  value={form[key as "prenom" | "nom"]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="px-4 py-3.5 rounded-xl text-base outline-none transition-all font-medium"
                  style={{ background: BG, border: "2px solid rgba(36,84,212,0.12)", color: "#1f2937" }}
                  onFocus={(e) => { e.target.style.borderColor = BLUE; e.target.style.background = "white"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(36,84,212,0.12)"; e.target.style.background = BG; }}
                />
              </div>
            ))}

            <motion.button
              type="submit"
              disabled={loading || !form.prenom || !form.nom}
              className="w-full py-4 rounded-xl font-bold text-white text-base mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(90deg, ${BLUE}, ${TEAL})` }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}>⟳</motion.span> Inscription…</>
              ) : (
                <>Participer à la tombola →</>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-gray-300 mt-5">
            Édition 2025 · 4 lots à gagner
          </p>
        </div>
      </motion.div>
    </div>
  );
}
