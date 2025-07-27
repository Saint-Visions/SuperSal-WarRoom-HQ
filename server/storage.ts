import { 
  type User, 
  type InsertUser, 
  type Contact, 
  type InsertContact,
  type Task,
  type InsertTask,
  type KpiMetric,
  type InsertKpiMetric,
  type CalendarEvent,
  type InsertCalendarEvent,
  type AiMemory,
  type InsertAiMemory,
  type Workflow,
  type InsertWorkflow,
  type ChatSession,
  type InsertChatSession,
  type StickyNote,
  type InsertStickyNote
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(id: string, customerId: string, subscriptionId: string): Promise<User>;

  // Contacts
  getContacts(userId: string): Promise<Contact[]>;
  getContact(id: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: string, contact: Partial<Contact>): Promise<Contact>;

  // Tasks
  getTasks(userId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<boolean>;

  // KPI Metrics
  getKpiMetrics(userId: string, period?: string): Promise<KpiMetric[]>;
  createKpiMetric(metric: InsertKpiMetric): Promise<KpiMetric>;

  // Calendar Events
  getCalendarEvents(userId: string, startDate?: Date, endDate?: Date): Promise<CalendarEvent[]>;
  createCalendarEvent(event: InsertCalendarEvent): Promise<CalendarEvent>;
  updateCalendarEvent(id: string, event: Partial<CalendarEvent>): Promise<CalendarEvent>;

  // AI Memory
  getAiMemory(userId: string, limit?: number): Promise<AiMemory[]>;
  createAiMemory(memory: InsertAiMemory): Promise<AiMemory>;

  // Workflows
  getWorkflows(userId: string): Promise<Workflow[]>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow>;

  // Chat Sessions
  getChatSessions(userId: string): Promise<ChatSession[]>;
  getChatSession(id: string): Promise<ChatSession | undefined>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateChatSession(id: string, session: Partial<ChatSession>): Promise<ChatSession>;

  // SuperSal Tasks
  getSupersalTasks(userId: string): Promise<any[]>;
  createSupersalTask(task: any): Promise<any>;
  completeSupersalTask(id: string): Promise<any>;

  // System Status
  getSystemStatus(): Promise<any[]>;

  // Lead Intelligence
  getLeadIntelligence(userId: string): Promise<any[]>;
  createLeadIntelligence(lead: any): Promise<any>;
  enrichLead(leadId: string): Promise<any>;
  searchLeads(searchParams: any): Promise<any[]>;

  // Search Campaigns
  getSearchCampaigns(userId: string): Promise<any[]>;
  createSearchCampaign(campaign: any): Promise<any>;

  // Sticky Notes
  getStickyNotes(userId: string): Promise<StickyNote[]>;
  createStickyNote(note: InsertStickyNote): Promise<StickyNote>;
  updateStickyNote(id: string, note: Partial<StickyNote>): Promise<StickyNote>;
  deleteStickyNote(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private contacts: Map<string, Contact> = new Map();
  private tasks: Map<string, Task> = new Map();
  private kpiMetrics: Map<string, KpiMetric> = new Map();
  private calendarEvents: Map<string, CalendarEvent> = new Map();
  private aiMemory: Map<string, AiMemory> = new Map();
  private workflows: Map<string, Workflow> = new Map();
  private chatSessions: Map<string, ChatSession> = new Map();
  private supersalTasks: Map<string, any> = new Map();
  private systemStatuses: Map<string, any> = new Map();
  private leadIntelligence: Map<string, any> = new Map();
  private searchCampaigns: Map<string, any> = new Map();
  private stickyNotes: Map<string, StickyNote> = new Map();

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStripeInfo(id: string, customerId: string, subscriptionId: string): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { 
      ...user, 
      stripeCustomerId: customerId, 
      stripeSubscriptionId: subscriptionId,
      updatedAt: new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Contacts
  async getContacts(userId: string): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter(contact => contact.userId === userId);
  }

  async getContact(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      ...insertContact, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async updateContact(id: string, contactUpdate: Partial<Contact>): Promise<Contact> {
    const contact = this.contacts.get(id);
    if (!contact) throw new Error("Contact not found");
    
    const updatedContact = { 
      ...contact, 
      ...contactUpdate,
      updatedAt: new Date()
    };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }

  // Tasks
  async getTasks(userId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = { 
      ...insertTask, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, taskUpdate: Partial<Task>): Promise<Task> {
    const task = this.tasks.get(id);
    if (!task) throw new Error("Task not found");
    
    const updatedTask = { 
      ...task, 
      ...taskUpdate,
      updatedAt: new Date()
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // KPI Metrics
  async getKpiMetrics(userId: string, period?: string): Promise<KpiMetric[]> {
    return Array.from(this.kpiMetrics.values()).filter(metric => 
      metric.userId === userId && (!period || metric.period === period)
    );
  }

  async createKpiMetric(insertMetric: InsertKpiMetric): Promise<KpiMetric> {
    const id = randomUUID();
    const metric: KpiMetric = { 
      ...insertMetric, 
      id,
      recordedAt: new Date()
    };
    this.kpiMetrics.set(id, metric);
    return metric;
  }

  // Calendar Events
  async getCalendarEvents(userId: string, startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> {
    return Array.from(this.calendarEvents.values()).filter(event => {
      if (event.userId !== userId) return false;
      if (startDate && event.startTime < startDate) return false;
      if (endDate && event.endTime > endDate) return false;
      return true;
    });
  }

  async createCalendarEvent(insertEvent: InsertCalendarEvent): Promise<CalendarEvent> {
    const id = randomUUID();
    const event: CalendarEvent = { 
      ...insertEvent, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.calendarEvents.set(id, event);
    return event;
  }

  async updateCalendarEvent(id: string, eventUpdate: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const event = this.calendarEvents.get(id);
    if (!event) throw new Error("Calendar event not found");
    
    const updatedEvent = { 
      ...event, 
      ...eventUpdate,
      updatedAt: new Date()
    };
    this.calendarEvents.set(id, updatedEvent);
    return updatedEvent;
  }

  // AI Memory
  async getAiMemory(userId: string, limit: number = 50): Promise<AiMemory[]> {
    return Array.from(this.aiMemory.values())
      .filter(memory => memory.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createAiMemory(insertMemory: InsertAiMemory): Promise<AiMemory> {
    const id = randomUUID();
    const memory: AiMemory = { 
      ...insertMemory, 
      id,
      createdAt: new Date()
    };
    this.aiMemory.set(id, memory);
    return memory;
  }

  // Workflows
  async getWorkflows(userId: string): Promise<Workflow[]> {
    return Array.from(this.workflows.values()).filter(workflow => workflow.userId === userId);
  }

  async createWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    const id = randomUUID();
    const workflow: Workflow = { 
      ...insertWorkflow, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.workflows.set(id, workflow);
    return workflow;
  }

  async updateWorkflow(id: string, workflowUpdate: Partial<Workflow>): Promise<Workflow> {
    const workflow = this.workflows.get(id);
    if (!workflow) throw new Error("Workflow not found");
    
    const updatedWorkflow = { 
      ...workflow, 
      ...workflowUpdate,
      updatedAt: new Date()
    };
    this.workflows.set(id, updatedWorkflow);
    return updatedWorkflow;
  }

  // Chat Sessions
  async getChatSessions(userId: string): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values()).filter(session => session.userId === userId);
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = randomUUID();
    const session: ChatSession = { 
      ...insertSession, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async updateChatSession(id: string, sessionUpdate: Partial<ChatSession>): Promise<ChatSession> {
    const session = this.chatSessions.get(id);
    if (!session) throw new Error("Chat session not found");
    
    const updatedSession = { 
      ...session, 
      ...sessionUpdate,
      updatedAt: new Date()
    };
    this.chatSessions.set(id, updatedSession);
    return updatedSession;
  }

  // SuperSal Tasks
  async getSupersalTasks(userId: string): Promise<any[]> {
    return Array.from(this.supersalTasks.values())
      .filter(task => task.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createSupersalTask(taskData: any): Promise<any> {
    const id = randomUUID();
    const task = {
      id,
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.supersalTasks.set(id, task);
    return task;
  }

  async completeSupersalTask(id: string): Promise<any> {
    const task = this.supersalTasks.get(id);
    if (!task) {
      throw new Error("Task not found");
    }
    
    task.completed = true;
    task.status = "completed";
    task.updatedAt = new Date().toISOString();
    task.supersalResponse = "Task completed successfully by SuperSal™";
    
    this.supersalTasks.set(id, task);
    return task;
  }

  // System Status
  async getSystemStatus(): Promise<any[]> {
    // Mock system status data
    return [
      {
        id: "azure-status",
        service: "azure",
        status: "connected",
        lastCheck: new Date().toISOString(),
        responseTime: 124,
        errorCount: 0,
        metadata: { version: "2024.1" }
      },
      {
        id: "stripe-status", 
        service: "stripe",
        status: "live",
        lastCheck: new Date().toISOString(),
        responseTime: 89,
        errorCount: 0,
        metadata: { mode: "live" }
      },
      {
        id: "ghl-status",
        service: "ghl", 
        status: "mock",
        lastCheck: new Date().toISOString(),
        responseTime: 156,
        errorCount: 2,
        metadata: { fallback: true }
      },
      {
        id: "twilio-status",
        service: "twilio",
        status: "active", 
        lastCheck: new Date().toISOString(),
        responseTime: 201,
        errorCount: 0,
        metadata: { sms_enabled: true }
      }
    ];
  }

  // Lead Intelligence
  async getLeadIntelligence(userId: string): Promise<any[]> {
    return Array.from(this.leadIntelligence.values())
      .filter(lead => lead.userId === userId)
      .sort((a, b) => b.leadScore - a.leadScore);
  }

  async createLeadIntelligence(leadData: any): Promise<any> {
    const id = randomUUID();
    const lead = {
      id,
      ...leadData,
      enrichedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    this.leadIntelligence.set(id, lead);
    return lead;
  }

  async enrichLead(leadId: string): Promise<any> {
    const lead = this.leadIntelligence.get(leadId);
    if (!lead) {
      throw new Error("Lead not found");
    }

    // Mock enrichment - in production this would call Clearbit/Apollo/Seamless APIs
    lead.contactInfo = {
      emails: [`contact@${lead.domain}`, `sales@${lead.domain}`],
      phone: "+1-555-" + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      linkedin: `https://linkedin.com/company/${lead.companyName.toLowerCase().replace(/\s+/g, '-')}`
    };
    lead.technologies = lead.technologies || ["Salesforce", "HubSpot", "Slack", "AWS"];
    lead.leadScore = Math.min(100, lead.leadScore + 15);
    lead.enrichedAt = new Date().toISOString();

    this.leadIntelligence.set(leadId, lead);
    return lead;
  }

  async searchLeads(searchParams: any): Promise<any[]> {
    const mockLeads = [
      {
        companyName: "TechCorp Solutions",
        domain: "techcorp.com",
        industry: "Technology",
        employeeCount: 250,
        revenue: 15000000,
        location: "San Francisco, CA",
        description: "Leading SaaS provider for enterprise automation",
        leadScore: 85,
        intent: "buying",
        source: "apollo",
        technologies: ["Salesforce", "AWS", "React"],
      },
      {
        companyName: "GrowthMax Inc",
        domain: "growthmax.io",
        industry: "Marketing",
        employeeCount: 150,
        revenue: 8000000,
        location: "Austin, TX",
        description: "Digital marketing agency scaling rapidly",
        leadScore: 78,
        intent: "hiring",
        source: "seamless",
        technologies: ["HubSpot", "Google Analytics", "Slack"],
      },
      {
        companyName: "DataFlow Systems",
        domain: "dataflow.com",
        industry: "Technology",
        employeeCount: 400,
        revenue: 25000000,
        location: "New York, NY",
        description: "Enterprise data analytics platform",
        leadScore: 92,
        intent: "expanding",
        source: "clearbit",
        technologies: ["Snowflake", "Tableau", "AWS"],
      }
    ];

    // Filter based on search parameters
    const filteredLeads = mockLeads.filter(lead => {
      if (searchParams.industry && searchParams.industry !== "all" && 
          lead.industry.toLowerCase() !== searchParams.industry.toLowerCase()) {
        return false;
      }
      if (searchParams.intent && searchParams.intent !== "all" && 
          lead.intent !== searchParams.intent) {
        return false;
      }
      if (searchParams.query && 
          !lead.companyName.toLowerCase().includes(searchParams.query.toLowerCase()) &&
          !lead.description.toLowerCase().includes(searchParams.query.toLowerCase())) {
        return false;
      }
      return true;
    });

    // Create and store the leads
    const storedLeads = [];
    for (const leadData of filteredLeads) {
      const lead = await this.createLeadIntelligence({
        ...leadData,
        userId: "550e8400-e29b-41d4-a716-446655440000" // Mock user ID
      });
      storedLeads.push(lead);
    }

    return storedLeads;
  }

  // Search Campaigns
  async getSearchCampaigns(userId: string): Promise<any[]> {
    return Array.from(this.searchCampaigns.values())
      .filter(campaign => campaign.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createSearchCampaign(campaignData: any): Promise<any> {
    const id = randomUUID();
    const campaign = {
      id,
      ...campaignData,
      createdAt: new Date().toISOString(),
    };
    this.searchCampaigns.set(id, campaign);
    return campaign;
  }

  // Sticky Notes
  async getStickyNotes(userId: string): Promise<StickyNote[]> {
    return Array.from(this.stickyNotes.values())
      .filter(note => note.userId === userId)
      .sort((a, b) => {
        // Pinned notes first, then by creation date
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async createStickyNote(noteData: InsertStickyNote): Promise<StickyNote> {
    const id = randomUUID();
    const note: StickyNote = {
      id,
      ...noteData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.stickyNotes.set(id, note);
    return note;
  }

  async updateStickyNote(id: string, updateData: Partial<StickyNote>): Promise<StickyNote> {
    const note = this.stickyNotes.get(id);
    if (!note) {
      throw new Error("Sticky note not found");
    }

    const updatedNote: StickyNote = {
      ...note,
      ...updateData,
      updatedAt: new Date(),
    };
    this.stickyNotes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteStickyNote(id: string): Promise<boolean> {
    return this.stickyNotes.delete(id);
  }
}

export const storage = new MemStorage();
