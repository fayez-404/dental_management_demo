/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TopHeader } from './components/layout/TopHeader';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { TodaysPatientsView } from './components/views/TodaysPatientsView';
import { PatientsListView } from './components/views/PatientsListView';
import { AddPatientView } from './components/views/AddPatientView';
import { NewAppointmentView } from './components/views/NewAppointmentView';
import { AdvanceAppointmentView } from './components/views/AdvanceAppointmentView';
import { QuestionsView } from './components/views/QuestionsView';
import { WaitingQueueView } from './components/views/WaitingQueueView';

import { PaymentModal } from './components/modals/PaymentModal';
import { AssistantModal } from './components/modals/AssistantModal';
import { ImportModal } from './components/modals/ImportModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';

import { Patient, Appointment, DaySchedule } from './types';
import { fileStorage } from './services/fileStorage';

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<string>('todays-patients');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // Data Stores (retrieved from and saved to the File System Storage)
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [scheduleData, setScheduleData] = useState<DaySchedule[]>([]);

  // Room Selection
  const [selectedRoom, setSelectedRoom] = useState<string>('dental');

  // Search & Filters for Patients Directory
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Modal Visibility States
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  // Payment Modal State
  const [paymentModalState, setPaymentModalState] = useState<{
    isOpen: boolean;
    fee: number;
    onPaid?: (amount: number) => void;
  }>({
    isOpen: false,
    fee: 150,
  });

  // Selected Patient for Contextual Actions
  const [contextPatient, setContextPatient] = useState<Patient | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // =========================================================================
  // DATA OPERATIONS (API calls commented out; using File System Storage instead)
  // =========================================================================

  // 1. Fetch Patients
  const loadPatients = useCallback(async () => {
    /* -------------------------------------------------------------
     * [COMMENTED API CALL]
     * Original backend endpoint call:
     *
     * try {
     *   const params = new URLSearchParams();
     *   if (searchQuery) params.append('search', searchQuery);
     *   if (activeFilter !== 'all') params.append('filter', activeFilter);
     *   const res = await fetch(`/api/patients?${params.toString()}`);
     *   if (res.ok) {
     *     const data = await res.json();
     *     setPatients(data.patients || []);
     *   }
     * } catch (err) {
     *   console.error('Failed to load patients via API:', err);
     * }
     * ------------------------------------------------------------- */

    // Retrieve directly from the File System Storage
    try {
      const data = fileStorage.getPatients(searchQuery, activeFilter);
      setPatients(data);
    } catch (err) {
      console.error('Failed to read patients from file storage:', err);
    }
  }, [searchQuery, activeFilter]);

  // 2. Fetch Appointments
  const loadAppointments = useCallback(async () => {
    /* -------------------------------------------------------------
     * [COMMENTED API CALL]
     * Original backend endpoint call:
     *
     * try {
     *   const res = await fetch('/api/appointments');
     *   if (res.ok) {
     *     const data = await res.json();
     *     setAppointments(data || []);
     *   }
     * } catch (err) {
     *   console.error('Failed to load appointments via API:', err);
     * }
     * ------------------------------------------------------------- */

    // Retrieve directly from the File System Storage
    try {
      const data = fileStorage.getAppointments();
      setAppointments(data);
    } catch (err) {
      console.error('Failed to read appointments from file storage:', err);
    }
  }, []);

  // 3. Fetch Weekly Schedule
  const loadSchedule = useCallback(async () => {
    /* -------------------------------------------------------------
     * [COMMENTED API CALL]
     * Original backend endpoint call:
     *
     * try {
     *   const res = await fetch(`/api/schedule?room=${encodeURIComponent(selectedRoom)}`);
     *   if (res.ok) {
     *     const data = await res.json();
     *     setScheduleData(data.schedule || []);
     *   }
     * } catch (err) {
     *   console.error('Failed to load schedule via API:', err);
     * }
     * ------------------------------------------------------------- */

    // Calculate & retrieve directly from the File System Storage
    try {
      const schedule = fileStorage.getSchedule(selectedRoom);
      setScheduleData(schedule);
    } catch (err) {
      console.error('Failed to compute schedule from file storage:', err);
    }
  }, [selectedRoom]);

  // Initial Load from File System Storage
  useEffect(() => {
    loadPatients();
    loadAppointments();
    loadSchedule();
  }, [loadPatients, loadAppointments, loadSchedule]);

  // 4. Save New Patient
  const handleSavePatient = async (patientData: Partial<Patient>) => {
    /* -------------------------------------------------------------
     * [COMMENTED API CALL]
     * Original backend endpoint call:
     *
     * const res = await fetch('/api/patients', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify(patientData),
     * });
     * if (!res.ok) {
     *   const errData = await res.json();
     *   throw new Error(errData.error || 'Failed to save patient.');
     * }
     * const saved = await res.json();
     * ------------------------------------------------------------- */

    // Save directly to the File System Storage
    const saved = fileStorage.savePatient(patientData);
    showToast(`Patient ${saved.name} saved to file system.`);
    await loadPatients();
    setCurrentView('all-patients');
  };

  // 5. Delete Patient
  const handleDeletePatient = async (id: string) => {
    /* -------------------------------------------------------------
     * [COMMENTED API CALL]
     * Original backend endpoint call:
     *
     * try {
     *   const res = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
     *   if (res.ok) {
     *     showToast('Patient record deleted.');
     *     loadPatients();
     *   }
     * } catch (err) {
     *   console.error('Delete error via API:', err);
     * }
     * ------------------------------------------------------------- */

    // Delete directly from the File System Storage
    fileStorage.deletePatient(id);
    showToast('Patient record removed from file system.');
    await loadPatients();
  };

  // 6. Save Appointment
  const handleSaveAppointment = async (aptData: Partial<Appointment>) => {
    /* -------------------------------------------------------------
     * [COMMENTED API CALL]
     * Original backend endpoint call:
     *
     * const res = await fetch('/api/appointments', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify(aptData),
     * });
     * if (!res.ok) {
     *   const errData = await res.json();
     *   throw new Error(errData.error || 'Failed to create appointment.');
     * }
     * const saved = await res.json();
     * ------------------------------------------------------------- */

    // Save directly to the File System Storage
    const saved = fileStorage.saveAppointment(aptData);
    showToast(`Appointment confirmed for ${saved.patientName} at ${saved.time}. Saved to file.`);
    await loadAppointments();
    await loadSchedule();
    await loadPatients();
  };

  // 7. Import Sample Patients
  const handleImportPatients = async (sampleList: Partial<Patient>[]) => {
    /* -------------------------------------------------------------
     * [COMMENTED API CALL]
     * Original backend endpoint call:
     *
     * for (const item of sampleList) {
     *   await fetch('/api/patients', {
     *     method: 'POST',
     *     headers: { 'Content-Type': 'application/json' },
     *     body: JSON.stringify(item),
     *   });
     * }
     * ------------------------------------------------------------- */

    // Save each imported patient directly to the File System Storage
    for (const item of sampleList) {
      fileStorage.savePatient(item);
    }
    showToast(`Imported ${sampleList.length} patients and wrote to file system.`);
    await loadPatients();
  };

  // Contextual actions
  const handleSelectPatientForAppointment = (patient: Patient) => {
    setContextPatient(patient);
    setCurrentView('new-appointment');
  };

  const handleOpenWalkIn = () => {
    if (patients.length > 0) {
      setContextPatient(patients[0]);
    }
    setCurrentView('new-appointment');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#f4f6f8] text-slate-800 font-sans antialiased">
      {/* Top Header Bar */}
      <TopHeader
        currentView={currentView}
        onNavigate={(view) => {
          setContextPatient(null);
          setCurrentView(view);
        }}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onCallAssistant={() => setIsAssistantModalOpen(true)}
      />

      {/* Main Workspace Frame */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Navigation Sidebar */}
        <LeftSidebar
          currentView={currentView}
          onNavigate={(view) => {
            setContextPatient(null);
            setCurrentView(view);
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Dynamic View Viewport */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {currentView === 'todays-patients' && (
            <TodaysPatientsView
              onNavigate={(view) => setCurrentView(view)}
              patients={patients}
              appointments={appointments}
              onOpenWalkInModal={handleOpenWalkIn}
            />
          )}

          {currentView === 'all-patients' && (
            <PatientsListView
              patients={patients}
              onNavigate={(view) => setCurrentView(view)}
              onSelectPatientForAppointment={handleSelectPatientForAppointment}
              onOpenImportModal={() => setIsImportModalOpen(true)}
              onDeletePatient={handleDeletePatient}
              searchQuery={searchQuery}
              onSearchChange={(q) => setSearchQuery(q)}
              activeFilter={activeFilter}
              onFilterChange={(f) => setActiveFilter(f)}
            />
          )}

          {currentView === 'new-patient' && (
            <AddPatientView
              onCancel={() => setCurrentView('all-patients')}
              onSavePatient={handleSavePatient}
              existingPatientsCount={patients.length}
            />
          )}

          {currentView === 'new-appointment' && (
            <NewAppointmentView
              patients={patients}
              onNavigate={(view) => setCurrentView(view)}
              onSaveAppointment={handleSaveAppointment}
              preSelectedPatient={contextPatient}
              onOpenNewPatientModal={() => setCurrentView('new-patient')}
              onOpenPaymentModal={(fee, onPaid) => {
                setPaymentModalState({
                  isOpen: true,
                  fee,
                  onPaid,
                });
              }}
            />
          )}

          {currentView === 'advance-appointment' && (
            <AdvanceAppointmentView
              patients={patients}
              scheduleData={scheduleData}
              onNavigate={(view) => setCurrentView(view)}
              onSaveAppointment={handleSaveAppointment}
              onOpenNewPatientModal={() => setCurrentView('new-patient')}
              onOpenPaymentModal={(fee, onPaid) => {
                setPaymentModalState({
                  isOpen: true,
                  fee,
                  onPaid,
                });
              }}
              selectedRoom={selectedRoom}
              onSelectRoom={(r) => setSelectedRoom(r)}
            />
          )}

          {currentView === 'waiting-queue' && (
            <WaitingQueueView
              appointments={appointments}
              onOpenNewAppointment={() => setCurrentView('new-appointment')}
              onNavigate={(view) => setCurrentView(view)}
            />
          )}

          {currentView === 'questions' && <QuestionsView />}
        </div>
      </div>

      {/* Interactive Global Modals */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        patients={patients}
        appointments={appointments}
        onSelectPatient={(p) => {
          setContextPatient(p);
          setCurrentView('all-patients');
        }}
      />

      <AssistantModal
        isOpen={isAssistantModalOpen}
        onClose={() => setIsAssistantModalOpen(false)}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportPatients={handleImportPatients}
      />

      <PaymentModal
        isOpen={paymentModalState.isOpen}
        onClose={() => setPaymentModalState({ isOpen: false, fee: 150 })}
        visitFee={paymentModalState.fee}
        onConfirm={(amount, method) => {
          if (paymentModalState.onPaid) {
            paymentModalState.onPaid(amount);
          }
          showToast(`Recorded ${amount}.00 EGP payment via ${method}. Saved to file.`);
        }}
      />

      {/* Floating System Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
