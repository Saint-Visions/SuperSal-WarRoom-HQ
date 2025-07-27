import { apiRequest } from "./queryClient";

export interface GHLContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
}

export interface StripeKPIs {
  monthlyRevenue: number;
  revenueChange: number;
  totalCustomers: number;
  activeSubscriptions: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  attendees?: Array<{ email: string; displayName?: string }>;
}

export class IntegrationsService {
  // GoHighLevel Integration
  async getGHLContacts(): Promise<GHLContact[]> {
    try {
      const response = await apiRequest("GET", "/api/ghl/contacts");
      return await response.json();
    } catch (error: any) {
      console.error("GHL contacts error:", error);
      return [];
    }
  }

  async getGHLOpportunities(): Promise<any[]> {
    try {
      const response = await apiRequest("GET", "/api/ghl/opportunities");
      return await response.json();
    } catch (error: any) {
      console.error("GHL opportunities error:", error);
      return [];
    }
  }

  // Stripe Integration
  async getStripeKPIs(): Promise<StripeKPIs | null> {
    try {
      const response = await apiRequest("GET", "/api/stripe/kpis");
      return await response.json();
    } catch (error: any) {
      console.error("Stripe KPIs error:", error);
      return null;
    }
  }

  async createPaymentIntent(amount: number): Promise<string> {
    try {
      const response = await apiRequest("POST", "/api/stripe/payment-intent", { amount });
      const data = await response.json();
      return data.clientSecret;
    } catch (error: any) {
      throw new Error(`Payment intent error: ${error.message}`);
    }
  }

  // Google Calendar Integration
  async getCalendarEvents(): Promise<CalendarEvent[]> {
    try {
      const response = await apiRequest("GET", "/api/calendar/events");
      return await response.json();
    } catch (error: any) {
      console.error("Calendar events error:", error);
      return [];
    }
  }

  async createCalendarEvent(eventData: Partial<CalendarEvent>): Promise<CalendarEvent> {
    try {
      const response = await apiRequest("POST", "/api/calendar/events", eventData);
      return await response.json();
    } catch (error: any) {
      throw new Error(`Create calendar event error: ${error.message}`);
    }
  }

  // Supabase Integration (through our API)
  async queryDatabase(table: string, filters?: any): Promise<any[]> {
    try {
      const response = await apiRequest("GET", `/api/${table}`, filters);
      return await response.json();
    } catch (error: any) {
      console.error(`Database query error for ${table}:`, error);
      return [];
    }
  }

  // Azure Services Integration
  async searchCognitive(query: string, indexName?: string): Promise<any[]> {
    try {
      const response = await apiRequest("POST", "/api/search", {
        query,
        indexName: indexName || "supersal-knowledge"
      });
      return await response.json();
    } catch (error: any) {
      console.error("Cognitive search error:", error);
      return [];
    }
  }

  // Twilio Integration (through API)
  async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      const response = await apiRequest("POST", "/api/twilio/sms", {
        to,
        message
      });
      return response.ok;
    } catch (error: any) {
      console.error("SMS send error:", error);
      return false;
    }
  }

  // External API Testing
  async testExternalAPI(method: string, url: string, headers?: any, body?: any): Promise<any> {
    try {
      const response = await apiRequest("POST", "/api/external/test", {
        method,
        url,
        headers,
        body
      });
      return await response.json();
    } catch (error: any) {
      throw new Error(`External API test error: ${error.message}`);
    }
  }

  // Webhook Management
  async processWebhook(source: string, data: any): Promise<boolean> {
    try {
      const response = await apiRequest("POST", "/api/webhooks/process", {
        source,
        data
      });
      return response.ok;
    } catch (error: any) {
      console.error("Webhook processing error:", error);
      return false;
    }
  }

  // System Health Check
  async checkSystemHealth(): Promise<{ [key: string]: boolean }> {
    try {
      const response = await apiRequest("GET", "/api/health");
      return await response.json();
    } catch (error: any) {
      console.error("Health check error:", error);
      return {};
    }
  }
}

export const integrationsService = new IntegrationsService();
