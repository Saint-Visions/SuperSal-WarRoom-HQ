import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb, decimal, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  biometricEnabled: boolean("biometric_enabled").default(false),
  lastLogin: timestamp("last_login"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id).notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  status: text("status").notNull().default("lead"), // lead, prospect, client, closed
  ghlContactId: text("ghl_contact_id"),
  lastContactDate: timestamp("last_contact_date"),
  notes: text("notes"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").notNull().default("medium"), // low, medium, high
  status: text("status").notNull().default("pending"), // pending, in_progress, completed
  dueDate: timestamp("due_date"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const kpiMetrics = pgTable("kpi_metrics", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id).notNull(),
  metricName: text("metric_name").notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  change: decimal("change", { precision: 5, scale: 2 }),
  period: text("period").notNull().default("monthly"), // daily, weekly, monthly
  source: text("source").notNull(), // stripe, ghl, manual
  metadata: jsonb("metadata"),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

export const calendarEvents = pgTable("calendar_events", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id).notNull(),
  googleEventId: text("google_event_id"),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: text("location"),
  attendees: jsonb("attendees"),
  meetingType: text("meeting_type"), // call, meeting, demo, etc.
  status: text("status").default("confirmed"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const aiMemory = pgTable("ai_memory", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id).notNull(),
  sessionId: text("session_id"),
  type: text("type").notNull(), // learning, processed, updated
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  embedding: text("embedding"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workflows = pgTable("workflows", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  definition: jsonb("definition").notNull(), // workflow nodes and connections
  status: text("status").notNull().default("draft"), // draft, active, paused
  triggerType: text("trigger_type").notNull(), // webhook, schedule, manual
  lastRun: timestamp("last_run"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id).notNull(),
  title: text("title"),
  messages: jsonb("messages").notNull().default([]),
  model: text("model").notNull().default("gpt-4o"),
  tokensUsed: integer("tokens_used").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertKpiMetricSchema = createInsertSchema(kpiMetrics).omit({
  id: true,
  recordedAt: true,
});

export const insertCalendarEventSchema = createInsertSchema(calendarEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiMemorySchema = createInsertSchema(aiMemory).omit({
  id: true,
  createdAt: true,
});

export const insertWorkflowSchema = createInsertSchema(workflows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type KpiMetric = typeof kpiMetrics.$inferSelect;
export type InsertKpiMetric = z.infer<typeof insertKpiMetricSchema>;
export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;
export type AiMemory = typeof aiMemory.$inferSelect;
export type InsertAiMemory = z.infer<typeof insertAiMemorySchema>;
export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;

// SuperSal Executive Tasks
export const supersalTasks = pgTable("supersal_tasks", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  instructions: text("instructions"),
  priority: text("priority").default("medium"), // low, medium, high, urgent
  status: text("status").default("pending"), // pending, in_progress, completed, cancelled
  dueDate: timestamp("due_date"),
  completed: boolean("completed").default(false),
  aiGenerated: boolean("ai_generated").default(false),
  supersalResponse: text("supersal_response"),
  tags: jsonb("tags"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Business Operations
export const businesses = pgTable("businesses", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  type: text("type"), // client, partner, vendor, internal
  ghlAccountId: text("ghl_account_id"),
  status: text("status").default("active"), // active, inactive, pending
  revenue: decimal("revenue", { precision: 10, scale: 2 }),
  lastContact: timestamp("last_contact"),
  notes: text("notes"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// War Room System Status
export const systemStatus = pgTable("system_status", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  service: text("service").notNull(), // ghl, azure, stripe, openai, twilio
  status: text("status").notNull(), // online, offline, degraded, maintenance
  lastCheck: timestamp("last_check").defaultNow(),
  responseTime: integer("response_time"), // in milliseconds
  errorCount: integer("error_count").default(0),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for new tables
export const insertSupersalTaskSchema = createInsertSchema(supersalTasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBusinessSchema = createInsertSchema(businesses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for new tables
export type SupersalTask = typeof supersalTasks.$inferSelect;
export type InsertSupersalTask = z.infer<typeof insertSupersalTaskSchema>;
export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type SystemStatus = typeof systemStatus.$inferSelect;
