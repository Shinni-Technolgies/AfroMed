// ==============================|| DATA MODELS - TYPESCRIPT INTERFACES ||============================== //

// ---- Patients ----
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  status: 'Active' | 'Discharged' | 'Critical';
  lastVisit: string;
}

export interface PatientStats {
  totalPatients: number;
  newThisMonth: number;
  activeCases: number;
  discharged: number;
}

// ---- Appointments ----
export type AppointmentType = 'Checkup' | 'Follow-up' | 'Emergency' | 'Consultation';
export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'In Progress';

export interface Appointment {
  id: string;
  patientName: string;
  doctor: string;
  department: string;
  dateTime: string;
  type: AppointmentType;
  status: AppointmentStatus;
}

export interface AppointmentStats {
  todayAppointments: number;
  upcoming: number;
  completed: number;
  cancelled: number;
}

// ---- Pharmacy / Medications ----
export type MedicationStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface Medication {
  id: string;
  name: string;
  category: string;
  stockQty: number;
  unitPrice: number;
  supplier: string;
  expiryDate: string;
  status: MedicationStatus;
}

export interface PharmacyStats {
  totalMedications: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

// ---- Health Records ----
export type RecordType = 'Lab Result' | 'Prescription' | 'Medical Report' | 'Imaging' | 'Discharge Summary';
export type RecordStatus = 'Active' | 'Archived';

export interface HealthRecord {
  id: string;
  patientName: string;
  recordType: RecordType;
  doctor: string;
  dateCreated: string;
  status: RecordStatus;
}

export interface HealthRecordStats {
  totalRecords: number;
  labResults: number;
  prescriptions: number;
  medicalReports: number;
}

// ---- Doctors ----
export type Specialty =
  | 'Cardiology'
  | 'Neurology'
  | 'Orthopedics'
  | 'Pediatrics'
  | 'General Medicine'
  | 'Dermatology'
  | 'Oncology'
  | 'Ophthalmology';

export interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  contact: string;
  experience: number;
  status: 'Available' | 'On Duty' | 'On Leave';
  rating: number;
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
