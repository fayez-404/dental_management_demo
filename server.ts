import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// File System Data Directory
const DATA_DIR = path.resolve(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PATIENTS_FILE = path.join(DATA_DIR, 'patients.json');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');
const PRESCRIPTIONS_FILE = path.join(DATA_DIR, 'prescriptions.json');
const DRUGS_FILE = path.join(DATA_DIR, 'drugs.json');

// Helper to read JSON file from file system
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
      return fallback;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    return fallback;
  }
}

// Helper to write JSON file to file system
function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing file ${filePath}:`, err);
  }
}

// Initial seed patients
const INITIAL_PATIENTS = [
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

// Initial seed appointments
const INITIAL_APPOINTMENTS = [
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

// Initial Prescriptions
const INITIAL_PRESCRIPTIONS = [
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

// Initial Drugs
const INITIAL_DRUGS = [
  { id: 'dr-1', name: 'Amoxicillin 500mg', category: 'Antibiotic', dosageForm: 'Capsule', stock: 120, unitPrice: 35.0 },
  { id: 'dr-2', name: 'Ibuprofen 400mg', category: 'Analgesic', dosageForm: 'Tablet', stock: 250, unitPrice: 20.0 },
  { id: 'dr-3', name: 'Paracetamol 500mg', category: 'Antipyretic', dosageForm: 'Tablet', stock: 500, unitPrice: 15.0 },
  { id: 'dr-4', name: 'Chlorhexidine Mouthwash', category: 'Antiseptic', dosageForm: 'Liquid', stock: 45, unitPrice: 42.5 },
  { id: 'dr-5', name: 'Metronidazole 500mg', category: 'Antibacterial', dosageForm: 'Tablet', stock: 90, unitPrice: 28.0 },
];

// Initialize files if not existing
let patients = readJsonFile(PATIENTS_FILE, INITIAL_PATIENTS);
let appointments = readJsonFile(APPOINTMENTS_FILE, INITIAL_APPOINTMENTS);
let prescriptions = readJsonFile(PRESCRIPTIONS_FILE, INITIAL_PRESCRIPTIONS);
let drugs = readJsonFile(DRUGS_FILE, INITIAL_DRUGS);

// --- REST API ROUTES (backed by file system storage) ---

// GET /api/stats
app.get('/api/stats', (_req: Request, res: Response) => {
  patients = readJsonFile(PATIENTS_FILE, INITIAL_PATIENTS);
  appointments = readJsonFile(APPOINTMENTS_FILE, INITIAL_APPOINTMENTS);
  const registered = patients.length;
  const active = patients.filter((p: any) => p.status === 'Active').length;
  const todayApts = appointments.filter((a: any) => a.date === '2026-10-07').length;
  res.json({
    registeredCount: registered,
    activeCount: active,
    addedThisWeek: registered,
    todayAppointmentsCount: todayApts,
  });
});

// GET /api/patients (read from patients.json file)
app.get('/api/patients', (req: Request, res: Response) => {
  patients = readJsonFile(PATIENTS_FILE, INITIAL_PATIENTS);
  const { search = '', filter = 'all', sort = 'newest' } = req.query;
  const q = String(search).toLowerCase().trim();

  let list = [...patients];

  if (q) {
    list = list.filter(
      (p: any) =>
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
    list = list.filter((p: any) => p.prescriptionsCount > 0);
  } else if (filter === 'inactive') {
    list = list.filter((p: any) => p.status === 'Inactive');
  }

  if (sort === 'oldest') {
    list.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (sort === 'name') {
    list.sort((a: any, b: any) => a.name.localeCompare(b.name));
  } else {
    list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json({
    patients: list,
    total: list.length,
    registeredCount: patients.length,
    addedThisWeek: patients.length,
  });
});

// POST /api/patients (save to patients.json file)
app.post('/api/patients', (req: Request, res: Response) => {
  patients = readJsonFile(PATIENTS_FILE, INITIAL_PATIENTS);
  const {
    name,
    gender,
    dob,
    ageYears,
    ageMonths,
    ageDays,
    phone,
    email,
    nationalId,
    assignedDoctor,
    country = 'Egypt',
    address,
    notes,
    barcode,
  } = req.body;

  if (!name || !gender || !dob || !phone) {
    return res.status(400).json({ error: 'Name, gender, date of birth, and phone are required.' });
  }

  const nextNumber = patients.length + 1;
  const newPatient = {
    id: `pat-${Date.now()}`,
    patientCode: req.body.patientCode || `PAT-${String(nextNumber).padStart(5, '0')}`,
    name: name.trim(),
    barcode: barcode || String(7049306457000 + Math.floor(Math.random() * 9000)),
    gender: gender === 'Female' ? 'Female' : 'Male',
    dob,
    ageYears: Number(ageYears) || 0,
    ageMonths: Number(ageMonths) || 0,
    ageDays: Number(ageDays) || 0,
    phone: phone.trim(),
    email: email ? email.trim() : undefined,
    nationalId: nationalId ? nationalId.trim() : undefined,
    assignedDoctor: assignedDoctor || 'Dr. Demo',
    country: country || 'Egypt',
    address: address ? address.trim() : 'Tanta Street',
    notes,
    prescriptionsCount: 0,
    lastContactDate: '07 Oct 2026',
    lastContactTime: '01:00 PM',
    addedBy: 'dr demo',
    addedByInitials: 'DD',
    status: 'Active',
    createdAt: new Date().toISOString(),
  };

  patients.unshift(newPatient);
  writeJsonFile(PATIENTS_FILE, patients);
  res.status(201).json(newPatient);
});

// DELETE /api/patients/:id (update patients.json file)
app.delete('/api/patients/:id', (req: Request, res: Response) => {
  patients = readJsonFile(PATIENTS_FILE, INITIAL_PATIENTS);
  const index = patients.findIndex((p: any) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  const deleted = patients.splice(index, 1);
  writeJsonFile(PATIENTS_FILE, patients);
  res.json({ success: true, patient: deleted[0] });
});

// GET /api/appointments (read from appointments.json file)
app.get('/api/appointments', (req: Request, res: Response) => {
  appointments = readJsonFile(APPOINTMENTS_FILE, INITIAL_APPOINTMENTS);
  const { date, room, doctor, patientId } = req.query;
  let list = [...appointments];

  if (date) list = list.filter((a: any) => a.date === date);
  if (room) list = list.filter((a: any) => a.room.toLowerCase() === String(room).toLowerCase());
  if (doctor && doctor !== 'All doctors') {
    list = list.filter((a: any) => a.doctor.toLowerCase() === String(doctor).toLowerCase());
  }
  if (patientId) list = list.filter((a: any) => a.patientId === patientId);

  res.json(list);
});

// POST /api/appointments (save to appointments.json file)
app.post('/api/appointments', (req: Request, res: Response) => {
  appointments = readJsonFile(APPOINTMENTS_FILE, INITIAL_APPOINTMENTS);
  patients = readJsonFile(PATIENTS_FILE, INITIAL_PATIENTS);

  const {
    patientId,
    patientName,
    date,
    time,
    room = 'dental',
    doctor = 'Dr. Demo',
    visitType = 'Examination',
    priority = 'Normal',
    note = '',
    visitFee = 0,
    paidAmount = 0,
    ignoreTimeValidation = false,
  } = req.body;

  if (!patientId || !date || !time) {
    return res.status(400).json({ error: 'Patient, date, and time are required.' });
  }

  if (!ignoreTimeValidation) {
    const collision = appointments.find(
      (a: any) =>
        a.date === date &&
        a.time === time &&
        a.room.toLowerCase() === room.toLowerCase() &&
        a.status !== 'Cancelled'
    );
    if (collision) {
      return res.status(409).json({
        error: `Slot ${time} in room ${room} is already booked by ${collision.patientName}. Enable 'Ignore time validation' to proceed.`,
      });
    }
  }

  const patient = patients.find((p: any) => p.id === patientId);

  const newApt = {
    id: `apt-${Date.now()}`,
    patientId,
    patientName: patientName || (patient ? patient.name : 'Unknown Patient'),
    patientCode: patient ? patient.patientCode : 'PAT-00000',
    date,
    time,
    room,
    doctor: doctor || 'No doctor assigned',
    visitType,
    priority,
    note,
    visitFee: Number(visitFee) || 0,
    paidAmount: Number(paidAmount) || 0,
    status: date === '2026-10-07' ? 'Waiting' : 'Booked',
    ignoreTimeValidation: Boolean(ignoreTimeValidation),
    createdAt: new Date().toISOString(),
  };

  appointments.push(newApt);
  writeJsonFile(APPOINTMENTS_FILE, appointments);

  if (patient) {
    patient.lastContactDate = '07 Oct 2026';
    patient.lastContactTime = time;
    writeJsonFile(PATIENTS_FILE, patients);
  }

  res.status(201).json(newApt);
});

// GET /api/schedule
app.get('/api/schedule', (req: Request, res: Response) => {
  appointments = readJsonFile(APPOINTMENTS_FILE, INITIAL_APPOINTMENTS);
  const { room = 'dental' } = req.query;

  const weekDays = [
    { dayName: 'SAT', dayNumber: 3, dateStr: '2026-10-03', isClosed: true },
    { dayName: 'SUN', dayNumber: 4, dateStr: '2026-10-04', isClosed: true },
    { dayName: 'MON', dayNumber: 5, dateStr: '2026-10-05', isClosed: true },
    { dayName: 'TUE', dayNumber: 6, dateStr: '2026-10-06', isClosed: true },
    { dayName: 'WED', dayNumber: 7, dateStr: '2026-10-07', isClosed: true, isToday: true },
    { dayName: 'THU', dayNumber: 8, dateStr: '2026-10-08', isClosed: false },
    { dayName: 'FRI', dayNumber: 9, dateStr: '2026-10-09', isClosed: true },
  ];

  const standardTimes = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];

  const schedule = weekDays.map((day) => {
    if (day.isClosed) {
      return {
        ...day,
        isOpen: false,
        openCount: 0,
        slots: [],
      };
    }

    const dayAppointments = appointments.filter(
      (a: any) => a.date === day.dateStr && a.room.toLowerCase() === String(room).toLowerCase()
    );

    const slots = standardTimes.map((time, idx) => {
      const booked = dayAppointments.find((a: any) => a.time === time);
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

    const availableCount = slots.filter((s) => s.status === 'available').length;

    return {
      ...day,
      isOpen: true,
      openCount: availableCount,
      slots,
    };
  });

  res.json({
    room,
    weekRange: '3 – Oct 9, 2026',
    schedule,
  });
});

// GET /api/prescriptions
app.get('/api/prescriptions', (_req: Request, res: Response) => {
  prescriptions = readJsonFile(PRESCRIPTIONS_FILE, INITIAL_PRESCRIPTIONS);
  res.json(prescriptions);
});

// POST /api/prescriptions
app.post('/api/prescriptions', (req: Request, res: Response) => {
  prescriptions = readJsonFile(PRESCRIPTIONS_FILE, INITIAL_PRESCRIPTIONS);
  patients = readJsonFile(PATIENTS_FILE, INITIAL_PATIENTS);
  const { patientId, diagnosis, medications } = req.body;
  const patient = patients.find((p: any) => p.id === patientId);

  const newRx = {
    id: `rx-${Date.now()}`,
    patientId,
    patientName: patient ? patient.name : 'Unknown Patient',
    doctorName: 'Dr. Demo',
    date: '07 Oct 2026',
    diagnosis: diagnosis || 'Consultation follow-up',
    medications: medications || [],
  };

  prescriptions.unshift(newRx);
  writeJsonFile(PRESCRIPTIONS_FILE, prescriptions);

  if (patient) {
    patient.prescriptionsCount = (patient.prescriptionsCount || 0) + 1;
    writeJsonFile(PATIENTS_FILE, patients);
  }

  res.status(201).json(newRx);
});

// GET /api/drugs
app.get('/api/drugs', (_req: Request, res: Response) => {
  drugs = readJsonFile(DRUGS_FILE, INITIAL_DRUGS);
  res.json(drugs);
});

// POST /api/assistant/call
app.post('/api/assistant/call', (_req: Request, res: Response) => {
  res.json({
    status: 'called',
    message: 'Medical Assistant (Nour) notified. Connecting to consultation desk...',
    timestamp: new Date().toLocaleTimeString(),
  });
});

// Mount Vite or serve static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} with file system storage enabled`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
