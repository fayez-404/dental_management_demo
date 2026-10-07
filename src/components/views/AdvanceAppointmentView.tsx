import React, { useState } from 'react';
import {
  ArrowLeft,
  DoorOpen,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Sliders,
  Plus,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Patient, DaySchedule, ScheduleSlot, Appointment, VisitType, VisitPriority } from '../../types';

interface AdvanceAppointmentViewProps {
  patients: Patient[];
  scheduleData: DaySchedule[];
  onNavigate: (view: string) => void;
  onSaveAppointment: (data: Partial<Appointment>) => Promise<void>;
  onOpenNewPatientModal: () => void;
  onOpenPaymentModal: (fee: number, onPaid: (amount: number) => void) => void;
  selectedRoom: string;
  onSelectRoom: (room: string) => void;
}

export const AdvanceAppointmentView: React.FC<AdvanceAppointmentViewProps> = ({
  patients,
  scheduleData,
  onNavigate,
  onSaveAppointment,
  onOpenNewPatientModal,
  onOpenPaymentModal,
  selectedRoom,
  onSelectRoom,
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState('All doctors');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    dateStr: string;
    dayName: string;
    dayNumber: number;
    time: string;
  } | null>(null);

  // Selected Patient
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [visitType, setVisitType] = useState<VisitType>('Examination');
  const [priority, setPriority] = useState<VisitPriority>('Normal');
  const [note, setNote] = useState('');
  const [visitFee, setVisitFee] = useState<number | ''>(150);
  const [paidAmount, setPaidAmount] = useState<number | ''>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  const handleSlotClick = (day: DaySchedule, slot: ScheduleSlot) => {
    if (slot.status === 'booked' || slot.status === 'closed') {
      return;
    }
    // Toggle or select
    if (
      selectedSlot &&
      selectedSlot.dateStr === day.dateStr &&
      selectedSlot.time === slot.time
    ) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot({
        dateStr: day.dateStr,
        dayName: day.dayName,
        dayNumber: day.dayNumber,
        time: slot.time,
      });
    }
  };

  const handleAddPayment = () => {
    onOpenPaymentModal(Number(visitFee) || 0, (amount) => {
      setPaidAmount(amount);
    });
  };

  const handleBookingSubmit = async () => {
    setErrorMessage('');
    if (!selectedSlot) {
      setErrorMessage('Please select an available time slot on the calendar.');
      return;
    }
    if (!selectedPatient) {
      setErrorMessage('Please select a patient for the reservation.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSaveAppointment({
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        patientCode: selectedPatient.patientCode,
        date: selectedSlot.dateStr,
        time: selectedSlot.time,
        room: selectedRoom,
        doctor: selectedDoctor === 'All doctors' ? 'Dr. Demo' : selectedDoctor,
        visitType,
        priority,
        note,
        visitFee: Number(visitFee) || 0,
        paidAmount: Number(paidAmount) || 0,
      });
      // Clear slot after booking
      setSelectedSlot(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto">
      {/* Header Action Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Advance Appointment Reservation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Select patient and schedule to view available time slots
          </p>
        </div>

        <button
          onClick={() => onNavigate('new-appointment')}
          className="self-start sm:self-auto px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium text-xs hover:bg-slate-50 flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          type="button"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
          <span>Back to appointments</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filter & Date Controls Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Controls: Room & Doctor Dropdowns */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Room Selector */}
          <div className="w-full sm:w-48 md:w-52">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
              <DoorOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>Room</span>
            </label>
            <div className="relative">
              <select
                value={selectedRoom}
                onChange={(e) => onSelectRoom(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50/50 border border-slate-200 rounded-lg py-2 pl-3 pr-8 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-700 focus:border-teal-700 cursor-pointer"
              >
                <option value="dental">dental</option>
                <option value="consultation-1">consultation-1</option>
                <option value="consultation-2">consultation-2</option>
                <option value="examination">examination</option>
              </select>
            </div>
          </div>

          {/* Doctor Selector */}
          <div className="w-full sm:w-48 md:w-52">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
              <span>Doctor</span>
            </label>
            <div className="relative">
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50/50 border border-slate-200 rounded-lg py-2 pl-3 pr-8 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-700 focus:border-teal-700 cursor-pointer"
              >
                <option value="All doctors">All doctors</option>
                <option value="Dr. Demo">Dr. Demo</option>
                <option value="Dr. Ahmed Ali">Dr. Ahmed Ali</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Controls: Week navigation & filters */}
        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 sm:gap-3 w-full md:w-auto">
          {/* Date Pagination */}
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              type="button"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-800 px-2 tracking-wide">
              3 – Oct 9, 2026
            </span>
            <button
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              type="button"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* This Week Action */}
          <button
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
            type="button"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>This Week</span>
          </button>

          {/* Available Only Filter */}
          <button
            onClick={() => setAvailableOnly(!availableOnly)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
              availableOnly
                ? 'bg-teal-50 border-teal-300 text-teal-800 font-semibold'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            type="button"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>Available only</span>
          </button>
        </div>
      </div>

      {/* Schedule Grid & Right Reservation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Grid Section */}
        <div className="lg:col-span-8 space-y-4">
          {/* Legend & Instructions */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs px-1">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full border border-teal-500 bg-white"></span>
                <span className="text-slate-600 text-[11px]">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-800"></span>
                <span className="text-slate-600 text-[11px]">Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span className="text-slate-600 text-[11px]">Booked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-300"></span>
                <span className="text-slate-600 text-[11px]">Closed</span>
              </div>
            </div>
            <span className="text-slate-400 text-[11px]">
              Click an available cell to set the appointment time.
            </span>
          </div>

          {/* 7-Day Columns Layout */}
          <div className="overflow-x-auto pb-3 -mx-1 px-1">
            <div className="grid grid-cols-7 gap-2.5 min-w-[620px] lg:min-w-0">
            {scheduleData.map((day) => {
              const isSelectedDay = selectedSlot?.dateStr === day.dateStr;

              return (
                <div key={day.dateStr} className="flex flex-col gap-2.5">
                  {/* Day Header Box */}
                  <div
                    className={`rounded-lg p-2.5 text-center shadow-xs border transition ${
                      day.isToday
                        ? 'bg-teal-50/50 border-teal-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <span
                      className={`block text-[10px] font-bold uppercase tracking-wider ${
                        day.isToday ? 'text-teal-800' : 'text-slate-400'
                      }`}
                    >
                      {day.dayName}
                    </span>
                    <span
                      className={`block text-base font-bold ${
                        day.isToday ? 'text-slate-800' : 'text-slate-700'
                      }`}
                    >
                      {day.dayNumber}
                    </span>
                    <span
                      className={`block text-[10px] font-medium mt-0.5 ${
                        day.isOpen
                          ? 'text-teal-700 font-semibold'
                          : 'text-slate-400'
                      }`}
                    >
                      {day.isOpen ? `${day.openCount} open` : 'Closed'}
                    </span>
                  </div>

                  {/* Day Slots or Closed Box */}
                  {day.isClosed ? (
                    <div className="h-10 rounded-lg border border-dashed border-slate-200 bg-striped-pattern flex items-center justify-center">
                      <span className="text-[11px] text-slate-400 font-medium">Closed</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {day.slots.map((slot) => {
                        const isSlotSelected =
                          selectedSlot?.dateStr === day.dateStr &&
                          selectedSlot?.time === slot.time;

                        if (slot.status === 'booked') {
                          return (
                            <div
                              key={slot.id}
                              className="p-2.5 rounded-lg border border-slate-200 bg-white shadow-xs text-left cursor-default"
                            >
                              <span className="block text-xs font-bold text-slate-800">
                                {slot.time}
                              </span>
                              <span className="block text-[11px] text-slate-500 font-medium truncate">
                                {slot.bookedPatientName || 'Booked'}
                              </span>
                            </div>
                          );
                        }

                        // Available Slot
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => handleSlotClick(day, slot)}
                            className={`w-full p-2.5 rounded-lg text-left shadow-xs transition-all cursor-pointer ${
                              isSlotSelected
                                ? 'bg-teal-800 text-white border border-teal-800 ring-2 ring-teal-600'
                                : 'border border-teal-200 hover:border-teal-500 bg-white hover:bg-teal-50/40'
                            }`}
                          >
                            <span
                              className={`block text-xs font-bold ${
                                isSlotSelected ? 'text-white' : 'text-slate-800'
                              }`}
                            >
                              {slot.time}
                            </span>
                            <span
                              className={`block text-[11px] font-medium ${
                                isSlotSelected ? 'text-teal-100' : 'text-teal-700'
                              }`}
                            >
                              {isSlotSelected ? 'Selected' : 'Available'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          </div>
        </div>

        {/* Booking Reservation Panel (Right) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
          {/* Patient Selection Header & Action */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                SELECT PATIENT
              </span>
              <button
                type="button"
                onClick={onOpenNewPatientModal}
                className="text-teal-800 hover:text-teal-900 text-xs font-semibold flex items-center gap-1 border border-slate-200 px-2 py-0.5 rounded-md hover:bg-slate-50 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>New Patient</span>
              </button>
            </div>

            {/* Patient Autocomplete / Select */}
            <div>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full text-xs font-medium border border-slate-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-teal-700 focus:border-teal-700 bg-slate-50/40 text-slate-800"
              >
                <option value="">Please select a patient *</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.patientCode} - {p.phone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Appointment Slot & Details */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase block">
              APPOINTMENT
            </span>

            {/* Selected Slot Banner or Unselected Notice */}
            {selectedSlot ? (
              <div className="border border-teal-300 bg-teal-50/70 rounded-lg p-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-900">
                    {selectedSlot.dayName} {selectedSlot.dayNumber} Oct · {selectedSlot.time}
                  </span>
                  <span className="text-[10px] bg-teal-800 text-white font-semibold px-2 py-0.5 rounded">
                    Room: {selectedRoom}
                  </span>
                </div>
                <p className="text-[11px] text-teal-700 mt-1">
                  Ready to book with{' '}
                  {selectedDoctor === 'All doctors' ? 'Dr. Demo' : selectedDoctor}
                </p>
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-lg p-3 text-center bg-slate-50/50">
                <p className="text-xs text-slate-400 font-medium">
                  Pick a time on the calendar to start a booking.
                </p>
              </div>
            )}

            {/* Visit Type Dropdown */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Visit type</label>
              <select
                value={visitType}
                onChange={(e) => setVisitType(e.target.value as VisitType)}
                className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg py-2 px-3 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-700 focus:border-teal-700 cursor-pointer"
              >
                <option value="Examination">Examination</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Consultation">Consultation</option>
              </select>
            </div>

            {/* Priority Dropdown */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as VisitPriority)}
                className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg py-2 px-3 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-700 focus:border-teal-700 cursor-pointer"
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                Only changes the order when Priority is one of the rules. It is always recorded on
                the visit.
              </p>
            </div>

            {/* Note Textarea */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Reason for visit, special instructions..."
                rows={3}
                className="w-full text-xs placeholder-slate-400 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-teal-700 focus:border-teal-700 resize-none"
              />
            </div>
          </div>

          {/* Visit Fee & Payment Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            {/* Fee Input */}
            <div className="flex flex-col items-center justify-center">
              <label className="text-xs font-medium text-slate-700 mb-1.5">Visit fee</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={visitFee}
                  onChange={(e) =>
                    setVisitFee(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-24 text-xs text-center border border-slate-200 rounded-lg py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-teal-700 focus:border-teal-700"
                />
                <span className="text-xs font-medium text-slate-500">EGP</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                No default prices set.{' '}
                <span className="text-teal-700 hover:underline cursor-pointer">
                  Click here to add default prices.
                </span>
              </p>
            </div>

            {/* Paid Amount Action */}
            <div className="pt-1 flex flex-col items-center">
              <span className="text-xs font-medium text-slate-700 mb-2">
                {paidAmount ? `Paid: ${paidAmount} EGP` : 'Paid amount'}
              </span>
              <button
                type="button"
                onClick={handleAddPayment}
                className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                <span>{paidAmount ? 'Edit Payment' : 'Add Payment'}</span>
              </button>
            </div>

            {/* Booking Submit Button */}
            <div className="pt-3">
              <button
                type="button"
                onClick={handleBookingSubmit}
                disabled={!selectedSlot || !selectedPatientId || isSubmitting}
                className={`w-full py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
                  selectedSlot && selectedPatientId
                    ? 'bg-teal-800 hover:bg-teal-900 text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Booking...' : 'New Booking'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
