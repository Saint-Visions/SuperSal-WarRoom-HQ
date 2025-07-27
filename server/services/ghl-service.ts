export interface GHLContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tags: string[];
  customFields: Record<string, any>;
  dateAdded: string;
  lastActivity: string;
}

export interface GHLLead {
  id: string;
  contactId: string;
  pipelineId: string;
  stageId: string;
  value: number;
  status: string;
  source: string;
  dateCreated: string;
}

export class GHLService {
  private apiKey: string;
  private baseUrl: string = "https://services.leadconnectorhq.com";

  constructor() {
    this.apiKey = process.env.GHL_API_KEY || process.env.GOHIGHLEVEL_API_KEY || "";
    if (!this.apiKey) {
      console.log("GoHighLevel API key not provided - CRM features will return mock responses");
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`GHL API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(`GHL Service error: ${error.message}`);
    }
  }

  async getContacts(limit: number = 100): Promise<GHLContact[]> {
    const data = await this.makeRequest(`/contacts/?limit=${limit}`);
    return data.contacts || [];
  }

  async getContact(contactId: string): Promise<GHLContact | null> {
    const data = await this.makeRequest(`/contacts/${contactId}`);
    return data.contact || null;
  }

  async createContact(contact: Partial<GHLContact>): Promise<GHLContact> {
    const data = await this.makeRequest("/contacts/", {
      method: "POST",
      body: JSON.stringify(contact),
    });
    return data.contact;
  }

  async updateContact(contactId: string, updates: Partial<GHLContact>): Promise<GHLContact> {
    const data = await this.makeRequest(`/contacts/${contactId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    return data.contact;
  }

  async getOpportunities(limit: number = 100): Promise<GHLLead[]> {
    const data = await this.makeRequest(`/opportunities/?limit=${limit}`);
    return data.opportunities || [];
  }

  async getPipelineData(): Promise<any> {
    const data = await this.makeRequest("/pipelines/");
    return data;
  }

  async getKPIMetrics(): Promise<any> {
    try {
      const [contacts, opportunities] = await Promise.all([
        this.getContacts(1000),
        this.getOpportunities(1000),
      ]);

      const activeLeads = opportunities.filter(opp => opp.status === "open").length;
      const totalRevenue = opportunities
        .filter(opp => opp.status === "won")
        .reduce((sum, opp) => sum + (opp.value || 0), 0);
      
      const conversionRate = opportunities.length > 0 
        ? (opportunities.filter(opp => opp.status === "won").length / opportunities.length) * 100
        : 0;

      return {
        activeLeads,
        totalRevenue: totalRevenue / 100, // Convert from cents
        conversionRate: Math.round(conversionRate * 10) / 10,
        totalContacts: contacts.length,
      };
    } catch (error: any) {
      throw new Error(`GHL KPI metrics error: ${error.message}`);
    }
  }
}

export const ghlService = new GHLService();
