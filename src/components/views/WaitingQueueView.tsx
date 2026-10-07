import React from 'react';
import { Users, Clock, Plus, CheckCircle, ArrowRight } from 'lucide-react';
import { Appointment } from '../../types';

interface WaitingQueueViewProps {
  appointments: Appointment[];
  onOpenNewAppointment: () => void;
  onNavigate: (view: string) => void;
}

export const WaitingQueueView: React.FC<WaitingQueueViewProps> = ({
  appointments,
  onOpenNewAppointment,
  onNavigate,
}) => {
  return (
    <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Waiting Queue & Triage</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active patient flow, triage priority, and room assignment
          </p>
        </div>

        <button
          onClick={onOpenNewAppointment}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 shadow-xs transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Reservation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Waiting Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Waiting ({appointments.filter((a) => a.status === 'Waiting' || a.status === 'Booked').length})
            </h3>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          </div>

          <div className="space-y-2">
            {appointments.map((a) => (
              <div
                key={a.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1 hover:border-teal-500 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{a.patientName}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                    {a.time}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Room: {a.room}</span>
                  <span className="text-teal-700 font-medium">{a.visitType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In Consultation Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              In Consultation
            </h3>
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
          </div>
          <div className="p-8 text-center text-xs text-slate-400">
            No patient currently inside dental room examination chair.
          </div>
        </div>

        {/* Completed Visits Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Completed Today
            </h3>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          </div>
          <div className="p-8 text-center text-xs text-slate-400">
            Visits marked completed will archive here.
          </div>
        </div>
      </div>
    </main>
  );
};
