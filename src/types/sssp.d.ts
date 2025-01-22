export interface SSSP {
  id: string;
  companyName: string;
  address: string;
  contactPerson: string;
  contactEmail: string;
  services: string;
  locations: string;
  considerations: string;
  pcbuDuties: string;
  workerResponsibilities: string;
  contractorDuties: string;
  visitorRules: string;
  hazards: Hazard[];
  trainings: Training[];
  policies: Policies;
  siteSafetyRules: SiteSafetyRules;
  communication: Communication;
  monitoringReview: MonitoringReview;
  createdAt: string;
  updatedAt: string;
}

export interface Hazard {
  hazard: string;
  risk: string;
  controlMeasures: string;
}

export interface Training {
  requirement: string;
  description: string;
  frequency: string;
}

export interface Policies {
  drugAndAlcohol: string;
  fatigueManagement: string;
  ppe: string;
  mobilePhone: string;
}

export interface SiteSafetyRules {
  entryExitProcedures: string;
  speedLimits: string;
  parkingRules: string;
  sitePPE: string;
}

export interface Communication {
  meetings: string;
  reporting: string;
  consultation: string;
}

export interface MonitoringReview {
  audits: Audit[];
  correctiveActions: string;
  annualReview: string;
}

export interface Audit {
  type: string;
  frequency: string;
  responsible: string;
  lastDate: string;
  nextDate: string;
}