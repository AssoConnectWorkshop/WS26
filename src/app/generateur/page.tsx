"use client";

import { useState } from "react";

const STRUCTURES = [
  "Association {adj} {nom}",
  "Les {nom}s {adj}s",
  "Collectif {adj} {nom}",
  "Cercle {nom} {adj}",
  "Club des {nom}s",
  "Mouvement {adj}",
  "Réseau {nom} {adj}",
  "Fédération {adj} des {nom}s",
  "Union {adj} {nom}",
  "Amicale des {nom}s {adj}s",
];

const MOTS: Record<string, { noms: string[]; adjectifs: string[] }> = {
  culture: {
    noms: ["Artistes", "Créateurs", "Musiciens", "Conteurs", "Cinéastes", "Danseurs", "Photographes", "Écrivains"],
    adjectifs: ["Créatifs", "Inspirés", "Libres", "Engagés", "Passionnés", "Curieux", "Ouverts", "Audacieux"],
  },
  sport: {
    noms: ["Champions", "Sportifs", "Athlètes", "Coureurs", "Nageurs", "Grimpeurs", "Cyclistes", "Marcheurs"],
    adjectifs: ["Dynamiques", "Déterminés", "Courageux", "Solidaires", "Actifs", "Performants", "Ambitieux", "Vaillants"],
  },
  environnement: {
    noms: ["Écolos", "Jardiniers", "Protecteurs", "Défenseurs", "Naturalistes", "Citoyens", "Pionniers", "Semeurs"],
    adjectifs: ["Verts", "Durables", "Responsables", "Engagés", "Solidaires", "Conscients", "Résilients", "Vivants"],
  },
  social: {
    noms: ["Bénévoles", "Entraidants", "Voisins", "Citoyens", "Habitants", "Compagnons", "Partenaires", "Alliés"],
    adjectifs: ["Solidaires", "Bienveillants", "Inclusifs", "Fraternels", "Humains", "Chaleureux", "Généreux", "Unis"],
  },
  education: {
    noms: ["Apprenants", "Enseignants", "Formateurs", "Savants", "Explorateurs", "Chercheurs", "Penseurs", "Étudiants"],
    adjectifs: ["Curieux", "Éclairés", "Ouverts", "Inspirants", "Brillants", "Ambitieux", "Innovants", "Studieux"],
  },
  numerique: {
    noms: ["Makers", "Codeurs", "Hackers", "Innovateurs", "Développeurs", "Créateurs", "Geeks", "Techniciens"],
    adjectifs: ["Connectés", "Numériques", "Agiles", "Ouverts", "Libres", "Collaboratifs", "Créatifs", "Pionniers"],
  },
};

const THEMES_LABELS: Record<string, string> = {
  culture: "Culture & Arts",
  sport: "Sport",
  environnement: "Environnement",
  social: "Social & Solidarité",
  education: "Éducation",
  numerique: "Numérique",
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function genererNom(theme: string): string {
  const { noms, adjectifs } = MOTS[theme];
  const structure = pick(STRUCTURES);
  const nom = pick(noms);
  const adj = pick(adjectifs);
  return structure.replace("{nom}", nom).replace("{adj}", adj).replace("{nom}s", nom + "s").replace("{adj}s", adj + "s");
}

export default function GenerateurPage() {
  const [theme, setTheme] = useState("culture");
  const [noms, setNoms] = useState<string[]>([]);
  const [favoris, setFavoris] = useState<string[]>([]);

  function generer() {
    const nouveaux = Array.from({ length: 6 }, () => genererNom(theme));
    setNoms(nouveaux);
  }

  function toggleFavori(nom: string) {
    setFavoris((prev) =>
      prev.includes(nom) ? prev.filter((n) => n !== nom) : [...prev, nom]
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4 gap-10">
      <div className="text-center flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">Générateur de noms d&apos;association</h1>
        <p className="text-gray-500 text-lg">Trouve le nom parfait pour ton association en quelques clics.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-8 w-full max-w-xl flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Thème de l&apos;association</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Object.entries(THEMES_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  theme === key
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generer}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold text-base hover:bg-gray-800 active:scale-95 transition-all"
        >
          ✨ Générer des noms
        </button>
      </div>

      {noms.length > 0 && (
        <div className="w-full max-w-xl flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Propositions</h2>
          {noms.map((nom, i) => (
            <div
              key={i}
              className="bg-white border rounded-xl px-5 py-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="font-medium text-gray-900">{nom}</span>
              <button
                onClick={() => toggleFavori(nom)}
                className={`text-xl transition-transform hover:scale-125 ${favoris.includes(nom) ? "opacity-100" : "opacity-30"}`}
                title={favoris.includes(nom) ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                ★
              </button>
            </div>
          ))}
        </div>
      )}

      {favoris.length > 0 && (
        <div className="w-full max-w-xl flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Mes favoris</h2>
          {favoris.map((nom, i) => (
            <div
              key={i}
              className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4 flex items-center justify-between"
            >
              <span className="font-medium text-gray-900">{nom}</span>
              <button
                onClick={() => toggleFavori(nom)}
                className="text-xl text-yellow-400 hover:scale-125 transition-transform"
              >
                ★
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
