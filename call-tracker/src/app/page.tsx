import { createAdminClient } from "@/lib/supabase/admin";
import { SyncButton } from "@/components/SyncButton";
import { CallsTable } from "@/components/CallsTable";
import { StatsCards } from "@/components/StatsCards";
import type { Call } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("calls")
    .select("*")
    .order("start_time", { ascending: false });

  const calls = (data ?? []) as Call[];
  const noShowCount = calls.filter((c) => c.no_show).length;

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Call Tracker</h1>
        <SyncButton />
      </header>

      {error && <p className="text-sm text-red-500">{error.message}</p>}

      <StatsCards total={calls.length} noShow={noShowCount} />
      <CallsTable calls={calls} />
    </main>
  );
}
