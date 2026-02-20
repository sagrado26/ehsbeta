// Static data for GitHub Pages deployment
export const staticData = {
  safetyPlans: [
    {
      id: 1,
      group: "Safety Team",
      taskName: "Routine Safety Inspection",
      date: "2024-12-22",
      location: "Building 1 - Main",
      shift: "day",
      machineNumber: "N/A",
      region: "Europe - Ireland",
      system: "Others",
      canSocialDistance: "yes",
      q1_specializedTraining: "no",
      q2_chemicals: "no",
      q3_impactOthers: "no",
      q4_falls: "no",
      q5_barricades: "no",
      q6_loto: "no",
      q7_lifting: "no",
      q8_ergonomics: "no",
      q9_otherConcerns: "no",
      q10_headInjury: "no",
      q11_otherPPE: "no",
      hazards: [],
      assessments: {},
      leadName: "Michael Kelly",
      approverName: "John Murphy",
      engineers: [],
      comments: "Standard inspection - low risk",
      status: "approved",
      shareToken: null,
      createdAt: "2024-12-22T10:00:00.000Z"
    },
    {
      id: 2,
      group: "Maintenance Team A",
      taskName: "Electrical Panel Maintenance",
      date: "2024-12-20",
      location: "Building 3 - Fab",
      shift: "day",
      machineNumber: "4052",
      region: "Europe - Ireland",
      system: "EUV",
      canSocialDistance: "yes",
      q1_specializedTraining: "yes",
      q2_chemicals: "no",
      q3_impactOthers: "yes",
      q4_falls: "no",
      q5_barricades: "yes",
      q6_loto: "yes",
      q7_lifting: "no",
      q8_ergonomics: "no",
      q9_otherConcerns: "no",
      q10_headInjury: "no",
      q11_otherPPE: "yes",
      hazards: ["Electrical Work", "Floor/Barricades"],
      assessments: {
        "Electrical Work": { severity: 3, likelihood: 2, mitigation: "Proper LOTO procedures" },
        "Floor/Barricades": { severity: 2, likelihood: 2, mitigation: "Area cordoned off" }
      },
      leadName: "John Murphy",
      approverName: "Sarah O'Brien",
      engineers: ["Mike Chen", "Lisa Park"],
      comments: "Routine maintenance - approved",
      status: "approved",
      shareToken: null,
      createdAt: "2024-12-20T14:30:00.000Z"
    }
  ],
  permits: [
    {
      id: 1,
      date: "2024-12-15",
      submitter: "John Murphy",
      manager: "Sarah O'Brien",
      location: "Building 3 - Fab",
      workType: "Electrical",
      workDescription: "Panel maintenance and wiring inspection",
      spq1: "yes",
      spq2: "no",
      spq3: "yes",
      spq4: "no",
      spq5: "yes",
      authorityName: "Mike Chen",
      status: "approved",
      createdAt: "2024-12-15T09:00:00.000Z"
    }
  ],
  craneInspections: [
    {
      id: 1,
      inspector: "Michael Kelly",
      buddyInspector: "Aoife Ryan",
      bay: "Bay A",
      machine: "Crane-001",
      date: "2024-12-18",
      q1: "yes",
      q2: "yes",
      q3: "yes",
      status: "completed",
      createdAt: "2024-12-18T08:00:00.000Z"
    }
  ],
  draegerCalibrations: [
    {
      id: 1,
      nc12: "NC1000",
      serialNumber: "SN100000",
      calibrationDate: "2024-12-10",
      calibratedBy: "Declan Foley",
      createdAt: "2024-12-10T11:00:00.000Z",
      updatedAt: "2024-12-10T11:00:00.000Z"
    }
  ],
  incidents: [
    {
      id: 1,
      date: "2024-12-05",
      type: "near-miss",
      location: "Building 1 - Loading Bay",
      description: "Forklift nearly struck pedestrian at blind corner",
      severity: 3,
      assignedInvestigator: "Michael Kelly",
      status: "closed",
      createdAt: "2024-12-05T16:00:00.000Z"
    },
    {
      id: 2,
      date: "2024-12-08",
      type: "injury",
      location: "Building 2 - Assembly Line",
      description: "Minor laceration from handling equipment",
      severity: 2,
      assignedInvestigator: "Aoife Ryan",
      status: "investigating",
      createdAt: "2024-12-08T10:30:00.000Z"
    }
  ],
  documents: [
    {
      id: 1,
      title: "Safety Procedures - Electrical Work",
      category: "Safety Procedures",
      description: "Comprehensive safety guidelines for electrical maintenance",
      sharepointUrl: "https://company.sharepoint.com/sites/safety/docs/electrical.pdf",
      createdAt: "2024-11-15T09:00:00.000Z"
    }
  ]
};