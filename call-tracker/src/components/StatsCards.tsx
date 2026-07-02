export function StatsCards({ total, noShow }: { total: number; noShow: number }) {
  const rate = total > 0 ? Math.round((noShow / total) * 100) : 0;

  const stats = [
    { label: "Appels", value: total },
    { label: "No-show", value: noShow },
    { label: "Taux de no-show", value: `${rate}%` },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded border border-foreground/10 p-4">
          <p className="text-xs uppercase tracking-wide opacity-60">{stat.label}</p>
          <p className="text-2xl font-semibold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
