import React, { useState } from 'react';
import { X, Search, User, Calendar, QrCode, ArrowRight } from 'lucide-react';
import { Patient, Appointment } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  appointments: Appointment[];
  onSelectPatient: (patient: Patient) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  patients,
  appointments,
  onSelectPatient,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingPatients = q
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.patientCode.toLowerCase().includes(q) ||
          p.barcode.includes(q) ||
          p.phone.includes(q)
      )
    : [];

  const matchingAppointments = q
    ? appointments.filter(
        (a) =>
          a.patientName.toLowerCase().includes(q) ||
          a.time.toLowerCase().includes(q) ||
          a.room.toLowerCase().includes(q)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 backdrop-blur-xs p-4 pt-20">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by patient name, phone, code (PAT-...), or barcode..."
            autoFocus
            className="w-full text-sm text-slate-800 placeholder-slate-400 outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-4 text-xs">
          {!q ? (
            <p className="text-center py-6 text-slate-400">
              Type to search patients, codes, or appointments across the clinic.
            </p>
          ) : matchingPatients.length === 0 && matchingAppointments.length === 0 ? (
            <p className="text-center py-6 text-slate-400">No results found for "{query}".</p>
          ) : (
            <>
              {matchingPatients.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Patients ({matchingPatients.length})
                  </h4>
                  <div className="space-y-1">
                    {matchingPatients.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectPatient(p);
                          onClose();
                        }}
                        className="p-2.5 rounded-lg hover:bg-teal-50 cursor-pointer flex items-center justify-between border border-transparent hover:border-teal-200 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs">
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{p.name}</p>
                            <p className="text-[11px] text-slate-400">
                              {p.patientCode} • {p.phone}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matchingAppointments.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Appointments ({matchingAppointments.length})
                  </h4>
                  <div className="space-y-1">
                    {matchingAppointments.map((a) => (
                      <div
                        key={a.id}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">{a.patientName}</p>
                          <p className="text-[11px] text-slate-500">
                            {a.date} at {a.time} • Room {a.room}
                          </p>
                        </div>
                        <span className="text-[10px] bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded">
                          {a.visitType}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
