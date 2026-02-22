import { getDb } from "./db";
const db = getDb();
import {
  safetyPlans,
  permits,
  craneInspections,
  draegerCalibrations,
  incidents,
  documents,
  users,
  userPreferences,
  reportList,
  auditLogs
} from "../shared/schema";
import { sql } from "drizzle-orm";

// Clear existing data
async function clearData() {
  console.log("🧹 Clearing existing data...");

  try { await db.run(sql`DELETE FROM audit_logs`); } catch {}
  try { await db.run(sql`DELETE FROM report_list`); } catch {}
  try { await db.run(sql`DELETE FROM user_preferences`); } catch {}
  try { await db.run(sql`DELETE FROM users`); } catch {}
  try { await db.run(sql`DELETE FROM safety_plans`); } catch {}
  try { await db.run(sql`DELETE FROM permits`); } catch {}
  try { await db.run(sql`DELETE FROM crane_inspections`); } catch {}
  try { await db.run(sql`DELETE FROM draeger_calibrations`); } catch {}
  try { await db.run(sql`DELETE FROM incidents`); } catch {}
  try { await db.run(sql`DELETE FROM documents`); } catch {}

  console.log("✅ Existing data cleared!");
}

// Create tables if they don't exist
async function createTables() {
  console.log("🔨 Creating database tables...");

  // Users table
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  // User preferences
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS user_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT DEFAULT 'default',
      "system" TEXT DEFAULT 'Others',
      "group" TEXT DEFAULT 'Europe',
      site TEXT DEFAULT 'F34 Intel Ireland',
      is_first_time TEXT DEFAULT 'true',
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Safety plans
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS safety_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      "group" TEXT NOT NULL,
      task_name TEXT NOT NULL,
      date TEXT NOT NULL,
      location TEXT NOT NULL,
      shift TEXT NOT NULL,
      machine_number TEXT NOT NULL,
      region TEXT DEFAULT 'Europe - Ireland',
      "system" TEXT DEFAULT 'Others',
      can_social_distance TEXT NOT NULL,
      q1_specialized_training TEXT NOT NULL,
      q2_chemicals TEXT NOT NULL,
      q3_impact_others TEXT NOT NULL,
      q4_falls TEXT NOT NULL,
      q5_barricades TEXT NOT NULL,
      q6_loto TEXT NOT NULL,
      q7_lifting TEXT NOT NULL,
      q8_ergonomics TEXT NOT NULL,
      q9_other_concerns TEXT NOT NULL,
      q10_head_injury TEXT NOT NULL,
      q11_other_ppe TEXT NOT NULL,
      hazards TEXT DEFAULT '[]',
      assessments TEXT DEFAULT '{}',
      lead_name TEXT NOT NULL,
      approver_name TEXT,
      engineers TEXT DEFAULT '[]',
      comments TEXT,
      status TEXT DEFAULT 'pending',
      share_token TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Permits
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS permits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      submitter TEXT NOT NULL,
      manager TEXT NOT NULL,
      location TEXT DEFAULT '',
      work_type TEXT DEFAULT '',
      work_description TEXT DEFAULT '',
      spq1 TEXT DEFAULT 'no',
      spq2 TEXT DEFAULT 'no',
      spq3 TEXT DEFAULT 'no',
      spq4 TEXT DEFAULT 'no',
      spq5 TEXT DEFAULT 'no',
      authority_name TEXT DEFAULT '',
      status TEXT DEFAULT 'draft',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Crane inspections
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS crane_inspections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      inspector TEXT NOT NULL,
      buddy_inspector TEXT NOT NULL,
      bay TEXT NOT NULL,
      machine TEXT NOT NULL,
      date TEXT NOT NULL,
      q1 TEXT DEFAULT 'no',
      q2 TEXT DEFAULT 'no',
      q3 TEXT DEFAULT 'no',
      status TEXT DEFAULT 'draft',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Draeger calibrations
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS draeger_calibrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nc_12 TEXT NOT NULL,
      serial_number TEXT NOT NULL,
      calibration_date TEXT NOT NULL,
      calibrated_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Incidents
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS incidents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      type TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      severity INTEGER DEFAULT 1,
      assigned_investigator TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Documents
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      sharepoint_url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("✅ Database tables created!");
}

// Sample data generators
const groups = ["Europe", "Asia", "Americas", "EMEA"];
const locations = ["Fab 34", "Fab 42", "Fab 52", "Clean Room A", "Clean Room B", "Equipment Bay 1", "Equipment Bay 2"];
const shifts = ["Day", "Night", "Swing"];
const machines = ["EUV-001", "DUV-002", "CSCM-003", "Trumpf-004", "Scanner-005"];
const regions = ["Europe - Ireland", "Asia - Singapore", "Americas - Arizona"];
const systems = ["EUV", "DUV", "CSCM", "Trumpf", "Others"];

const names = [
  "John Smith", "Sarah Johnson", "Mike Davis", "Emma Wilson", "David Brown",
  "Lisa Garcia", "Tom Anderson", "Jennifer Lee", "Robert Taylor", "Maria Rodriguez",
  "James Miller", "Anna Martinez", "William Garcia", "Linda Lopez", "Richard Gonzalez"
];

const workTypes = [
  "Maintenance", "Installation", "Calibration", "Cleaning", "Repair",
  "Testing", "Inspection", "Modification", "Replacement", "Upgrade"
];

const incidentTypes = [
  "Slip/Trip/Fall", "Equipment Failure", "Chemical Spill", "Electrical Hazard",
  "Ergonomic Issue", "Near Miss", "Property Damage", "Injury", "Illness"
];

const documentCategories = [
  "Safety Procedures", "Training Materials", "Equipment Manuals",
  "Emergency Response", "Regulatory Compliance", "Audit Reports"
];

function randomDate(start: Date, end: Date): string {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
}

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomChoices<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

async function generateMockData() {
  console.log("🌱 Generating mock data for EHS application...");

  // Clear existing data first
  await clearData();

  // Create tables first
  await createTables();

  // Generate Users
  console.log("👥 Creating users...");
  const userData = [
    { id: generateId(), username: "admin", password: "admin123" },
    { id: generateId(), username: "inspector1", password: "pass123" },
    { id: generateId(), username: "manager", password: "pass123" },
    { id: generateId(), username: "engineer1", password: "pass123" },
    { id: generateId(), username: "engineer2", password: "pass123" },
    { id: generateId(), username: "safety_officer", password: "pass123" }
  ];

  for (const user of userData) {
    await db.insert(users).values(user);
  }

  // Generate User Preferences
  console.log("⚙️ Creating user preferences...");
  for (let i = 0; i < 6; i++) {
    await db.insert(userPreferences).values({
      userId: `user_${i + 1}`,
      system: randomChoice(systems),
      group: randomChoice(groups),
      site: randomChoice(locations),
      isFirstTime: i < 2 ? "true" : "false",
      role: i === 0 ? "admin" : i === 2 ? "manager" : "user",
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // Generate Safety Plans
  console.log("📋 Creating safety plans...");
  for (let i = 0; i < 25; i++) {
    const hazards = randomChoices([
      "Electrical Hazard", "Chemical Exposure", "Fall Risk", "Equipment Failure",
      "Ergonomic Strain", "Noise Exposure", "Thermal Hazard", "Radiation Risk"
    ], Math.floor(Math.random() * 4) + 1);

    const assessments: Record<string, { severity: number; likelihood: number; mitigation: string }> = {};
    hazards.forEach(hazard => {
      assessments[hazard] = {
        severity: Math.floor(Math.random() * 4) + 1,
        likelihood: Math.floor(Math.random() * 4) + 1,
        mitigation: `Implement safety protocols for ${hazard.toLowerCase()}`
      };
    });

    await db.insert(safetyPlans).values({
      group: randomChoice(groups),
      taskName: `${randomChoice(workTypes)} on ${randomChoice(machines)}`,
      date: randomDate(new Date(2024, 0, 1), new Date()),
      location: randomChoice(locations),
      shift: randomChoice(shifts),
      machineNumber: randomChoice(machines),
      region: randomChoice(regions),
      system: randomChoice(systems),
      canSocialDistance: randomChoice(["yes", "no"]),
      q1_specializedTraining: randomChoice(["yes", "no"]),
      q2_chemicals: randomChoice(["yes", "no"]),
      q3_impactOthers: randomChoice(["yes", "no"]),
      q4_falls: randomChoice(["yes", "no"]),
      q5_barricades: randomChoice(["yes", "no"]),
      q6_loto: randomChoice(["yes", "no"]),
      q7_lifting: randomChoice(["yes", "no"]),
      q8_ergonomics: randomChoice(["yes", "no"]),
      q9_otherConcerns: randomChoice(["yes", "no"]),
      q10_headInjury: randomChoice(["yes", "no"]),
      q11_otherPPE: randomChoice(["yes", "no"]),
      hazards,
      assessments,
      leadName: randomChoice(names),
      approverName: Math.random() > 0.3 ? randomChoice(names) : null,
      engineers: randomChoices(names, Math.floor(Math.random() * 3) + 1),
      comments: Math.random() > 0.5 ? `Additional notes for ${randomChoice(workTypes).toLowerCase()} work` : null,
      status: randomChoice(["draft", "pending", "approved", "rejected"]),
      createdAt: new Date()
    });
  }

  // Generate Permits
  console.log("🔐 Creating work permits...");
  for (let i = 0; i < 15; i++) {
    await db.insert(permits).values({
      date: randomDate(new Date(2024, 0, 1), new Date()),
      submitter: randomChoice(names),
      manager: randomChoice(names),
      location: randomChoice(locations),
      workType: randomChoice(workTypes),
      workDescription: `Performing ${randomChoice(workTypes).toLowerCase()} work on ${randomChoice(machines)}`,
      spq1: randomChoice(["yes", "no"]),
      spq2: randomChoice(["yes", "no"]),
      spq3: randomChoice(["yes", "no"]),
      spq4: randomChoice(["yes", "no"]),
      spq5: randomChoice(["yes", "no"]),
      authorityName: randomChoice(names),
      status: randomChoice(["draft", "pending", "approved", "rejected"]),
      createdAt: new Date()
    });
  }

  // Generate Crane Inspections
  console.log("🏗️ Creating crane inspections...");
  const bays = ["Bay A", "Bay B", "Bay C", "Bay D"];
  for (let i = 0; i < 20; i++) {
    await db.insert(craneInspections).values({
      inspector: randomChoice(names),
      buddyInspector: randomChoice(names),
      bay: randomChoice(bays),
      machine: `Crane-${String(i + 1).padStart(3, '0')}`,
      date: randomDate(new Date(2024, 0, 1), new Date()),
      q1: randomChoice(["yes", "no"]),
      q2: randomChoice(["yes", "no"]),
      q3: randomChoice(["yes", "no"]),
      status: randomChoice(["draft", "completed", "failed"]),
      createdAt: new Date()
    });
  }

  // Generate Draeger Calibrations
  console.log("🧪 Creating Draeger calibrations...");
  for (let i = 0; i < 30; i++) {
    await db.insert(draegerCalibrations).values({
      nc12: `NC${String(1000 + i).padStart(4, '0')}`,
      serialNumber: `SN${String(10000 + i).padStart(6, '0')}`,
      calibrationDate: randomDate(new Date(2024, 0, 1), new Date()),
      calibratedBy: randomChoice(names),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // Generate Incidents
  console.log("🚨 Creating incident reports...");
  for (let i = 0; i < 12; i++) {
    await db.insert(incidents).values({
      date: randomDate(new Date(2024, 0, 1), new Date()),
      type: randomChoice(incidentTypes),
      location: randomChoice(locations),
      description: `Incident involving ${randomChoice(machines)} during ${randomChoice(workTypes).toLowerCase()} operations`,
      severity: Math.floor(Math.random() * 4) + 1,
      assignedInvestigator: randomChoice(names),
      status: randomChoice(["open", "investigating", "closed"]),
      createdAt: new Date()
    });
  }

  // Generate Documents
  console.log("📄 Creating documents...");
  for (let i = 0; i < 18; i++) {
    await db.insert(documents).values({
      title: `${randomChoice(documentCategories)} - ${randomChoice(workTypes)}`,
      category: randomChoice(documentCategories),
      description: `Comprehensive documentation for ${randomChoice(workTypes).toLowerCase()} procedures and safety guidelines`,
      sharepointUrl: `https://company.sharepoint.com/sites/safety/docs/${i + 1}.pdf`,
      createdAt: new Date()
    });
  }

  console.log("✅ Mock data generation complete!");
  console.log("📊 Generated:");
  console.log("   👥 6 Users");
  console.log("   ⚙️ 6 User Preferences");
  console.log("   📋 25 Safety Plans");
  console.log("   🔐 15 Work Permits");
  console.log("   🏗️ 20 Crane Inspections");
  console.log("   🧪 30 Draeger Calibrations");
  console.log("   🚨 12 Incident Reports");
  console.log("   📄 18 Documents");
  console.log("\n🎯 Your EHS application now has realistic sample data!");
}

// Run the data generation
generateMockData().catch(console.error);
