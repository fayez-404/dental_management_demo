import React, { useState } from 'react';
import { Calendar, UserCheck, Stethoscope, Building2, Plus, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { Patient, Appointment } from '../../types';

interface TodaysPatientsViewProps {
  onNavigate: (view: string) => void;
  patients: Patient[];
  appointments: Appointment[];
  onOpenWalkInModal: () => void;
}

export const TodaysPatientsView: React.FC<TodaysPatientsViewProps> = ({
  onNavigate,
  patients,
  appointments,
  onOpenWalkInModal,
}) => {
  // Check if any appointment is for today (2026-10-07)
  const todayAppointments = appointments.filter((a) => a.date === '2026-10-07');
  const [activeQueueTab, setActiveQueueTab] = useState<'all' | 'waiting' | 'in-room'>('all');

  return (
    <main className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-10 py-5 sm:py-7 flex flex-col justify-between" data-purpose="content-area">
      {/* Top Title & Branch Label */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-snug">
            Today's patients
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Wednesday 7 Oct 2026
          </p>
        </div>

        {/* Arabic Branch Tag */}
        <div className="self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#e6edf5] text-slate-600 border border-slate-200/50">
            <Building2 className="w-3.5 h-3.5 text-slate-500 stroke-[1.8]" />
            <span dir="rtl">الفرع الرئيسي</span>
          </span>
        </div>
      </div>

      {/* Main Container: If empty, show exact empty state from Screen 5. Otherwise show active queue! */}
      {todayAppointments.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 sm:-mt-16 text-center" data-purpose="empty-state-view">
          {/* Calendar Icon in Soft Container */}
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-5 shadow-xs">
            <Calendar className="w-6 h-6 stroke-[1.6]" />
          </div>

          {/* Heading */}
          <h2 className="text-base font-bold text-slate-900 tracking-tight mb-2">
            Nothing booked with you today
          </h2>

          {/* Description */}
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-6 px-2">
            A patient who walks in can be opened from the patient list.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs sm:max-w-none justify-center">
            {/* Primary Action Button: All Patient */}
            <button
              onClick={() => onNavigate('all-patients')}
              className="w-full sm:w-auto h-10 sm:h-9 px-4 rounded-lg bg-[#0d6559] hover:bg-[#09473e] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              type="button"
            >
              <UserCheck className="w-3.5 h-3.5 stroke-[2]" />
              <span>All Patient</span>
            </button>

            {/* Walk-in Intake Button */}
            <button
              onClick={onOpenWalkInModal}
              className="w-full sm:w-auto h-10 sm:h-9 px-3.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
              type="button"
            >
              <Plus className="w-3.5 h-3.5 text-slate-500 stroke-[2]" />
              <span>Open Walk-in</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Today's Patient Queue */
        <div className="flex-1 mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Clinic Waiting Queue ({todayAppointments.length})
              </span>
            </div>
            <button
              onClick={onOpenWalkInModal}
              className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-teal-800 text-white text-xs font-semibold hover:bg-teal-900 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Walk-in Patient</span>
            </button>
          </div>

          <div className="grid gap-3">
            {todayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-800 text-white font-bold flex items-center justify-center text-sm shrink-0">
                    {apt.patientName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{apt.patientName}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>Room {apt.room}</span>
                      <span>•</span>
                      <span>{apt.time}</span>
                      <span>•</span>
                      <span className="text-teal-700 font-medium">{apt.visitType}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                    {apt.status}
                  </span>
                  <button
                    onClick={() => onNavigate('new-appointment')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0d6559] text-white hover:bg-[#09473e] transition cursor-pointer"
                  >
                    Open Clinical Visit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Spacer to preserve visual balance */}
      <div className="h-6"></div>
    </main>
  );
};
