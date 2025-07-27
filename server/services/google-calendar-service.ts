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
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    if (!clientId || !clientSecret) {
      console.warn("Google Calendar credentials not configured");
      return;
    }

    try {
      const auth = new google.auth.OAuth2(clientId, clientSecret);
      
      if (refreshToken) {
        auth.setCredentials({ refresh_token: refreshToken });
        this.calendar = google.calendar({ version: "v3", auth });
      } else {
        // OAuth flow needed - for now we'll provide mock data
        console.log("Google Calendar OAuth flow required for full functionality");
      }
    } catch (error: any) {
      console.error("Google Calendar initialization error:", error.message);
    }
  }

  async getEvents(maxResults: number = 10): Promise<CalendarEventData[]> {
    if (!this.calendar) {
      // Return mock calendar events for development
      const now = new Date();
      return [
        {
          id: "cal_001",
          summary: "SuperSal Strategy Review",
          description: "Quarterly business strategy and performance review meeting",
          start: { dateTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString() },
          end: { dateTime: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString() },
          location: "War Room Conference",
          attendees: [{ email: "team@supersal.com", displayName: "SuperSal Team" }]
        },
        {
          id: "cal_002", 
          summary: "Lead Intelligence Briefing",
          description: "Review PartnerTech.ai lead intelligence and campaign performance",
          start: { dateTime: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString() },
          end: { dateTime: new Date(now.getTime() + 4.5 * 60 * 60 * 1000).toISOString() },
          location: "Virtual Meeting",
          attendees: [{ email: "intelligence@partnertech.ai", displayName: "Intelligence Team" }]
        },
        {
          id: "cal_003",
          summary: "Revenue Goal Check-in", 
          description: "Daily revenue tracking and goal assessment",
          start: { dateTime: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString() },
          end: { dateTime: new Date(now.getTime() + 6.5 * 60 * 60 * 1000).toISOString() },
          location: "Command Center",
          attendees: [{ email: "exec@supersal.com", displayName: "Executive Team" }]
        }
      ];
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
