import { NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/google";

export async function GET() {
  const client = createOAuthClient();
  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar.readonly"],
  });
  return NextResponse.redirect(url);
}
