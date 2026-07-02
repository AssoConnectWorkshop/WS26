"use client";

import { useState } from "react";
import type { Call } from "@/lib/types";

export function CallsTable({ calls }: { calls: Call[] }) {
  const [rows, setRows] = useState(calls);
  const [pending, setPending] = useState<Set<string>>(new Set());

  async function toggleNoShow(id: string, value: boolean) {
    setRows((prev) => prev.map((c) => (c.id === id ? { ...c, no_show: value } : c)));
    setPending((prev) => new Set(prev).add(id));

    const res = await fetch(`/api/calls/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ no_show: value }),
    });

    setPending((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

    if (!res.ok) {
      setRows((prev) => prev.map((c) => (c.id === id ? { ...c, no_show: !value } : c)));
    }
  }

  if (rows.length === 0) {
    return <p className="opacity-70">Aucun appel synchronisé pour l&apos;instant.</p>;
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-foreground/10 text-left">
          <th className="py-2 pr-4">Date</th>
          <th className="py-2 pr-4">Titre</th>
          <th className="py-2 pr-4">Invités</th>
          <th className="py-2 pr-4">No-show</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((call) => (
          <tr key={call.id} className="border-b border-foreground/5">
            <td className="py-2 pr-4 whitespace-nowrap">
              {new Date(call.start_time).toLocaleString("fr-FR", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </td>
            <td className="py-2 pr-4">{call.title}</td>
            <td className="py-2 pr-4 opacity-70">
              {call.attendees.map((a) => a.name || a.email).filter(Boolean).join(", ")}
            </td>
            <td className="py-2 pr-4">
              <input
                type="checkbox"
                checked={call.no_show}
                disabled={pending.has(call.id)}
                onChange={(e) => toggleNoShow(call.id, e.target.checked)}
                className="h-4 w-4"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
