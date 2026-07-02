import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  if (typeof body.no_show !== "boolean") {
    return NextResponse.json({ error: "no_show must be a boolean" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("calls").update({ no_show: body.no_show }).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
