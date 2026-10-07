import React, { useState } from 'react';
import {
  CalendarPlus,
  ArrowLeft,
  Check,
  Plus,
  User,
  Calendar,
  DoorOpen,
  Stethoscope,
  Tag,
  ListOrdered,
  BadgeDollarSign,
  Banknote,
  AlertCircle,
  Clock,
  Edit3,
  CreditCard,
  Search
} from 'lucide-react';
import { Patient, VisitType, VisitPriority, Appointment } from '../../types';

interface NewAppointmentViewProps {
  patients: Patient[];
  onNavigate: (view: string) => void;
  onSaveAppointment: (data: Partial<Appointment>) => Promise<void>;
  preSelectedPatient?: Patient | null;
  onOpenNewPatientModal: () => void;
  onOpenPaymentModal: (fee: number, onPaid: (amount: number) => void) => void;
}

export const NewAppointmentView: React.FC<NewAppointmentViewProps> = ({
  patients,
  onNavigate,
  onSaveAppointment,
  preSelectedPatient,
  onOpenNewPatientModal,
  onOpenPaymentModal,
}) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(preSelectedPatient || null);
  const [searchPatientText, setSearchPatientText] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  // Form states
  const [date, setDate] = useState('2026-10-07');
  const [time, setTime] = useState('09:30 AM');
  const [room, setRoom] = useState('dental');
  const [doctor, setDoctor] = useState('Dr. Demo');
  const [visitType, setVisitType] = useState<VisitType>('Examination');
  const [priority, setPriority] = useState<VisitPriority>('Normal');
  const [note, setNote] = useState('');
  const [visitFee, setVisitFee] = useState<number | ''>(150);
  const [paidAmount, setPaidAmount] = useState<number | ''>('');
  const [ignoreTimeValidation, setIgnoreTimeValidation] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Filter patients for search
  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchPatientText.toLowerCase()) ||
      p.patientCode.toLowerCase().includes(searchPatientText.toLowerCase()) ||
      p.phone.includes(searchPatientText)
  );

  const handleSelectPatient = (p: Patient) => {
    setSelectedPatient(p);
    setSearchPatientText(p.name);
    setShowPatientDropdown(false);
  };

  const handleAddPaymentClick = () => {
    onOpenPaymentModal(Number(visitFee) || 0, (amount) => {
      setPaidAmount(amount);
    });
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    if (!selectedPatient) {
      setErrorMessage('Please select a patient before submitting.');
      return;
    }
    if (!date || !time) {
      setErrorMessage('Please specify date and time for the appointment.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSaveAppointment({
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        patientCode: selectedPatient.patientCode,
        date,
        time,
        room,
        doctor,
        visitType,
        priority,
        note,
        visitFee: Number(visitFee) || 0,
        paidAmount: Number(paidAmount) || 0,
        ignoreTimeValidation,
      });
      // Navigate back to schedule
      onNavigate('advance-appointment');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error booking appointment.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6" data-purpose="main-content">
      {/* Header with action controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">New Appointment</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Select patient and schedule to view available time slots
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => onNavigate('advance-appointment')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-xs transition"
            type="button"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Advance </span><span>Reservation</span>
          </button>

          <button
            onClick={() => onNavigate('advance-appointment')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-xs transition cursor-pointer"
            type="button"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>Back</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs font-semibold text-white bg-[#0f5b57] hover:bg-[#0b4845] rounded-lg shadow-sm transition disabled:opacity-50"
            type="button"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form Grid (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Patient & Summary Cards) */}
        <div className="lg:col-span-4 space-y-6" data-purpose="sidebar-panels">
          {/* SELECT PATIENT CARD */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Select Patient
              </span>
              <button
                type="button"
                onClick={onOpenNewPatientModal}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Patient</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchPatientText}
                onChange={(e) => {
                  setSearchPatientText(e.target.value);
                  setShowPatientDropdown(true);
                }}
                onFocus={() => setShowPatientDropdown(true)}
                placeholder="Search patient..."
                className="w-full text-sm rounded-lg border border-slate-300 focus:border-teal-600 focus:ring-teal-600 pl-3.5 pr-9 py-2.5 placeholder-slate-400 text-slate-800 outline-none"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>

              {/* Patient Autocomplete Dropdown */}
              {showPatientDropdown && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-30 max-h-48 overflow-y-auto">
                  {filteredPatients.length === 0 ? (
                    <div className="p-3 text-xs text-slate-400 text-center">
                      No matching patient.{' '}
                      <button
                        onClick={onOpenNewPatientModal}
                        className="text-teal-700 font-semibold hover:underline"
                      >
                        Create one?
                      </button>
                    </div>
                  ) : (
                    filteredPatients.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectPatient(p)}
                        className="p-2.5 text-xs hover:bg-teal-50 cursor-pointer border-b border-slate-100 last:border-0 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">{p.name}</p>
                          <p className="text-[11px] text-slate-400">
                            {p.patientCode} • {p.phone}
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-400">{p.gender}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* SUMMARY CARD */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Summary</h2>

            <div className="divide-y divide-slate-100 text-xs md:text-sm">
              {/* Patient */}
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Patient</span>
                </div>
                <span className="font-semibold text-slate-800">
                  {selectedPatient ? selectedPatient.name : 'Not set'}
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Date</span>
                </div>
                <span className="font-semibold text-slate-800">Wed, Oct 7</span>
              </div>

              {/* Room */}
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <DoorOpen className="w-4 h-4 text-slate-400" />
                  <span>Room</span>
                </div>
                <span className="font-semibold text-slate-800">{room}</span>
              </div>

              {/* Doctor */}
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Stethoscope className="w-4 h-4 text-slate-400" />
                  <span>Doctor</span>
                </div>
                <span className="font-semibold text-slate-800">{doctor || 'Not set'}</span>
              </div>

              {/* Visit type */}
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Tag className="w-4 h-4 text-slate-400" />
                  <span>Visit type</span>
                </div>
                <span className="font-semibold text-slate-800">{visitType}</span>
              </div>

              {/* Priority */}
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <ListOrdered className="w-4 h-4 text-slate-400" />
                  <span>Priority</span>
                </div>
                <span className="font-semibold text-slate-800">{priority}</span>
              </div>

              {/* Visit fee */}
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <BadgeDollarSign className="w-4 h-4 text-slate-400" />
                  <span>Visit fee</span>
                </div>
                <span className="font-semibold text-slate-800">
                  {visitFee ? `${visitFee}.00 EGP` : 'Not set'}
                </span>
              </div>

              {/* Paid amount */}
              <div className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Banknote className="w-4 h-4 text-slate-400" />
                  <span>Paid amount</span>
                </div>
                <span className="font-semibold text-slate-800">
                  {paidAmount ? `${paidAmount}.00 EGP` : 'Not set'}
                </span>
              </div>
            </div>

            {/* Status Alert Pill */}
            <div className="pt-2">
              <div
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-medium ${
                  selectedPatient && time
                    ? 'bg-teal-50 border border-teal-200 text-teal-800'
                    : 'bg-amber-50/80 border border-amber-200/60 text-amber-700'
                }`}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  {selectedPatient && time ? 'Ready to submit' : 'Patient · Time'}
                </span>
              </div>
            </div>
          </div>

          {/* IGNORE TIME VALIDATION CARD */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800">Ignore time validation</h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Book outside the room's working hours, and over a slot that is already taken.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={ignoreTimeValidation}
                onChange={(e) => setIgnoreTimeValidation(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>
        </div>

        {/* Right Main Column (Form Details) */}
        <div className="lg:col-span-8 space-y-6" data-purpose="form-details">
          {/* APPOINTMENT DETAILS CARD */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Appointment Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Date input */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Date</span>
                    <span className="text-red-500 font-bold">*</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-sm rounded-lg border border-slate-300 focus:border-teal-600 focus:ring-teal-600 pl-3.5 pr-10 py-2.5 text-slate-800 outline-none"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Calendar className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Time input */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Time</span>
                    <span className="text-red-500 font-bold">*</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="--:-- --"
                    className="w-full text-sm rounded-lg border border-slate-300 focus:border-teal-600 focus:ring-teal-600 pl-3.5 pr-10 py-2.5 text-slate-800 outline-none"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Clock className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Room select */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <DoorOpen className="w-3.5 h-3.5 text-slate-500" />
                    <span>Room</span>
                    <span className="text-red-500 font-bold">*</span>
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full text-sm rounded-lg border border-slate-300 focus:border-teal-600 focus:ring-teal-600 pl-3.5 pr-10 py-2.5 text-slate-800 bg-white outline-none cursor-pointer"
                  >
                    <option value="dental">dental</option>
                    <option value="consultation-1">consultation-1</option>
                    <option value="consultation-2">consultation-2</option>
                    <option value="examination">examination</option>
                  </select>
                </div>
              </div>

              {/* Doctor select */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-slate-500" />
                    <span>Doctor</span>
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    className="w-full text-sm rounded-lg border border-slate-300 focus:border-teal-600 focus:ring-teal-600 pl-3.5 pr-10 py-2.5 text-slate-700 bg-white outline-none cursor-pointer"
                  >
                    <option value="Dr. Demo">Dr. Demo</option>
                    <option value="Dr. Ahmed Ali">Dr. Ahmed Ali</option>
                    <option value="Dr. Sarah Ibrahim">Dr. Sarah Ibrahim</option>
                    <option value="No doctor assigned">No doctor assigned</option>
                  </select>
                </div>
              </div>

              {/* Visit type select */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-slate-500" />
                    <span>Visit type</span>
                    <span className="text-red-500 font-bold">*</span>
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={visitType}
                    onChange={(e) => setVisitType(e.target.value as VisitType)}
                    className="w-full text-sm rounded-lg border border-slate-300 focus:border-teal-600 focus:ring-teal-600 pl-3.5 pr-10 py-2.5 text-slate-800 bg-white outline-none cursor-pointer"
                  >
                    <option value="Examination">Examination</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Procedure">Procedure</option>
                    <option value="Consultation">Consultation</option>
                  </select>
                </div>
              </div>

              {/* Priority select */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <ListOrdered className="w-3.5 h-3.5 text-slate-500" />
                    <span>Priority</span>
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as VisitPriority)}
                    className="w-full text-sm rounded-lg border border-slate-300 focus:border-teal-600 focus:ring-teal-600 pl-3.5 pr-10 py-2.5 text-slate-800 bg-white outline-none cursor-pointer"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  Only changes the order when Priority is one of the rules. It is always recorded on
                  the visit.
                </p>
              </div>
            </div>

            {/* Note textarea */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                <span className="inline-flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Note</span>
                </span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Reason for visit, special instructions..."
                rows={4}
                className="w-full text-sm rounded-lg border border-slate-300 focus:border-teal-600 focus:ring-teal-600 p-3 placeholder-slate-400 text-slate-800 outline-none"
              />
            </div>
          </div>

          {/* PAYMENT DETAILS CARD */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Payment Details
            </h2>

            <div className="flex flex-col items-center justify-center pt-2 pb-4 space-y-4">
              <div className="w-full max-w-xs space-y-2">
                <label className="block text-center text-xs font-medium text-slate-700">
                  <span className="inline-flex items-center gap-1.5">
                    <BadgeDollarSign className="w-3.5 h-3.5 text-slate-500" />
                    <span>Visit fee</span>
                  </span>
                </label>

                <div className="relative">
                  <input
                    type="number"
                    value={visitFee}
                    onChange={(e) => setVisitFee(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-sm text-center rounded-lg border border-slate-300 focus:border-teal-600 focus:ring-teal-600 py-2.5 font-medium text-slate-800 pr-12 outline-none"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs font-bold text-slate-500">
                    EGP
                  </div>
                </div>

                <p className="text-center text-xs text-slate-500 pt-1">
                  No default prices set.{' '}
                  <span className="text-teal-700 hover:underline font-medium cursor-pointer">
                    Click here to add default prices.
                  </span>
                </p>
              </div>

              {/* Add Payment Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAddPaymentClick}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-xs transition"
                >
                  <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                  <span>+ Add Payment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
