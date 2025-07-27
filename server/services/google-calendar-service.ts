import { google } from "googleapis";

export interface CalendarEventData {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime: string };
  end: { dateTime: string };
  location?: string;
  attendees?: Array<{ email: string; displayName?: string }>;
}

export class GoogleCalendarService {
  private calendar: any;

  constructor() {
    const credentials = process.env.GOOGLE_CALENDAR_CREDENTIALS;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!credentials && !refreshToken) {
      console.warn("Google Calendar credentials not configured");
      return;
    }

    try {
      const auth = new google.auth.OAuth2(clientId, clientSecret);
      
      if (refreshToken) {
        auth.setCredentials({ refresh_token: refreshToken });
      }

      this.calendar = google.calendar({ version: "v3", auth });
    } catch (error: any) {
      console.error("Google Calendar initialization error:", error.message);
    }
  }

  async getEvents(maxResults: number = 10): Promise<CalendarEventData[]> {
    if (!this.calendar) {
      throw new Error("Google Calendar not configured");
    }

    try {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);

      const response = await this.calendar.events.list({
        calendarId: "primary",
        timeMin: now.toISOString(),
        timeMax: endOfDay.toISOString(),
        maxResults,
        singleEvents: true,
        orderBy: "startTime",
      });

      return response.data.items?.map((event: any) => ({
        id: event.id,
        summary: event.summary || "No title",
        description: event.description,
        start: event.start,
        end: event.end,
        location: event.location,
        attendees: event.attendees?.map((att: any) => ({
          email: att.email,
          displayName: att.displayName,
        })),
      })) || [];
    } catch (error: any) {
      throw new Error(`Google Calendar API error: ${error.message}`);
    }
  }

  async createEvent(eventData: Partial<CalendarEventData>): Promise<CalendarEventData> {
    if (!this.calendar) {
      throw new Error("Google Calendar not configured");
    }

    try {
      const response = await this.calendar.events.insert({
        calendarId: "primary",
        resource: eventData,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(`Google Calendar create event error: ${error.message}`);
    }
  }

  async updateEvent(eventId: string, eventData: Partial<CalendarEventData>): Promise<CalendarEventData> {
    if (!this.calendar) {
      throw new Error("Google Calendar not configured");
    }

    try {
      const response = await this.calendar.events.update({
        calendarId: "primary",
        eventId,
        resource: eventData,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(`Google Calendar update event error: ${error.message}`);
    }
  }
}

export const googleCalendarService = new GoogleCalendarService();
