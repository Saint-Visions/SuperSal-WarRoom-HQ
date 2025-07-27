import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { openaiService } from "./services/openai-service";
import { azureService } from "./services/azure-service";
import { ghlService } from "./services/ghl-service";
import { stripeService } from "./services/stripe-service";
import { googleCalendarService } from "./services/google-calendar-service";
import { twilioService } from "./services/twilio-service";
import multer from "multer";
import { 
  insertContactSchema, 
  insertTaskSchema, 
  insertKpiMetricSchema,
  insertCalendarEventSchema,
  insertAiMemorySchema,
  insertWorkflowSchema,
  insertChatSessionSchema
} from "@shared/schema";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Mock user for development - in production this would come from authentication
  const mockUserId = "550e8400-e29b-41d4-a716-446655440000";

  // Dashboard Data Endpoints
  app.get("/api/dashboard", async (req, res) => {
    try {
      const [contacts, tasks, kpiMetrics, calendarEvents, aiMemory] = await Promise.all([
        storage.getContacts(mockUserId),
        storage.getTasks(mockUserId),
        storage.getKpiMetrics(mockUserId),
        storage.getCalendarEvents(mockUserId),
        storage.getAiMemory(mockUserId, 10),
      ]);

      // Get external KPIs
      let externalKPIs = {};
      try {
        const [stripeKPIs, ghlKPIs] = await Promise.all([
          stripeService.getKPIMetrics(),
          ghlService.getKPIMetrics(),
        ]);
        externalKPIs = { ...stripeKPIs, ...ghlKPIs };
      } catch (error) {
        console.error("External KPIs error:", error);
      }

      res.json({
        contacts: contacts.slice(0, 10), // Recent contacts
        tasks: tasks.filter(t => !t.completed).slice(0, 10), // Pending tasks
        kpiMetrics: kpiMetrics.slice(0, 10),
        calendarEvents: calendarEvents.filter(e => e.startTime > new Date()).slice(0, 10),
        aiMemory: aiMemory.slice(0, 5),
        externalKPIs,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Dashboard data error: " + error.message });
    }
  });

  // Google Calendar Integration
  app.get("/api/calendar/events", async (req, res) => {
    try {
      const events = await googleCalendarService.getEvents(20);
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ message: "Calendar events error: " + error.message });
    }
  });

  app.post("/api/calendar/events", async (req, res) => {
    try {
      const event = await googleCalendarService.createEvent(req.body);
      
      // Also save to local database
      const localEvent = await storage.createCalendarEvent({
        userId: mockUserId,
        googleEventId: event.id,
        title: event.summary,
        description: event.description || null,
        startTime: new Date(event.start.dateTime),
        endTime: new Date(event.end.dateTime),
        location: event.location || null,
        attendees: event.attendees || null,
      });

      res.json({ googleEvent: event, localEvent });
    } catch (error: any) {
      res.status(500).json({ message: "Create calendar event error: " + error.message });
    }
  });

  // Contacts Management
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts(mockUserId);
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ message: "Get contacts error: " + error.message });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse({ ...req.body, userId: mockUserId });
      const contact = await storage.createContact(validatedData);
      res.json(contact);
    } catch (error: any) {
      res.status(400).json({ message: "Create contact error: " + error.message });
    }
  });

  app.put("/api/contacts/:id", async (req, res) => {
    try {
      const contact = await storage.updateContact(req.params.id, req.body);
      res.json(contact);
    } catch (error: any) {
      res.status(400).json({ message: "Update contact error: " + error.message });
    }
  });

  // Tasks Management
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks(mockUserId);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: "Get tasks error: " + error.message });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse({ ...req.body, userId: mockUserId });
      const task = await storage.createTask(validatedData);
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ message: "Create task error: " + error.message });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.updateTask(req.params.id, req.body);
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ message: "Update task error: " + error.message });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const success = await storage.deleteTask(req.params.id);
      res.json({ success });
    } catch (error: any) {
      res.status(400).json({ message: "Delete task error: " + error.message });
    }
  });

  // KPI Metrics
  app.get("/api/kpi-metrics", async (req, res) => {
    try {
      const period = req.query.period as string;
      const metrics = await storage.getKpiMetrics(mockUserId, period);
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ message: "Get KPI metrics error: " + error.message });
    }
  });

  app.post("/api/kpi-metrics", async (req, res) => {
    try {
      const validatedData = insertKpiMetricSchema.parse({ ...req.body, userId: mockUserId });
      const metric = await storage.createKpiMetric(validatedData);
      res.json(metric);
    } catch (error: any) {
      res.status(400).json({ message: "Create KPI metric error: " + error.message });
    }
  });

  // AI Chat Interface
  app.get("/api/chat/sessions", async (req, res) => {
    try {
      const sessions = await storage.getChatSessions(mockUserId);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ message: "Get chat sessions error: " + error.message });
    }
  });

  app.post("/api/chat/sessions", async (req, res) => {
    try {
      const validatedData = insertChatSessionSchema.parse({ ...req.body, userId: mockUserId });
      const session = await storage.createChatSession(validatedData);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ message: "Create chat session error: " + error.message });
    }
  });

  app.post("/api/chat/completions", async (req, res) => {
    try {
      const { messages, sessionId, model } = req.body;
      
      // Create chat completion
      const response = await openaiService.createChatCompletion(messages, { model });
      
      // Update session with new messages
      if (sessionId) {
        const session = await storage.getChatSession(sessionId);
        if (session) {
          const updatedMessages = [...session.messages as any[], ...messages, { role: "assistant", content: response }];
          await storage.updateChatSession(sessionId, { 
            messages: updatedMessages,
            tokensUsed: (session.tokensUsed || 0) + response.length 
          });
        }
      }

      res.json({ response });
    } catch (error: any) {
      res.status(500).json({ message: "Chat completion error: " + error.message });
    }
  });

  // File Upload and Processing
  app.post("/api/files/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { buffer, mimetype, originalname } = req.file;
      
      // Process file based on type
      let processedContent = "";
      if (mimetype.startsWith('image/')) {
        const base64 = buffer.toString('base64');
        processedContent = await openaiService.analyzeImage(base64);
      } else if (mimetype.startsWith('audio/')) {
        processedContent = await openaiService.transcribeAudio(buffer, originalname);
      } else {
        processedContent = buffer.toString('utf-8');
      }

      // Create AI memory entry
      const memory = await storage.createAiMemory({
        userId: mockUserId,
        type: "processed",
        content: `Processed file: ${originalname}\n\nContent: ${processedContent}`,
        metadata: { filename: originalname, mimetype, size: buffer.length },
      });

      res.json({ 
        success: true, 
        filename: originalname,
        content: processedContent,
        memoryId: memory.id 
      });
    } catch (error: any) {
      res.status(500).json({ message: "File upload error: " + error.message });
    }
  });

  // Voice Services
  app.post("/api/voice/speech-to-text", upload.single('audio'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No audio file uploaded" });
      }

      const text = await azureService.speechToText(req.file.buffer);
      res.json({ text });
    } catch (error: any) {
      res.status(500).json({ message: "Speech-to-text error: " + error.message });
    }
  });

  app.post("/api/voice/text-to-speech", async (req, res) => {
    try {
      const { text } = req.body;
      const audioBuffer = await azureService.textToSpeech(text);
      
      res.set({
        'Content-Type': 'audio/wav',
        'Content-Length': audioBuffer.length,
      });
      res.send(audioBuffer);
    } catch (error: any) {
      res.status(500).json({ message: "Text-to-speech error: " + error.message });
    }
  });

  // Azure Cognitive Search
  app.post("/api/search", async (req, res) => {
    try {
      const { query, indexName } = req.body;
      const results = await azureService.cognitiveSearch(query, indexName);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ message: "Search error: " + error.message });
    }
  });

  // Workflows
  app.get("/api/workflows", async (req, res) => {
    try {
      const workflows = await storage.getWorkflows(mockUserId);
      res.json(workflows);
    } catch (error: any) {
      res.status(500).json({ message: "Get workflows error: " + error.message });
    }
  });

  app.post("/api/workflows", async (req, res) => {
    try {
      const validatedData = insertWorkflowSchema.parse({ ...req.body, userId: mockUserId });
      const workflow = await storage.createWorkflow(validatedData);
      res.json(workflow);
    } catch (error: any) {
      res.status(400).json({ message: "Create workflow error: " + error.message });
    }
  });

  app.put("/api/workflows/:id", async (req, res) => {
    try {
      const workflow = await storage.updateWorkflow(req.params.id, req.body);
      res.json(workflow);
    } catch (error: any) {
      res.status(400).json({ message: "Update workflow error: " + error.message });
    }
  });

  // External API Testing
  app.post("/api/external/test", async (req, res) => {
    try {
      const { method, url, headers, body } = req.body;
      
      const response = await fetch(url, {
        method,
        headers: headers || {},
        body: body && method !== 'GET' ? JSON.stringify(body) : undefined,
      });

      const data = await response.text();
      
      res.json({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: data,
      });
    } catch (error: any) {
      res.status(500).json({ message: "API test error: " + error.message });
    }
  });

  // GoHighLevel Integration
  app.get("/api/ghl/contacts", async (req, res) => {
    try {
      const contacts = await ghlService.getContacts();
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ message: "GHL contacts error: " + error.message });
    }
  });

  app.get("/api/ghl/opportunities", async (req, res) => {
    try {
      const opportunities = await ghlService.getOpportunities();
      res.json(opportunities);
    } catch (error: any) {
      res.status(500).json({ message: "GHL opportunities error: " + error.message });
    }
  });

  // Stripe Integration
  app.post("/api/stripe/payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      const clientSecret = await stripeService.createPaymentIntent(amount);
      res.json({ clientSecret });
    } catch (error: any) {
      res.status(500).json({ message: "Stripe payment intent error: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
