/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Patient, Appointment, DaySchedule, Prescription, Drug } from '../types';

const STORAGE_KEYS = {
  PATIENTS_FILE: 'clinic_filesystem_patients.json',
  APPOINTMENTS_FILE: 'clinic_filesystem_appointments.json',
  PRESCRIPTIONS_FILE: 'clinic_filesystem_prescriptions.json',
  DRUGS_FILE: 'clinic_filesystem_drugs.json',
};

// Seed Patients
const DEFAULT_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    patientCode: 'PAT-00001',
    name: 'ahmed',
    barcode: '6688943008245',
    gender: 'Male',
    dob: '2014-12-06',
    ageYears: 11,
    ageMonths: 10,
    ageDays: 1,
    phone: '01657652131',
    email: 'ahmed@example.com',
    nationalId: '29910070123456',
    assignedDoctor: 'Dr. Demo',
    country: 'Egypt',
    address: 'Tanta Street',
    notes: 'Routine dental checkup, good general health.',
    prescriptionsCount: 1,
    lastContactDate: '06 Oct 2026',
    lastContactTime: '05:12 PM',
    addedBy: 'dr demo',
    addedByInitials: 'DD',
    status: 'Active',
    createdAt: '2026-10-06T17:12:00Z',
  },
];

// Seed Appointments (Ahmed booked on Thu Oct 8 at 09:00 AM)
const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    patientId: 'pat-1',
    patientName: 'ahmed',
    patientCode: 'PAT-00001',
    date: '2026-10-08',
    time: '09:00 AM',
    room: 'dental',
    doctor: 'Dr. Demo',
    visitType: 'Examination',
    priority: 'Normal',
    note: 'Initial molar dental checkup',
    visitFee: 150,
    paidAmount: 150,
    status: 'Booked',
    createdAt: '2026-10-06T17:15:00Z',
  },
];

// Seed Prescriptions
const DEFAULT_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-1',
    patientId: 'pat-1',
    patientName: 'ahmed',
    doctorName: 'Dr. Demo',
    date: '06 Oct 2026',
    diagnosis: 'Mild gingivitis',
    medications: [
      {
        name: 'Amoxicillin 500mg',
        dosage: '1 capsule',
        frequency: 'Every 8 hours',
        duration: '5 days',
      },
      {
        name: 'Chlorhexidine Mouthwash 0.12%',
        dosage: '15 ml rinse',
        frequency: 'Twice daily',
        duration: '7 days',
      },
    ],
  },
];

// Seed Drugs
const DEFAULT_DRUGS: Drug[] = [
  { id: 'dr-1', name: 'Amoxicillin 500mg', category: 'Antibiotic', dosageForm: 'Capsule', stock: 120, unitPrice: 35.0 },
  { id: 'dr-2', name: 'Ibuprofen 400mg', category: 'Analgesic', dosageForm: 'Tablet', stock: 250, unitPrice: 20.0 },
  { id: 'dr-3', name: 'Paracetamol 500mg', category: 'Antipyretic', dosageForm: 'Tablet', stock: 500, unitPrice: 15.0 },
  { id: 'dr-4', name: 'Chlorhexidine Mouthwash', category: 'Antiseptic', dosageForm: 'Liquid', stock: 45, unitPrice: 42.5 },
  { id: 'dr-5', name: 'Metronidazole 500mg', category: 'Antibacterial', dosageForm: 'Tablet', stock: 90, unitPrice: 28.0 },
];

/**
 * File System Storage Service
 * Reads and writes JSON data persistently without network round-trips.
 */
class FileSystemStorageService {
  // Read a JSON file from persistent storage
  private readFile<T>(fileName: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(fileName);
      if (!raw) {
        this.writeFile(fileName, fallback);
        return fallback;
      }
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`Error reading from file storage: ${fileName}`, err);
      return fallback;
    }
  }

  // Write a JSON file to persistent storage
  private writeFile<T>(fileName: string, data: T): void {
    try {
      localStorage.setItem(fileName, JSON.stringify(data));
    } catch (err) {
      console.error(`Error writing to file storage: ${fileName}`, err);
    }
  }

  // --- Patients File Operations ---
  public getPatients(searchQuery = '', filter = 'all'): Patient[] {
    let list = this.readFile<Patient[]>(STORAGE_KEYS.PATIENTS_FILE, DEFAULT_PATIENTS);
    const q = searchQuery.toLowerCase().trim();

    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          (p.email && p.email.toLowerCase().includes(q)) ||
          p.patientCode.toLowerCase().includes(q) ||
          p.barcode.includes(q) ||
          (p.nationalId && p.nationalId.includes(q))
      );
    }

    if (filter === 'recent') {
      list = list.slice(0, 10);
    } else if (filter === 'with_prescriptions') {
      list = list.filter((p) => p.prescriptionsCount > 0);
    } else if (filter === 'inactive') {
      list = list.filter((p) => p.status === 'Inactive');
    }

    return list;
  }

  public savePatient(patientData: Partial<Patient>): Patient {
    const list = this.readFile<Patient[]>(STORAGE_KEYS.PATIENTS_FILE, DEFAULT_PATIENTS);

    const nextNumber = list.length + 1;
    const patientCode =
      patientData.patientCode || `PAT-${String(nextNumber).padStart(5, '0')}`;
    const barcode =
      patientData.barcode || String(7049306457000 + Math.floor(Math.random() * 9000));

    const newPatient: Patient = {
      id: patientData.id || `pat-${Date.now()}`,
      patientCode,
      name: (patientData.name || '').trim(),
      barcode,
      gender: patientData.gender === 'Female' ? 'Female' : 'Male',
      dob: patientData.dob || '2000-01-01',
      ageYears: Number(patientData.ageYears) || 0,
      ageMonths: Number(patientData.ageMonths) || 0,
      ageDays: Number(patientData.ageDays) || 0,
      phone: (patientData.phone || '').trim(),
      email: patientData.email ? patientData.email.trim() : undefined,
      nationalId: patientData.nationalId ? patientData.nationalId.trim() : undefined,
      assignedDoctor: patientData.assignedDoctor || 'Dr. Demo',
      country: patientData.country || 'Egypt',
      address: patientData.address ? patientData.address.trim() : 'Tanta Street',
      notes: patientData.notes,
      prescriptionsCount: patientData.prescriptionsCount || 0,
      lastContactDate: '07 Oct 2026',
      lastContactTime: '01:00 PM',
      addedBy: 'dr demo',
      addedByInitials: 'DD',
      status: 'Active',
      createdAt: new Date().toISOString(),
    };

    const existingIndex = list.findIndex((p) => p.id === newPatient.id);
    if (existingIndex >= 0) {
      list[existingIndex] = newPatient;
    } else {
      list.unshift(newPatient);
    }

    this.writeFile(STORAGE_KEYS.PATIENTS_FILE, list);
    return newPatient;
  }

  public deletePatient(id: string): boolean {
    const list = this.readFile<Patient[]>(STORAGE_KEYS.PATIENTS_FILE, DEFAULT_PATIENTS);
    const filtered = list.filter((p) => p.id !== id);
    this.writeFile(STORAGE_KEYS.PATIENTS_FILE, filtered);
    return true;
  }

  // --- Appointments File Operations ---
  public getAppointments(): Appointment[] {
    return this.readFile<Appointment[]>(STORAGE_KEYS.APPOINTMENTS_FILE, DEFAULT_APPOINTMENTS);
  }

  public saveAppointment(aptData: Partial<Appointment>): Appointment {
    const list = this.readFile<Appointment[]>(
      STORAGE_KEYS.APPOINTMENTS_FILE,
      DEFAULT_APPOINTMENTS
    );

    // Collision check unless ignoreTimeValidation is active
    if (!aptData.ignoreTimeValidation) {
      const collision = list.find(
        (a) =>
          a.date === aptData.date &&
          a.time === aptData.time &&
          a.room.toLowerCase() === (aptData.room || '').toLowerCase() &&
          a.status !== 'Cancelled'
      );
      if (collision) {
        throw new Error(
          `Slot ${aptData.time} in room ${aptData.room} is already booked by ${collision.patientName}. Enable 'Ignore time validation' to proceed.`
        );
      }
    }

    const newApt: Appointment = {
      id: aptData.id || `apt-${Date.now()}`,
      patientId: aptData.patientId || '',
      patientName: aptData.patientName || 'Unknown Patient',
      patientCode: aptData.patientCode || 'PAT-00000',
      date: aptData.date || '2026-10-07',
      time: aptData.time || '09:00 AM',
      room: aptData.room || 'dental',
      doctor: aptData.doctor || 'Dr. Demo',
      visitType: aptData.visitType || 'Examination',
      priority: aptData.priority || 'Normal',
      note: aptData.note || '',
      visitFee: Number(aptData.visitFee) || 0,
      paidAmount: Number(aptData.paidAmount) || 0,
      status: aptData.date === '2026-10-07' ? 'Waiting' : 'Booked',
      ignoreTimeValidation: Boolean(aptData.ignoreTimeValidation),
      createdAt: new Date().toISOString(),
    };

    list.push(newApt);
    this.writeFile(STORAGE_KEYS.APPOINTMENTS_FILE, list);

    // Update patient's last contact
    if (aptData.patientId) {
      const patientsList = this.readFile<Patient[]>(
        STORAGE_KEYS.PATIENTS_FILE,
        DEFAULT_PATIENTS
      );
      const target = patientsList.find((p) => p.id === aptData.patientId);
      if (target) {
        target.lastContactDate = '07 Oct 2026';
        target.lastContactTime = newApt.time;
        this.writeFile(STORAGE_KEYS.PATIENTS_FILE, patientsList);
      }
    }

    return newApt;
  }

  // --- Schedule Calculation from Appointments File ---
  public getSchedule(room = 'dental'): DaySchedule[] {
    const appointmentsList = this.getAppointments();

    const weekDays = [
      { dayName: 'SAT', dayNumber: 3, dateStr: '2026-10-03', isClosed: true },
      { dayName: 'SUN', dayNumber: 4, dateStr: '2026-10-04', isClosed: true },
      { dayName: 'MON', dayNumber: 5, dateStr: '2026-10-05', isClosed: true },
      { dayName: 'TUE', dayNumber: 6, dateStr: '2026-10-06', isClosed: true },
      { dayName: 'WED', dayNumber: 7, dateStr: '2026-10-07', isClosed: true, isToday: true },
      { dayName: 'THU', dayNumber: 8, dateStr: '2026-10-08', isClosed: false },
      { dayName: 'FRI', dayNumber: 9, dateStr: '2026-10-09', isClosed: true },
    ];

    const standardTimes = [
      '09:00 AM',
      '09:30 AM',
      '10:00 AM',
      '10:30 AM',
      '11:00 AM',
      '11:30 AM',
    ];

    return weekDays.map((day) => {
      if (day.isClosed) {
        return {
          ...day,
          isOpen: false,
          openCount: 0,
          slots: [],
        };
      }

      const dayAppointments = appointmentsList.filter(
        (a) => a.date === day.dateStr && a.room.toLowerCase() === room.toLowerCase()
      );

      const slots = standardTimes.map((time, idx) => {
        const booked = dayAppointments.find((a) => a.time === time);
        if (booked) {
          return {
            id: `slot-${day.dateStr}-${idx}`,
            time,
            status: 'booked' as const,
            bookedPatientName: booked.patientName,
            appointmentId: booked.id,
          };
        }
        return {
          id: `slot-${day.dateStr}-${idx}`,
          time,
          status: 'available' as const,
        };
      });

      const openCount = slots.filter((s) => s.status === 'available').length;

      return {
        ...day,
        isOpen: true,
        openCount,
        slots,
      };
    });
  }

  // --- Prescriptions File Operations ---
  public getPrescriptions(): Prescription[] {
    return this.readFile<Prescription[]>(
      STORAGE_KEYS.PRESCRIPTIONS_FILE,
      DEFAULT_PRESCRIPTIONS
    );
  }

  public savePrescription(rxData: Partial<Prescription>): Prescription {
    const list = this.readFile<Prescription[]>(
      STORAGE_KEYS.PRESCRIPTIONS_FILE,
      DEFAULT_PRESCRIPTIONS
    );
    const patientsList = this.readFile<Patient[]>(
      STORAGE_KEYS.PATIENTS_FILE,
      DEFAULT_PATIENTS
    );
    const patient = patientsList.find((p) => p.id === rxData.patientId);

    const newRx: Prescription = {
      id: rxData.id || `rx-${Date.now()}`,
      patientId: rxData.patientId || '',
      patientName: patient ? patient.name : 'Unknown Patient',
      doctorName: 'Dr. Demo',
      date: '07 Oct 2026',
      diagnosis: rxData.diagnosis || 'Clinical consultation follow-up',
      medications: rxData.medications || [],
    };

    list.unshift(newRx);
    this.writeFile(STORAGE_KEYS.PRESCRIPTIONS_FILE, list);

    if (patient) {
      patient.prescriptionsCount = (patient.prescriptionsCount || 0) + 1;
      this.writeFile(STORAGE_KEYS.PATIENTS_FILE, patientsList);
    }

    return newRx;
  }

  // --- Drugs File Operations ---
  public getDrugs(): Drug[] {
    return this.readFile<Drug[]>(STORAGE_KEYS.DRUGS_FILE, DEFAULT_DRUGS);
  }

  // --- Export All Data to a JSON File ---
  public exportDatabaseFile(): string {
    const bundle = {
      exportedAt: new Date().toISOString(),
      patients: this.getPatients(),
      appointments: this.getAppointments(),
      prescriptions: this.getPrescriptions(),
      drugs: this.getDrugs(),
    };
    return JSON.stringify(bundle, null, 2);
  }

  // --- Import Data From a JSON File ---
  public importDatabaseFile(jsonContent: string): boolean {
    try {
      const parsed = JSON.parse(jsonContent);
      if (parsed.patients) this.writeFile(STORAGE_KEYS.PATIENTS_FILE, parsed.patients);
      if (parsed.appointments) this.writeFile(STORAGE_KEYS.APPOINTMENTS_FILE, parsed.appointments);
      if (parsed.prescriptions) this.writeFile(STORAGE_KEYS.PRESCRIPTIONS_FILE, parsed.prescriptions);
      if (parsed.drugs) this.writeFile(STORAGE_KEYS.DRUGS_FILE, parsed.drugs);
      return true;
    } catch (err) {
      console.error('Invalid JSON file format:', err);
      return false;
    }
  }

  // --- Reset File System Data ---
  public resetToDefault(): void {
    this.writeFile(STORAGE_KEYS.PATIENTS_FILE, DEFAULT_PATIENTS);
    this.writeFile(STORAGE_KEYS.APPOINTMENTS_FILE, DEFAULT_APPOINTMENTS);
    this.writeFile(STORAGE_KEYS.PRESCRIPTIONS_FILE, DEFAULT_PRESCRIPTIONS);
    this.writeFile(STORAGE_KEYS.DRUGS_FILE, DEFAULT_DRUGS);
  }
}

export const fileStorage = new FileSystemStorageService();
