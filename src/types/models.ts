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

// ---- Laboratory ----
export type LabOrderStatus = 'ordered' | 'collected' | 'in_progress' | 'completed' | 'cancelled';
export type LabOrderPriority = 'normal' | 'urgent' | 'stat';

export interface LabTest {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  normalRange: string | null;
  unit: string | null;
  cost: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LabOrder {
  id: string;
  patientId: string;
  patientName: string | null;
  orderedBy: string;
  orderedByName: string | null;
  appointmentId: string | null;
  testId: string;
  testName: string | null;
  status: LabOrderStatus;
  priority: LabOrderPriority;
  notes: string | null;
  orderedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabResult {
  id: string;
  orderId: string;
  patientName: string | null;
  testName: string | null;
  resultValue: string;
  unit: string | null;
  referenceRange: string | null;
  isAbnormal: boolean;
  performedBy: string | null;
  performedByName: string | null;
  verifiedBy: string | null;
  verifiedByName: string | null;
  notes: string | null;
  resultedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabStats {
  totalTests: number;
  totalOrders: number;
  pending: number;
  completed: number;
}

// ---- Billing ----
export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled' | 'refunded';
export type InvoiceItemType = 'consultation' | 'procedure' | 'medication' | 'lab_test' | 'room_charge' | 'other';
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'mobile_money' | 'insurance' | 'other';
export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string | null;
  departmentId: string | null;
  departmentName: string | null;
  appointmentId: string | null;
  invoiceNumber: string;
  status: InvoiceStatus;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  amountPaid: number;
  currency: string;
  dueDate: string | null;
  notes: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  itemType: InvoiceItemType | null;
  createdAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string | null;
  patientName: string | null;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber: string | null;
  status: PaymentStatus;
  receivedBy: string | null;
  paidAt: string;
  notes: string | null;
  createdAt: string;
}

export interface BillingStats {
  totalInvoices: number;
  totalRevenue: number;
  outstanding: number;
  overdue: number;
}

// ---- Generic API response wrapper ----
export interface ApiListResponse<T> {
  data: T[];
  total: number;
}

// ---- Inventory (Non-Pharmacy) ----
export type InventoryCategory = 'IT' | 'Furniture' | 'Kitchen' | 'Cleaning' | 'HVAC' | 'Security' | 'Office Supplies' | 'Other';
export type InventoryItemStatus = 'active' | 'in_repair' | 'retired' | 'disposed';
export type InventoryCondition = 'excellent' | 'good' | 'fair' | 'poor';
export type RoomType = 'office' | 'storage' | 'server_room' | 'conference' | 'break_room' | 'mechanical' | 'restroom' | 'lobby' | 'other';
export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'decommissioned';
export type MaintenanceType = 'preventive' | 'corrective' | 'emergency' | 'inspection';
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'critical';
export type MaintenanceStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  assetTag: string | null;
  serialNumber: string | null;
  building: string | null;
  floor: string | null;
  roomNumber: string | null;
  status: InventoryItemStatus;
  condition: InventoryCondition;
  purchaseDate: string | null;
  purchaseCost: number | null;
  warrantyExpiry: string | null;
  assignedDepartment: string | null;
  assignedTo: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryRoom {
  id: string;
  roomNumber: string;
  name: string;
  building: string;
  floor: string;
  roomType: RoomType;
  capacity: number | null;
  areaSqFt: number | null;
  status: RoomStatus;
  department: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceLog {
  id: string;
  assetId: string | null;
  assetName: string | null;
  type: MaintenanceType;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  assignedTo: string | null;
  scheduledDate: string | null;
  completedDate: string | null;
  cost: number | null;
  description: string | null;
  resolution: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryStats {
  totalAssets: number;
  activeAssets: number;
  inRepair: number;
  retired: number;
  totalRooms: number;
  availableRooms: number;
  openWorkOrders: number;
  completedWorkOrders: number;
}

// ---- Admin (Core Schema Management) ----
export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  phone: string | null;
  avatarUrl: string | null;
  jobTitle: string | null;
  licenseNumber: string | null;
  specialization: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  departmentId: string | null;
  departmentName: string | null;
  roles: { roleId: string; roleName: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminRole {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDepartment {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  isActive: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newThisMonth: number;
  totalRoles: number;
  totalDepartments: number;
}
