"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SyncButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSync() {
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/sync", { method: "POST" });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error ?? "Erreur de synchronisation");
      return;
    }
    setMessage(`${data.synced} appel(s) synchronisé(s)`);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSync}
        disabled={loading}
        className="rounded bg-foreground px-4 py-2 text-sm text-background disabled:opacity-50"
      >
        {loading ? "Synchronisation..." : "Synchroniser depuis Google Calendar"}
      </button>
      {message && <span className="text-sm opacity-70">{message}</span>}
    </div>
  );
}
