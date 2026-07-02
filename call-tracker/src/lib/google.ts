import { google } from "googleapis";
import { createAdminClient } from "@/lib/supabase/admin";

export function createOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );
}

export async function getAuthorizedClient() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("google_auth")
    .select("refresh_token")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const client = createOAuthClient();
  client.setCredentials({ refresh_token: data.refresh_token });
  return client;
}

export async function saveRefreshToken(refreshToken: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("google_auth")
    .upsert({ id: 1, refresh_token: refreshToken, updated_at: new Date().toISOString() });
  if (error) throw error;
}
