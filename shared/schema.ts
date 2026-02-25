import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Assessment type for hazard risk assessments
export type Assessment = { severity: number; likelihood: number; mitigation: string };

// Users table for authentication
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Safety Plans table - comprehensive pre-task plan
export const safetyPlans = sqliteTable("safety_plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  group: text("group").notNull(),
  taskName: text("task_name").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
  shift: text("shift").notNull(),
  machineNumber: text("machine_number").notNull(),
  region: text("region").notNull().default("Europe - Ireland"),
  system: text("system").notNull().default("Others"),
  canSocialDistance: text("can_social_distance").notNull(),
  q1_specializedTraining: text("q1_specialized_training").notNull(),
  q2_chemicals: text("q2_chemicals").notNull(),
  q3_impactOthers: text("q3_impact_others").notNull(),
  q4_falls: text("q4_falls").notNull(),
  q5_barricades: text("q5_barricades").notNull(),
  q6_loto: text("q6_loto").notNull(),
  q7_lifting: text("q7_lifting").notNull(),
  q8_ergonomics: text("q8_ergonomics").notNull(),
  q9_otherConcerns: text("q9_other_concerns").notNull(),
  q10_headInjury: text("q10_head_injury").notNull(),
  q11_otherPPE: text("q11_other_ppe").notNull(),
  hazards: text("hazards", { mode: "json" }).$type<string[]>().default([]),
  assessments: text("assessments", { mode: "json" }).$type<Record<string, Assessment>>().default({}),
  leadName: text("lead_name").notNull(),
  approverName: text("approver_name"),
  engineers: text("engineers", { mode: "json" }).$type<string[]>().default([]),
  comments: text("comments"),
  status: text("status").notNull().default("pending"),
  shareToken: text("share_token"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const insertSafetyPlanSchema = createInsertSchema(safetyPlans).omit({
  id: true,
  createdAt: true,
});

export type SafetyPlan = typeof safetyPlans.$inferSelect;
export type InsertSafetyPlan = z.infer<typeof insertSafetyPlanSchema>;

// User Preferences table for storing user settings
export const userPreferences = sqliteTable("user_preferences", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().default("default"),
  system: text("system").notNull().default("Others"),
  group: text("group").notNull().default("Europe"),
  site: text("site").notNull().default("F34 Intel Ireland"),
  isFirstTime: text("is_first_time").notNull().default("true"),
  role: text("role").notNull().default("user"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;

// Report List types for JSON fields
export type JobDetailsReport = {
  safetyPlanId: number;
  versionId: string;
  group: string;
  taskName: string;
  date: string;
  location: string;
  shift: string;
  machineNumber: string;
  region: string;
  system: string;
  leadName: string;
  approverName: string | null;
  engineers: string[];
  comments: string | null;
};

export type SafetyRiskReport = {
  safetyQuestions: {
    q1_specializedTraining: string;
    q2_chemicals: string;
    q3_impactOthers: string;
    q4_falls: string;
    q5_barricades: string;
    q6_loto: string;
    q7_lifting: string;
    q8_ergonomics: string;
    q9_otherConcerns: string;
    q10_headInjury: string;
    q11_otherPPE: string;
    canSocialDistance: string;
  };
  hazards: string[];
  assessments: Record<string, Assessment>;
};

export type SRBInfo = {
  required: boolean;
  hazardsRequiringSRB: string[];
  checklistsRequired: string[];
  notes: string | null;
};

export type ApprovalInfo = {
  currentStatus: string;
  versions: {
    versionId: string;
    status: string;
    submittedBy: string;
    submittedAt: string;
    approvedBy: string | null;
    approvedAt: string | null;
    comments: string | null;
  }[];
};

// Report List table - comprehensive JSON report of each submission
export const reportList = sqliteTable("report_list", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  safetyPlanId: integer("safety_plan_id").notNull(),
  versionId: text("version_id").notNull(),
  jobDetails: text("job_details", { mode: "json" }).$type<JobDetailsReport>().notNull(),
  safetyRiskAssessment: text("safety_risk_assessment", { mode: "json" }).$type<SafetyRiskReport>().notNull(),
  srbInfo: text("srb_info", { mode: "json" }).$type<SRBInfo>().notNull(),
  approvalInfo: text("approval_info", { mode: "json" }).$type<ApprovalInfo>().notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const insertReportListSchema = createInsertSchema(reportList).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type ReportList = typeof reportList.$inferSelect;
export type InsertReportList = z.infer<typeof insertReportListSchema>;

// Audit Log table - tracks all actions on safety plans
export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  safetyPlanId: integer("safety_plan_id").notNull(),
  action: text("action").notNull(),
  performedBy: text("performed_by").notNull(),
  previousStatus: text("previous_status"),
  newStatus: text("new_status"),
  comments: text("comments"),
  changes: text("changes", { mode: "json" }).$type<Record<string, { old: unknown; new: unknown }>>(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

// ─── Permits ───────────────────────────────────────────────────────────────
export const permits = sqliteTable("permits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  submitter: text("submitter").notNull(),
  manager: text("manager").notNull(),
  location: text("location").notNull().default(""),
  workType: text("work_type").notNull().default(""),
  workDescription: text("work_description").notNull().default(""),
  spq1: text("spq1").notNull().default("no"),
  spq2: text("spq2").notNull().default("no"),
  spq3: text("spq3").notNull().default("no"),
  spq4: text("spq4").notNull().default("no"),
  spq5: text("spq5").notNull().default("no"),
  authorityName: text("authority_name").notNull().default(""),
  status: text("status").notNull().default("draft"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const insertPermitSchema = createInsertSchema(permits).omit({ id: true, createdAt: true });
export type Permit = typeof permits.$inferSelect;
export type InsertPermit = z.infer<typeof insertPermitSchema>;

// ─── Crane Inspections ──────────────────────────────────────────────────────
export const craneInspections = sqliteTable("crane_inspections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  inspector: text("inspector").notNull(),
  buddyInspector: text("buddy_inspector").notNull(),
  bay: text("bay").notNull(),
  machine: text("machine").notNull(),
  date: text("date").notNull(),
  q1: text("q1").notNull().default("no"),
  q2: text("q2").notNull().default("no"),
  q3: text("q3").notNull().default("no"),
  status: text("status").notNull().default("draft"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const insertCraneInspectionSchema = createInsertSchema(craneInspections).omit({ id: true, createdAt: true });
export type CraneInspection = typeof craneInspections.$inferSelect;
export type InsertCraneInspection = z.infer<typeof insertCraneInspectionSchema>;

// ─── Draeger Calibrations ───────────────────────────────────────────────────
export const draegerCalibrations = sqliteTable("draeger_calibrations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nc12: text("nc_12").notNull(),
  serialNumber: text("serial_number").notNull(),
  calibrationDate: text("calibration_date").notNull(),
  calibratedBy: text("calibrated_by").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const insertDraegerCalibrationSchema = createInsertSchema(draegerCalibrations).omit({ id: true, createdAt: true, updatedAt: true });
export type DraegerCalibration = typeof draegerCalibrations.$inferSelect;
export type InsertDraegerCalibration = z.infer<typeof insertDraegerCalibrationSchema>;

// ─── Incidents ──────────────────────────────────────────────────────────────
export const incidents = sqliteTable("incidents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  severity: integer("severity").notNull().default(1),
  assignedInvestigator: text("assigned_investigator").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const insertIncidentSchema = createInsertSchema(incidents).omit({ id: true, createdAt: true });
export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = z.infer<typeof insertIncidentSchema>;

// ─── Documents ──────────────────────────────────────────────────────────────
export const documents = sqliteTable("documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  sharepointUrl: text("sharepoint_url").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, createdAt: true });
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

// Zod schema for form validation
export const safetyPlanFormSchema = z.object({
  group: z.string().min(1, "Group is required"),
  taskName: z.string().min(1, "Task description is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  shift: z.string().min(1, "Shift is required"),
  machineNumber: z.string().min(1, "Machine Number is required"),
  region: z.string().default("Europe - Ireland"),
  system: z.enum(["EUV", "DUV", "CSCM", "Trumph", "Others"]).default("Others"),
  canSocialDistance: z.enum(["yes", "no"]),
  q1_specializedTraining: z.enum(["yes", "no"]),
  q2_chemicals: z.enum(["yes", "no"]),
  q3_impactOthers: z.enum(["yes", "no"]),
  q4_falls: z.enum(["yes", "no"]),
  q5_barricades: z.enum(["yes", "no"]),
  q6_loto: z.enum(["yes", "no"]),
  q7_lifting: z.enum(["yes", "no"]),
  q8_ergonomics: z.enum(["yes", "no"]),
  q9_otherConcerns: z.enum(["yes", "no"]),
  q10_headInjury: z.enum(["yes", "no"]),
  q11_otherPPE: z.enum(["yes", "no"]),
  hazards: z.array(z.string()).default([]),
  assessments: z.record(
    z.string(),
    z.object({
      severity: z.number().min(1).max(4),
      likelihood: z.number().min(1).max(4),
      mitigation: z.string()
    })
  ).default({}),
  leadName: z.string().min(1, "Lead Name is required"),
  approverName: z.string().optional(),
  engineers: z.array(z.string()).default([]),
  comments: z.string().optional(),
  status: z.enum(["draft", "pending", "approved", "rejected"]).default("pending"),
});
