import { NextResponse } from "next/server";
import { google, calendar_v3 } from "googleapis";
import { getAuthorizedClient } from "@/lib/google";
import { createAdminClient } from "@/lib/supabase/admin";

const LOOKBACK_DAYS = 90;

export async function POST() {
  const auth = await getAuthorizedClient();
  if (!auth) {
    return NextResponse.json(
      { error: "Google account not connected yet. Visit /api/auth/google first." },
      { status: 400 },
    );
  }

  const calendar = google.calendar({ version: "v3", auth });
  const timeMin = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const events: calendar_v3.Schema$Event[] = [];
  let pageToken: string | undefined;

  do {
    const { data } = await calendar.events.list({
      calendarId: "primary",
      timeMin,
      timeMax: new Date().toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 250,
      pageToken,
    });
    events.push(...(data.items ?? []));
    pageToken = data.nextPageToken ?? undefined;
  } while (pageToken);

  const meetEvents = events.filter(
    (event) =>
      Boolean(event.hangoutLink) ||
      event.conferenceData?.conferenceSolution?.key?.type === "hangoutsMeet",
  );

  const rows = meetEvents
    .filter((event) => event.id && event.start?.dateTime)
    .map((event) => ({
      google_event_id: event.id!,
      title: event.summary ?? "(sans titre)",
      start_time: event.start!.dateTime!,
      end_time: event.end?.dateTime ?? null,
      attendees: (event.attendees ?? []).map((a) => ({
        email: a.email,
        name: a.displayName,
        response_status: a.responseStatus,
        organizer: a.organizer ?? false,
      })),
    }));

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("calls")
    .upsert(rows, { onConflict: "google_event_id", ignoreDuplicates: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ synced: rows.length });
}
