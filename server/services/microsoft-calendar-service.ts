import { Client } from '@microsoft/microsoft-graph-client';

export interface CalendarEventData {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime: string };
  end: { dateTime: string };
  location?: string;
  attendees?: Array<{ email: string; displayName?: string }>;
}

export class MicrosoftCalendarService {
  private graphClient: Client | null = null;

  constructor() {
    const clientId = process.env.MICROSOFT_CLIENT_ID;
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
    const tenantId = process.env.MICROSOFT_TENANT_ID;
    const accessToken = process.env.MICROSOFT_ACCESS_TOKEN;

    if (!clientId || !clientSecret) {
      console.warn("Microsoft Calendar credentials not configured");
      return;
    }

    try {
      if (accessToken) {
        this.graphClient = Client.init({
          authProvider: {
            getAccessToken: async () => accessToken
          }
        });
      } else {
        console.log("Microsoft Calendar OAuth flow required for full functionality");
      }
    } catch (error: any) {
      console.error("Microsoft Calendar initialization error:", error.message);
    }
  }

  async getEvents(maxResults: number = 10): Promise<CalendarEventData[]> {
    if (!this.graphClient) {
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

      const events = await this.graphClient
        .api('/me/calendar/events')
        .select('id,subject,body,start,end,location,attendees')
        .filter(`start/dateTime ge '${now.toISOString()}' and start/dateTime le '${endOfDay.toISOString()}'`)
        .orderby('start/dateTime')
        .top(maxResults)
        .get();

      return events.value?.map((event: any) => ({
        id: event.id,
        summary: event.subject || "No title",
        description: event.body?.content,
        start: event.start,
        end: event.end,
        location: event.location?.displayName,
        attendees: event.attendees?.map((att: any) => ({
          email: att.emailAddress?.address,
          displayName: att.emailAddress?.name,
        })),
      })) || [];
    } catch (error: any) {
      throw new Error(`Microsoft Graph API error: ${error.message}`);
    }
  }

  async createEvent(eventData: Partial<CalendarEventData>): Promise<CalendarEventData> {
    if (!this.graphClient) {
      throw new Error("Microsoft Calendar not configured");
    }

    try {
      const event = {
        subject: eventData.summary,
        body: {
          contentType: 'Text',
          content: eventData.description || ''
        },
        start: eventData.start,
        end: eventData.end,
        location: eventData.location ? {
          displayName: eventData.location
        } : undefined,
        attendees: eventData.attendees?.map(att => ({
          emailAddress: {
            address: att.email,
            name: att.displayName
          }
        }))
      };

      const createdEvent = await this.graphClient
        .api('/me/calendar/events')
        .post(event);

      return {
        id: createdEvent.id,
        summary: createdEvent.subject,
        description: createdEvent.body?.content,
        start: createdEvent.start,
        end: createdEvent.end,
        location: createdEvent.location?.displayName,
        attendees: createdEvent.attendees?.map((att: any) => ({
          email: att.emailAddress?.address,
          displayName: att.emailAddress?.name,
        })),
      };
    } catch (error: any) {
      throw new Error(`Microsoft Calendar create event error: ${error.message}`);
    }
  }
}

export const microsoftCalendarService = new MicrosoftCalendarService();