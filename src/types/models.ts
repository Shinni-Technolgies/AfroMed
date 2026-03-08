// ==============================|| DATA MODELS - TYPESCRIPT INTERFACES ||============================== //

// ---- Organization ----
export interface Organization {
  org_id: string;
  name: string;
  slug: string;
  city: string | null;
  state: string | null;
  country: string | null;
  logo_url: string | null;
}

// ---- Patients ----
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodType: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  medicalRecordNumber: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  allergies: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PatientStats {
  totalPatients: number;
  newThisMonth: number;
  activeCases: number;
  discharged: number;
}

// ---- Appointments ----
export type AppointmentVisitType = 'new_patient' | 'follow_up' | 'emergency' | 'routine' | 'consultation';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string;
  patientName: string;
  doctor: string;
  department: string | null;
  dateTime: string;
  durationMin: number;
  type: AppointmentVisitType;
  status: AppointmentStatus;
  reason: string | null;
  notes: string | null;
  createdAt: string;
}

export interface AppointmentStats {
  todayAppointments: number;
  upcoming: number;
  completed: number;
  cancelled: number;
}

// ---- Pharmacy / Medications ----
export interface Medication {
  id: string;
  name: string;
  genericName: string | null;
  category: string | null;
  dosageForm: string | null;
  strength: string | null;
  manufacturer: string | null;
  requiresPrescription: boolean;
  isActive: boolean;
  stockQty: number | null;
  reorderLevel: number | null;
  unitPrice: number | null;
  expiryDate: string | null;
  batchNumber: string | null;
}

export interface PharmacyStats {
  totalMedications: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

// ---- Health Records (Medical Records) ----
export interface HealthRecord {
  id: string;
  patientName: string;
  providerName: string;
  chiefComplaint: string | null;
  historyOfPresentIllness: string | null;
  examinationFindings: string | null;
  treatmentPlan: string | null;
  notes: string | null;
  appointmentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HealthRecordStats {
  totalRecords: number;
  diagnoses: number;
  vitals: number;
  prescriptions: number;
}

// ---- Doctors (Users with doctor role) ----
export interface Doctor {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  specialty: string;
  jobTitle: string | null;
  licenseNumber: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  departmentId: string | null;
  departmentName: string | null;
  createdAt: string;
}

export interface DoctorStats {
  totalDoctors: number;
  onDuty: number;
  onLeave: number;
  specialists: number;
}

// ---- Generic API response wrapper ----
export interface ApiListResponse<T> {
  data: T[];
  total: number;
}
