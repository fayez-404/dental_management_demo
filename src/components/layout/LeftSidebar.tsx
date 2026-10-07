import React, { useState } from 'react';
import {
  ContactRound,
  Calendar,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  X
} from 'lucide-react';

interface LeftSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onClose?: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentView,
  onNavigate,
  isOpen,
  onClose,
}) => {
  // Menu expansion states
  const [patientsOpen, setPatientsOpen] = useState(
    currentView === 'all-patients' || currentView === 'new-patient'
  );
  const [appointmentOpen, setAppointmentOpen] = useState(
    currentView === 'new-appointment' ||
    currentView === 'advance-appointment' ||
    currentView === 'waiting-queue'
  );
  const [questionOpen, setQuestionOpen] = useState(false);

  const handleNavClick = (view: string) => {
    onNavigate(view);
    // On mobile devices, auto close the drawer after selecting
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Main Sidebar Element */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200/80 flex flex-col shrink-0 z-50 lg:static lg:z-20 select-none overflow-y-auto shadow-2xl lg:shadow-none animate-in slide-in-from-left duration-200">
        {/* Sidebar Top Header (no add sign on top left, with mobile close button) */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <span className="font-bold text-sm tracking-tight text-slate-900">
            dr demo
          </span>
          {/* Mobile close X button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
            type="button"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu Items */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* Section: Clinical */}
          <div>
            <span className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Clinical
            </span>
            <nav className="mt-2 space-y-1">
              {/* Today's patients */}
              <button
                onClick={() => handleNavClick('todays-patients')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'todays-patients'
                    ? 'bg-[#eaf4f1] text-[#0d6559]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                type="button"
              >
                <Stethoscope
                  className={`w-5 h-5 stroke-[2] ${
                    currentView === 'todays-patients' ? 'text-[#0d6559]' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">Today's patients</span>
              </button>

              {/* Expandable: Patients */}
              <div className="space-y-1">
                <button
                  onClick={() => setPatientsOpen(!patientsOpen)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
                    patientsOpen || currentView === 'all-patients' || currentView === 'new-patient'
                      ? 'bg-teal-50/60 text-teal-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  type="button"
                >
                  <div className="flex items-center gap-3 truncate">
                    <ContactRound
                      className={`w-5 h-5 stroke-[1.8] ${
                        patientsOpen || currentView.includes('patient') ? 'text-teal-700' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">Patients</span>
                  </div>
                  {patientsOpen ? (
                    <ChevronUp className="w-4 h-4 text-teal-700 stroke-[2]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 stroke-[2]" />
                  )}
                </button>

                {patientsOpen && (
                  <div className="pl-4 pr-1 space-y-1 pt-1">
                    <button
                      onClick={() => handleNavClick('new-patient')}
                      className={`w-full text-left flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentView === 'new-patient'
                          ? 'bg-teal-100/70 text-teal-950 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span>New Patient</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('all-patients')}
                      className={`w-full text-left flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentView === 'all-patients'
                          ? 'bg-teal-100/70 text-teal-950 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span>All Patient</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Expandable: Appointment */}
              <div className="space-y-1">
                <button
                  onClick={() => setAppointmentOpen(!appointmentOpen)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
                    appointmentOpen || currentView.includes('appointment')
                      ? 'bg-teal-50/70 text-teal-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  type="button"
                >
                  <div className="flex items-center gap-3 truncate">
                    <Calendar
                      className={`w-5 h-5 stroke-[1.8] ${
                        appointmentOpen || currentView.includes('appointment')
                          ? 'text-teal-700'
                          : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">Appointment</span>
                  </div>
                  {appointmentOpen ? (
                    <ChevronUp className="w-4 h-4 text-teal-700 stroke-[2]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 stroke-[2]" />
                  )}
                </button>

                {appointmentOpen && (
                  <div className="pl-4 pr-1 space-y-1 pt-1 text-xs font-medium text-slate-600">
                    <button
                      onClick={() => handleNavClick('advance-appointment')}
                      className={`w-full text-left block py-1.5 px-2.5 rounded-md transition-colors cursor-pointer ${
                        currentView === 'advance-appointment'
                          ? 'bg-teal-100/60 font-semibold text-teal-900'
                          : 'hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      Advance Reservation
                    </button>
                    <button
                      onClick={() => handleNavClick('new-appointment')}
                      className={`w-full text-left block py-1.5 px-2.5 rounded-md transition-colors cursor-pointer ${
                        currentView === 'new-appointment'
                          ? 'bg-teal-100/60 font-semibold text-teal-900'
                          : 'hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      Manual Reservation
                    </button>
                    <button
                      onClick={() => handleNavClick('todays-patients')}
                      className="w-full text-left block py-1.5 px-2.5 rounded-md hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
                    >
                      Today Appointment
                    </button>
                    <button
                      onClick={() => handleNavClick('waiting-queue')}
                      className={`w-full text-left block py-1.5 px-2.5 rounded-md transition-colors cursor-pointer ${
                        currentView === 'waiting-queue'
                          ? 'bg-teal-100/60 font-semibold text-teal-900'
                          : 'hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      Waiting queue
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Section: Operations */}
          <div>
            <span className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Operations
            </span>
            <nav className="mt-2 space-y-1">
              {/* Expandable: Question */}
              <button
                onClick={() => {
                  setQuestionOpen(!questionOpen);
                  handleNavClick('questions');
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium text-sm transition-colors cursor-pointer ${
                  currentView === 'questions' ? 'bg-teal-50 text-teal-900 font-semibold' : ''
                }`}
                type="button"
              >
                <div className="flex items-center gap-3 truncate">
                  <HelpCircle className="w-5 h-5 text-slate-400 stroke-[1.8]" />
                  <span className="truncate">Question</span>
                </div>
                {questionOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 stroke-[2]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 stroke-[2]" />
                )}
              </button>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};
