import React, { useState } from 'react';
import {
  Upload,
  Plus,
  Search,
  ChevronDown,
  Phone,
  MapPin,
  Edit2,
  Calendar,
  Eye,
  MoreVertical,
  QrCode,
  SlidersHorizontal,
  Trash2,
  FileText
} from 'lucide-react';
import { Patient } from '../../types';

interface PatientsListViewProps {
  patients: Patient[];
  onNavigate: (view: string) => void;
  onSelectPatientForAppointment: (patient: Patient) => void;
  onOpenImportModal: () => void;
  onDeletePatient: (id: string) => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const PatientsListView: React.FC<PatientsListViewProps> = ({
  patients,
  onNavigate,
  onSelectPatientForAppointment,
  onOpenImportModal,
  onDeletePatient,
  onSearchChange,
  searchQuery,
  activeFilter,
  onFilterChange,
}) => {
  const [sortBy, setSortBy] = useState('Newest first');
  const [perPage, setPerPage] = useState('20');
  const [showExtendedFilters, setShowExtendedFilters] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Colors for avatars
  const avatarColors = ['bg-amber-500', 'bg-teal-600', 'bg-blue-600', 'bg-emerald-600', 'bg-purple-600'];

  const getAvatarColor = (name: string) => {
    const code = name.charCodeAt(0) || 0;
    return avatarColors[code % avatarColors.length];
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8" data-purpose="patient-list-screen">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Page Header: Title and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Patients</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {patients.length} registered • {patients.length} added this week
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-xs text-slate-500 mr-1 hidden sm:inline">{patients.length} shown</span>

            {/* Import Button */}
            <button
              onClick={onOpenImportModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-xs transition cursor-pointer"
              type="button"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500 stroke-[2]" />
              <span>Import</span>
            </button>

            {/* New Patient Button */}
            <button
              onClick={() => onNavigate('new-patient')}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 shadow-xs transition cursor-pointer"
              type="button"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>New Patient</span>
            </button>
          </div>
        </div>

        {/* Main Filtering and Search Container */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search Input & Status Chips */}
            <div className="flex flex-1 items-center gap-3 flex-wrap">
              {/* Search Box */}
              <div className="relative w-full sm:w-80 max-w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search name, phone, email or code"
                  className="w-full text-xs text-slate-800 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-700 focus:border-teal-700 transition"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                  <Search className="w-4 h-4 stroke-[2]" />
                </div>
              </div>

              {/* Filters Group */}
              <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 max-w-full">
                <button
                  onClick={() => onFilterChange('all')}
                  className={`px-3 py-1.5 rounded-lg font-semibold border transition ${
                    activeFilter === 'all'
                      ? 'bg-slate-100 text-slate-900 border-slate-200'
                      : 'text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-200'
                  }`}
                  type="button"
                >
                  All
                </button>
                <button
                  onClick={() => onFilterChange('recent')}
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    activeFilter === 'recent'
                      ? 'bg-slate-100 text-slate-900 border-slate-200 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-200'
                  }`}
                  type="button"
                >
                  Added Recently
                </button>
                <button
                  onClick={() => onFilterChange('with_prescriptions')}
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    activeFilter === 'with_prescriptions'
                      ? 'bg-slate-100 text-slate-900 border-slate-200 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-200'
                  }`}
                  type="button"
                >
                  With Prescriptions
                </button>
                <button
                  onClick={() => onFilterChange('inactive')}
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    activeFilter === 'inactive'
                      ? 'bg-slate-100 text-slate-900 border-slate-200 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-200'
                  }`}
                  type="button"
                >
                  Inactive
                </button>
              </div>
            </div>

            {/* Sort & Page Size Controls */}
            <div className="flex items-center gap-4 text-xs text-slate-500 shrink-0">
              <div className="flex items-center gap-1 cursor-pointer">
                <span>Sort by</span>
                <span className="font-semibold text-slate-800">{sortBy}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 stroke-[2]" />
              </div>

              <div className="flex items-center gap-1 cursor-pointer">
                <span>Per Page</span>
                <span className="font-semibold text-slate-800">{perPage}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 stroke-[2]" />
              </div>

              <div className="text-slate-700 font-semibold pl-2 border-l border-slate-200">
                1-{patients.length} of {patients.length}
              </div>
            </div>
          </div>

          {/* Search & Filter Toggle Bar */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2 font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 stroke-[2]" />
              <span>Search & Filter</span>
            </div>
            <button
              onClick={() => setShowExtendedFilters(!showExtendedFilters)}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 cursor-pointer"
              type="button"
            >
              <span>{showExtendedFilters ? 'Hide' : 'Show'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${showExtendedFilters ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Extended Filters Drawer */}
          {showExtendedFilters && (
            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Gender</label>
                <select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2">
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 font-medium mb-1">Doctor Assigned</label>
                <select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2">
                  <option value="">All Doctors</option>
                  <option value="Dr. Demo">Dr. Demo</option>
                  <option value="Dr. Ahmed Ali">Dr. Ahmed Ali</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 font-medium mb-1">Country</label>
                <select className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2">
                  <option value="">All Countries</option>
                  <option value="Egypt">Egypt</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Table Header Labels (visible on desktop) */}
        <div className="hidden lg:grid grid-cols-12 gap-4 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <div className="col-span-3">PATIENT</div>
          <div className="col-span-2">CONTACT INFO</div>
          <div className="col-span-3">DETAILS</div>
          <div className="col-span-2">LAST CONTACT</div>
          <div className="col-span-2">ADDED BY</div>
        </div>

        {/* Patients Row Cards List */}
        {patients.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center text-slate-500">
            <p className="text-sm font-semibold text-slate-700">No patients found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search query or add a new patient to get started.
            </p>
            <button
              onClick={() => onNavigate('new-patient')}
              className="mt-4 px-4 py-2 bg-teal-800 text-white rounded-lg text-xs font-semibold hover:bg-teal-900 transition cursor-pointer"
            >
              + Add Patient
            </button>
          </div>
        ) : (
          patients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-teal-600/40 transition-all p-4"
              data-purpose="patient-row-card"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-center">
                {/* Patient Name, Avatar & Identifiers */}
                <div className="lg:col-span-3 flex items-center gap-3">
                  {/* Avatar with Initial */}
                  <div
                    className={`w-10 h-10 rounded-full ${getAvatarColor(
                      patient.name
                    )} text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0`}
                  >
                    {patient.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Patient Identifiers */}
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 leading-tight truncate">
                      {patient.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                      <span className="text-slate-500 font-medium">{patient.patientCode}</span>
                      <span className="inline-flex items-center gap-0.5 text-slate-400">
                        <QrCode className="w-3.5 h-3.5 text-slate-400 inline stroke-[2]" />
                        <span>{patient.barcode}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="lg:col-span-2">
                  <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <Phone className="w-3.5 h-3.5 text-slate-400 stroke-[2] shrink-0" />
                    <span>{patient.phone}</span>
                  </div>
                </div>

                {/* Details & Demographic Pills */}
                <div className="lg:col-span-3 space-y-1.5">
                  {/* Location */}
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 stroke-[2]" />
                    <span className="truncate">{patient.address || 'Tanta Street'}</span>
                  </div>

                  {/* Demographic Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-full border border-slate-200">
                      {patient.ageYears} Years, {patient.ageMonths} Months, {patient.ageDays} Days
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                      {patient.gender}
                    </span>
                  </div>
                </div>

                {/* Last Contact Date & Time */}
                <div className="lg:col-span-2 flex lg:flex-col justify-between items-center lg:items-start text-xs">
                  <span className="text-slate-400 lg:hidden text-[11px]">Last Contact:</span>
                  <div>
                    <div className="font-semibold text-slate-800">
                      {patient.lastContactDate}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {patient.lastContactTime}
                    </div>
                  </div>
                </div>

                {/* Added By & Action Buttons */}
                <div className="lg:col-span-2 flex items-center justify-between border-t lg:border-t-0 pt-2 lg:pt-0 mt-1 lg:mt-0 border-slate-100 relative">
                  {/* Added By User Details */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center">
                      {patient.addedByInitials || 'DD'}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block leading-tight">
                        Added by
                      </span>
                      <span className="text-xs font-semibold text-slate-800 leading-tight">
                        {patient.addedBy || 'dr demo'}
                      </span>
                    </div>
                  </div>

                  {/* Row Quick Actions */}
                  <div className="flex items-center gap-1">
                    {/* Schedule / Calendar Button */}
                    <button
                      onClick={() => onSelectPatientForAppointment(patient)}
                      title="Schedule Appointment"
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition cursor-pointer"
                      type="button"
                    >
                      <Calendar className="w-3.5 h-3.5 stroke-[2]" />
                    </button>

                    {/* More Options Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenActionMenuId(openActionMenuId === patient.id ? null : patient.id)
                        }
                        title="More Actions"
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition cursor-pointer"
                        type="button"
                      >
                        <MoreVertical className="w-3.5 h-3.5 stroke-[2]" />
                      </button>

                      {openActionMenuId === patient.id && (
                        <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-xs">
                          <button
                            onClick={() => {
                              setOpenActionMenuId(null);
                              onSelectPatientForAppointment(patient);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                          >
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>Book Visit</span>
                          </button>
                          <button
                            onClick={() => {
                              setOpenActionMenuId(null);
                              onDeletePatient(patient.id);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2 border-t border-slate-100 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Bottom Pagination Tracker */}
        <div className="text-center pt-8 text-xs text-slate-400 font-medium">
          Showing 1–{patients.length} of {patients.length} • 20 per page • Page 1/1
        </div>
      </div>
    </main>
  );
};
