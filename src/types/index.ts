export interface Patient {
  id: string;
  patientCode: string;
  name: string;
  barcode: string;
  gender: 'Female' | 'Male';
  dob: string;
  ageYears: number;
  ageMonths: number;
  ageDays: number;
  phone: string;
  email?: string;
  nationalId?: string;
  assignedDoctor?: string;
  country: string;
  address?: string;
  notes?: string;
  prescriptionsCount: number;
  lastContactDate: string;
  lastContactTime: string;
  addedBy: string;
  addedByInitials: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export type VisitType = 'Examination' | 'Follow-up' | 'Procedure' | 'Consultation';
export type VisitPriority = 'Normal' | 'High' | 'Urgent';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientCode: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:00 AM"
  room: string;
  doctor: string;
  visitType: VisitType;
  priority: VisitPriority;
  note?: string;
  visitFee: number;
  paidAmount: number;
  status: 'Booked' | 'Completed' | 'Cancelled' | 'In Room' | 'Waiting';
  ignoreTimeValidation?: boolean;
  createdAt: string;
}

export interface ScheduleSlot {
  id: string;
  time: string; // e.g. "09:00 AM"
  status: 'available' | 'booked' | 'closed';
  bookedPatientName?: string;
  appointmentId?: string;
}

export interface DaySchedule {
  dayName: string; // SAT, SUN, MON, TUE, WED, THU, FRI
  dayNumber: number; // 3, 4, 5, 6, 7, 8, 9
  dateStr: string; // YYYY-MM-DD
  isClosed: boolean;
  isOpen: boolean;
  openCount?: number;
  isToday?: boolean;
  slots: ScheduleSlot[];
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
}

export interface Drug {
  id: string;
  name: string;
  category: string;
  dosageForm: string;
  stock: number;
  unitPrice: number;
}
