export type Attendee = {
  email?: string | null;
  name?: string | null;
  response_status?: string | null;
  organizer?: boolean;
};

export type Call = {
  id: string;
  google_event_id: string;
  title: string | null;
  start_time: string;
  end_time: string | null;
  attendees: Attendee[];
  no_show: boolean;
  hubspot_contact_id: string | null;
  claap_recording_url: string | null;
  created_at: string;
};
