import { NextRequest, NextResponse } from "next/server";
import { createOAuthClient, saveRefreshToken } from "@/lib/google";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const client = createOAuthClient();
  const { tokens } = await client.getToken(code);

  if (!tokens.refresh_token) {
    return NextResponse.json(
      {
        error:
          "No refresh token returned. Revoke the app's access at https://myaccount.google.com/permissions and try again (Google only issues a refresh token on first consent).",
      },
      { status: 400 },
    );
  }

  await saveRefreshToken(tokens.refresh_token);
  return NextResponse.redirect(new URL("/", request.url));
}
