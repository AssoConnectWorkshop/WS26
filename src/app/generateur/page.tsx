"use client";

import { useState } from "react";

// ── AssoConnect logo (inline SVG reproduisant la marque) ──────────────────────
function AssoConnectLogo() {
  return (
    <svg width="180" height="36" viewBox="0 0 180 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="AssoConnect">
      {/* Icon mark — two interlocking rounded squares */}
      <rect x="0" y="4" width="14" height="14" rx="3.5" fill="#6B4FD8" />
      <rect x="8" y="12" width="14" height="14" rx="3.5" fill="#9B7FF4" />
      {/* Wordmark */}
      <text x="28" y="24" fontFamily="Inter, system-ui, sans-serif" fontWeight="700" fontSize="16" fill="#1A1533">Asso</text>
      <text x="72" y="24" fontFamily="Inter, system-ui, sans-serif" fontWeight="700" fontSize="16" fill="#6B4FD8">Connect</text>
    </svg>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const THEMES = [
  { key: "culture",      label: "🎨 Culture & Arts" },
  { key: "sport",        label: "⚽ Sport" },
  { key: "environnement",label: "🌿 Environnement" },
  { key: "social",       label: "🤝 Social & Solidarité" },
  { key: "education",    label: "📚 Éducation" },
  { key: "numerique",    label: "💻 Numérique" },
  { key: "sante",        label: "💊 Santé & Bien-être" },
  { key: "patrimoine",   label: "🏛️ Patrimoine & Histoire" },
];

const TAILLES = [
  { key: "locale",      label: "📍 Locale" },
  { key: "regionale",   label: "🗺️ Régionale" },
  { key: "nationale",   label: "🇫🇷 Nationale" },
];

const PUBLICS = [
  { key: "jeunes",     label: "🧒 Jeunes" },
  { key: "adultes",    label: "🧑 Adultes" },
  { key: "seniors",    label: "👴 Seniors" },
  { key: "familles",   label: "👨‍👩‍👧 Familles" },
  { key: "tous",       label: "🌍 Tous publics" },
];

const STYLES = [
  { key: "serieux",     label: "🎩 Sérieux" },
  { key: "poetique",    label: "✨ Poétique" },
  { key: "dynamique",   label: "⚡ Dynamique" },
  { key: "moderne",     label: "🚀 Moderne" },
];

const VALEURS = [
  { key: "solidarite",  label: "❤️ Solidarité" },
  { key: "innovation",  label: "💡 Innovation" },
  { key: "tradition",   label: "🌳 Tradition" },
  { key: "liberte",     label: "🕊️ Liberté" },
  { key: "excellence",  label: "🏆 Excellence" },
  { key: "inclusion",   label: "♾️ Inclusion" },
];

// ── Word banks ────────────────────────────────────────────────────────────────

const MOTS: Record<string, { noms: string[]; adjectifs: string[] }> = {
  culture: {
    noms: ["Artistes", "Créateurs", "Musiciens", "Conteurs", "Cinéastes", "Danseurs", "Photographes", "Écrivains", "Plasticiens", "Poètes"],
    adjectifs: ["Créatifs", "Inspirés", "Libres", "Engagés", "Passionnés", "Audacieux", "Singuliers", "Vibrants"],
  },
  sport: {
    noms: ["Champions", "Athlètes", "Coureurs", "Nageurs", "Grimpeurs", "Cyclistes", "Marcheurs", "Guerriers", "Lutteurs", "Sprinters"],
    adjectifs: ["Dynamiques", "Déterminés", "Courageux", "Solidaires", "Vaillants", "Indomptables", "Combatifs", "Élancés"],
  },
  environnement: {
    noms: ["Écolos", "Jardiniers", "Protecteurs", "Défenseurs", "Naturalistes", "Semeurs", "Gardiens", "Pionniers", "Sentinelles", "Veilleurs"],
    adjectifs: ["Verts", "Durables", "Responsables", "Engagés", "Résilients", "Conscients", "Vivants", "Terriens"],
  },
  social: {
    noms: ["Bénévoles", "Entraidants", "Voisins", "Citoyens", "Compagnons", "Partenaires", "Alliés", "Tisseurs", "Bâtisseurs", "Veilleurs"],
    adjectifs: ["Solidaires", "Bienveillants", "Inclusifs", "Fraternels", "Généreux", "Chaleureux", "Humains", "Ouverts"],
  },
  education: {
    noms: ["Apprenants", "Formateurs", "Explorateurs", "Chercheurs", "Penseurs", "Passeurs", "Éveilleurs", "Découvreurs", "Savants", "Innovateurs"],
    adjectifs: ["Curieux", "Éclairés", "Brillants", "Ambitieux", "Studieux", "Inspirants", "Visionnaires", "Rigoureux"],
  },
  numerique: {
    noms: ["Makers", "Codeurs", "Hackers", "Innovateurs", "Développeurs", "Geeks", "Bidouilleurs", "Pionniers", "Connectés", "Créateurs"],
    adjectifs: ["Agiles", "Ouverts", "Libres", "Collaboratifs", "Créatifs", "Visionnaires", "Numériques", "Futuristes"],
  },
  sante: {
    noms: ["Soignants", "Aidants", "Patients", "Acteurs", "Thérapeutes", "Praticiens", "Guérisseurs", "Accompagnants"],
    adjectifs: ["Bienveillants", "Actifs", "Préventifs", "Attentifs", "Engagés", "Solidaires", "Vigilants", "Holistiques"],
  },
  patrimoine: {
    noms: ["Gardiens", "Mémoires", "Héritiers", "Passeurs", "Archivistes", "Historiens", "Érudits", "Veilleurs", "Chroniqueurs"],
    adjectifs: ["Fidèles", "Passionnés", "Authentiques", "Ancrés", "Respectueux", "Érudits", "Vigilants", "Attachés"],
  },
};

const MODIFICATEURS_TAILLE: Record<string, string[]> = {
  locale: ["du Quartier", "de Proximité", "du Village", "du Territoire", "de la Commune"],
  regionale: ["Régionale", "de la Région", "du Territoire", "du Bassin", "du Pays"],
  nationale: ["Nationale", "de France", "Française", "Fédérale", "Hexagonale"],
};

const MODIFICATEURS_PUBLIC: Record<string, string[]> = {
  jeunes: ["Jeunes", "Junior", "de la Jeunesse", "des Jeunes"],
  adultes: ["Adultes", "Citoyens", "Actifs"],
  seniors: ["Seniors", "de l'Âge d'Or", "des Aînés", "du Bel Âge"],
  familles: ["Familles", "Familial", "des Familles"],
  tous: ["Pour Tous", "Ouverte", "Inclusive"],
};

const ADVERBES_VALEUR: Record<string, string[]> = {
  solidarite: ["Solidaire", "Fraternelle", "Unie"],
  innovation: ["Innovante", "Pionnière", "Avant-gardiste"],
  tradition: ["Enracinée", "Vivante", "Authentique"],
  liberte: ["Libre", "Indépendante", "Ouverte"],
  excellence: ["d'Excellence", "de Qualité", "Ambitieuse"],
  inclusion: ["Inclusive", "Pour Tous", "Sans Frontières"],
};

const STRUCTURES = [
  "{prefix} {adj} {nom}",
  "{prefix} {nom} {modificateur_taille}",
  "Les {nom}s {adj}s",
  "Collectif {adj} {nom}",
  "Cercle {nom} {adj}",
  "{prefix} {nom} {modificateur_public}",
  "{prefix} {adj} — {valeur}",
  "Mouvement {adj} des {nom}s",
  "Réseau {nom} {adj} {modificateur_taille}",
  "Fédération {valeur} des {nom}s",
  "{nom}s {adj}s {modificateur_taille}",
  "L'Alliance {adj} des {nom}s",
];

const PREFIXES_STYLE: Record<string, string[]> = {
  serieux:   ["Association", "Fédération", "Union", "Société Civile", "Groupement"],
  poetique:  ["Les Âmes", "L'Élan", "Le Souffle", "L'Envol", "La Lumière"],
  dynamique: ["Action", "Mouvement", "Collectif", "Force", "Élan"],
  moderne:   ["Initiative", "Lab", "Hub", "Impact", "Platform"],
};

// ── Generator logic ───────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function genererNom(theme: string, taille: string, public_: string, style: string, valeur: string): string {
  const { noms, adjectifs } = MOTS[theme] ?? MOTS["social"];
  const structure = pick(STRUCTURES);
  const nom = pick(noms);
  const adj = pick(adjectifs);
  const prefix = pick(PREFIXES_STYLE[style] ?? PREFIXES_STYLE["serieux"]);
  const modTaille = pick(MODIFICATEURS_TAILLE[taille] ?? MODIFICATEURS_TAILLE["locale"]);
  const modPublic = pick(MODIFICATEURS_PUBLIC[public_] ?? MODIFICATEURS_PUBLIC["tous"]);
  const valeurMot = pick(ADVERBES_VALEUR[valeur] ?? ADVERBES_VALEUR["solidarite"]);

  return structure
    .replace("{prefix}", prefix)
    .replace("{nom}s", nom + "s")
    .replace("{adj}s", adj + "s")
    .replace("{nom}", nom)
    .replace("{adj}", adj)
    .replace("{modificateur_taille}", modTaille)
    .replace("{modificateur_public}", modPublic)
    .replace("{valeur}", valeurMot);
}

// ── UI helpers ────────────────────────────────────────────────────────────────

type OptionItem = { key: string; label: string };

function OptionGrid({
  options,
  value,
  onChange,
  multi = false,
}: {
  options: OptionItem[];
  value: string | string[];
  onChange: (val: string) => void;
  multi?: boolean;
}) {
  function isSelected(key: string) {
    return multi ? (value as string[]).includes(key) : value === key;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer ${
            isSelected(key)
              ? "bg-[#6B4FD8] text-white border-[#6B4FD8] shadow-sm"
              : "bg-white text-gray-600 border-gray-200 hover:border-[#6B4FD8] hover:text-[#6B4FD8]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold text-gray-700 mb-2">{children}</p>;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GenerateurPage() {
  const [theme, setTheme]     = useState("culture");
  const [taille, setTaille]   = useState("locale");
  const [public_, setPublic]  = useState("tous");
  const [style, setStyle]     = useState("dynamique");
  const [valeur, setValeur]   = useState("solidarite");
  const [noms, setNoms]       = useState<string[]>([]);
  const [favoris, setFavoris] = useState<string[]>([]);
  const [copied, setCopied]   = useState<string | null>(null);

  function generer() {
    const nouveaux = Array.from({ length: 6 }, () =>
      genererNom(theme, taille, public_, style, valeur)
    );
    setNoms(nouveaux);
  }

  function toggleFavori(nom: string) {
    setFavoris((prev: string[]) =>
      prev.includes(nom) ? prev.filter((n: string) => n !== nom) : [...prev, nom]
    );
  }

  function copier(nom: string) {
    navigator.clipboard.writeText(nom);
    setCopied(nom);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F5FF" }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <AssoConnectLogo />
        <span className="text-xs font-medium px-3 py-1 rounded-full text-[#6B4FD8]" style={{ backgroundColor: "#EDE9FF" }}>
          Générateur de noms
        </span>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden px-6 py-16 text-center" style={{ background: "linear-gradient(135deg, #6B4FD8 0%, #9B7FF4 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative max-w-2xl mx-auto flex flex-col items-center gap-4">
          <span className="text-4xl">✨</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Trouve le nom parfait<br />pour ton association
          </h1>
          <p className="text-purple-100 text-lg max-w-md">
            Configure les critères ci-dessous et génère des noms uniques en un clic.
          </p>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-8">

        {/* Criteria card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col gap-6">

          <div>
            <SectionLabel>🎯 Thème de l&apos;association</SectionLabel>
            <OptionGrid options={THEMES} value={theme} onChange={setTheme} />
          </div>

          <div className="border-t border-gray-100" />

          <div>
            <SectionLabel>📍 Portée géographique</SectionLabel>
            <OptionGrid options={TAILLES} value={taille} onChange={setTaille} />
          </div>

          <div className="border-t border-gray-100" />

          <div>
            <SectionLabel>👥 Public cible</SectionLabel>
            <OptionGrid options={PUBLICS} value={public_} onChange={setPublic} />
          </div>

          <div className="border-t border-gray-100" />

          <div>
            <SectionLabel>🎭 Style du nom</SectionLabel>
            <OptionGrid options={STYLES} value={style} onChange={setStyle} />
          </div>

          <div className="border-t border-gray-100" />

          <div>
            <SectionLabel>💜 Valeur principale</SectionLabel>
            <OptionGrid options={VALEURS} value={valeur} onChange={setValeur} />
          </div>

          <button
            onClick={generer}
            className="w-full py-3.5 rounded-xl font-semibold text-white text-base transition-all hover:opacity-90 active:scale-95 mt-2"
            style={{ background: "linear-gradient(135deg, #6B4FD8 0%, #9B7FF4 100%)" }}
          >
            ✨ Générer des noms
          </button>
        </div>

        {/* Results */}
        {noms.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Propositions</h2>
            {noms.map((nom, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center justify-between shadow-sm hover:shadow-md hover:border-purple-200 transition-all group"
              >
                <span className="font-semibold text-gray-900 text-[15px]">{nom}</span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => copier(nom)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-[#6B4FD8] hover:text-[#6B4FD8] transition-colors"
                  >
                    {copied === nom ? "✓ Copié" : "Copier"}
                  </button>
                  <button
                    onClick={() => toggleFavori(nom)}
                    className={`text-lg transition-all hover:scale-125 ${favoris.includes(nom) ? "text-[#6B4FD8]" : "text-gray-300 hover:text-[#9B7FF4]"}`}
                    title={favoris.includes(nom) ? "Retirer des favoris" : "Sauvegarder"}
                  >
                    ★
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Favoris */}
        {favoris.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Mes favoris</h2>
            {favoris.map((nom, i) => (
              <div
                key={i}
                className="rounded-xl px-5 py-4 flex items-center justify-between border"
                style={{ backgroundColor: "#F0EEFF", borderColor: "#C4B5FD" }}
              >
                <span className="font-semibold text-[#4C3899] text-[15px]">{nom}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copier(nom)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-purple-200 text-purple-500 hover:bg-purple-100 transition-colors"
                  >
                    {copied === nom ? "✓ Copié" : "Copier"}
                  </button>
                  <button
                    onClick={() => toggleFavori(nom)}
                    className="text-lg text-[#6B4FD8] hover:scale-110 transition-transform"
                  >
                    ★
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-gray-400">
        Propulsé par <span className="font-semibold text-[#6B4FD8]">AssoConnect</span> — la plateforme de gestion pour associations
      </footer>
    </div>
  );
}
