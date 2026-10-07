import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  FilePlus2,
  Check,
  RotateCw,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Patient } from '../../types';

interface AddPatientViewProps {
  onCancel: () => void;
  onSavePatient: (patientData: Partial<Patient>) => Promise<void>;
  existingPatientsCount: number;
}

export const AddPatientView: React.FC<AddPatientViewProps> = ({
  onCancel,
  onSavePatient,
  existingPatientsCount,
}) => {
  // Auto-generate patient code based on count
  const initialPatientCode = `PAT-${String(existingPatientsCount + 1).padStart(5, '0')}`;
  const [patientCode, setPatientCode] = useState(initialPatientCode);
  const [barcode, setBarcode] = useState(
    () => String(7049306457022 + Math.floor(Math.random() * 500))
  );

  // Form fields
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Female' | 'Male' | ''>('');
  const [dob, setDob] = useState('');
  const [ageYears, setAgeYears] = useState<number | ''>('');
  const [ageMonths, setAgeMonths] = useState<number | ''>('');
  const [ageDays, setAgeDays] = useState<number | ''>('');

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [assignedDoctor, setAssignedDoctor] = useState('Dr. Demo');
  const [country, setCountry] = useState('Egypt');
  const [address, setAddress] = useState('Tanta Street');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculate age from DOB
  const handleDobChange = (val: string) => {
    setDob(val);
    if (!val) {
      setAgeYears('');
      setAgeMonths('');
      setAgeDays('');
      return;
    }
    const birth = new Date(val);
    if (isNaN(birth.getTime())) return;

    // Use simulated reference date 2026-10-07
    const refDate = new Date('2026-10-07');
    let years = refDate.getFullYear() - birth.getFullYear();
    let months = refDate.getMonth() - birth.getMonth();
    let days = refDate.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      days += 30;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    if (years >= 0) {
      setAgeYears(years);
      setAgeMonths(Math.max(0, months));
      setAgeDays(Math.max(0, days));
    }
  };

  // Regenerate barcode
  const handleRegenerateBarcode = () => {
    const newCode = Math.floor(7000000000000 + Math.random() * 900000000000);
    setBarcode(String(newCode));
  };

  // Calculate required progress
  const requiredCount = [
    Boolean(name.trim()),
    Boolean(gender),
    Boolean(dob),
    Boolean(phone.trim()),
  ].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter the patient name.');
      return;
    }
    if (!gender) {
      setErrorMessage('Please select patient gender.');
      return;
    }
    if (!dob) {
      setErrorMessage('Please provide patient date of birth.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please provide a valid phone number.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSavePatient({
        patientCode,
        barcode,
        name: name.trim(),
        gender,
        dob,
        ageYears: Number(ageYears) || 0,
        ageMonths: Number(ageMonths) || 0,
        ageDays: Number(ageDays) || 0,
        phone: phone.trim(),
        email: email.trim() || undefined,
        nationalId: nationalId.trim() || undefined,
        assignedDoctor,
        country,
        address: address.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save patient. Please check your connection.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50/60 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Add New Patient</h1>
            <p className="text-xs text-slate-500 mt-1">
              Register the patient, capture how to reach them, and add clinical background if it is
              already known.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-end sm:self-auto">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-teal-800 text-white hover:bg-teal-900 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              type="button"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isSubmitting ? 'Saving...' : 'Save patient'}</span>
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* FormSectionsNavCard (Left, hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-xs p-4 sticky top-6">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
              Sections
            </h2>
            <div className="space-y-2 text-xs font-medium">
              {/* Item 1 */}
              <a
                href="#patient-info-section"
                className="flex items-center justify-between p-2.5 rounded-lg text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Patient Information</span>
                </div>
                <Check
                  className={`w-3.5 h-3.5 ${
                    name && gender && dob ? 'text-teal-600' : 'text-slate-300'
                  }`}
                />
              </a>

              {/* Item 2 */}
              <a
                href="#contact-info-section"
                className="flex items-center justify-between p-2.5 rounded-lg text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>Contact Information</span>
                </div>
                <Check
                  className={`w-3.5 h-3.5 ${phone ? 'text-teal-600' : 'text-slate-300'}`}
                />
              </a>

              {/* Item 3 */}
              <a
                href="#additional-info-section"
                className="flex items-center justify-between p-2.5 rounded-lg text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <FilePlus2 className="w-4 h-4 text-slate-400" />
                  <span>Additional Information</span>
                </div>
                <Check className="w-3.5 h-3.5 text-slate-300" />
              </a>
            </div>

            {/* Required Indicator Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs px-1">
              <span className="font-bold text-[11px] tracking-wider uppercase text-slate-500">
                Required
              </span>
              <span className="font-semibold text-slate-700">{requiredCount} of 4</span>
            </div>
          </div>

          {/* FormCardContainer (Right, full width on mobile) */}
          <form className="w-full lg:col-span-9 space-y-6" id="new-patient-form" onSubmit={handleSubmit}>
            {/* SECTION 1: Patient Information Card */}
            <div
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5"
              id="patient-info-section"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold tracking-wider uppercase text-slate-800">
                  Patient Information
                </h3>
                <span className="text-xs text-slate-400 mt-1 sm:mt-0">
                  Name, gender and date of birth required
                </span>
              </div>

              {/* Field: Name */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700" htmlFor="patient-name">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="patient-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Patient Name"
                  className="w-full text-xs rounded-lg border border-slate-200 focus:border-teal-600 focus:ring-teal-600 shadow-xs placeholder:text-slate-400 py-2.5 px-3 outline-none"
                  required
                />
                <p className="text-[11px] text-slate-400">As written on the national ID</p>
              </div>

              {/* Two Column: Gender & Date of Birth */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gender */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('Female')}
                      className={`py-2.5 px-4 text-xs font-medium border rounded-lg text-center transition-colors ${
                        gender === 'Female'
                          ? 'border-teal-600 bg-teal-50 text-teal-800 font-semibold ring-1 ring-teal-600'
                          : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                      }`}
                    >
                      Female
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('Male')}
                      className={`py-2.5 px-4 text-xs font-medium border rounded-lg text-center transition-colors ${
                        gender === 'Male'
                          ? 'border-teal-600 bg-teal-50 text-teal-800 font-semibold ring-1 ring-teal-600'
                          : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                      }`}
                    >
                      Male
                    </button>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700" htmlFor="dob">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="dob"
                      type="date"
                      value={dob}
                      onChange={(e) => handleDobChange(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-200 shadow-xs pr-10 py-2.5 px-3 outline-none"
                      required
                    />
                    <span className="absolute right-3 pointer-events-none text-slate-400">
                      <Calendar className="w-4 h-4 stroke-[2]" />
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Day / Month / Year</p>
                </div>
              </div>

              {/* Field: Age (Years, Months, Days) */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">Age</label>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    value={ageYears}
                    onChange={(e) => setAgeYears(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Years"
                    className="w-full text-xs rounded-lg border border-slate-200 shadow-xs py-2.5 px-3 placeholder:text-slate-400 outline-none"
                  />
                  <input
                    type="number"
                    value={ageMonths}
                    onChange={(e) => setAgeMonths(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Months"
                    className="w-full text-xs rounded-lg border border-slate-200 shadow-xs py-2.5 px-3 placeholder:text-slate-400 outline-none"
                  />
                  <input
                    type="number"
                    value={ageDays}
                    onChange={(e) => setAgeDays(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Days"
                    className="w-full text-xs rounded-lg border border-slate-200 shadow-xs py-2.5 px-3 placeholder:text-slate-400 outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Calculated from date of birth</p>
              </div>
            </div>

            {/* SECTION 2: Contact Information Card */}
            <div
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5"
              id="contact-info-section"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold tracking-wider uppercase text-slate-800">
                  Contact Information
                </h3>
                <span className="text-xs text-slate-400 mt-1 sm:mt-0">
                  Phone is used for appointment reminders
                </span>
              </div>

              {/* Two Column: Phone & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700" htmlFor="phone">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone"
                    className="w-full text-xs rounded-lg border border-slate-200 focus:border-teal-600 focus:ring-teal-600 shadow-xs placeholder:text-slate-400 py-2.5 px-3 outline-none"
                    required
                  />
                  <p className="text-[11px] text-slate-400">Include the country code</p>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs rounded-lg border border-slate-200 focus:border-teal-600 focus:ring-teal-600 shadow-xs placeholder:text-slate-400 py-2.5 px-3 outline-none"
                  />
                </div>
              </div>

              {/* Two Column: National ID & Assigned Doctor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* National ID */}
                <div className="space-y-1">
                  <label
                    className="block text-xs font-medium text-slate-700"
                    htmlFor="national-id"
                  >
                    National ID
                  </label>
                  <input
                    id="national-id"
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="National ID"
                    className="w-full text-xs rounded-lg border border-slate-200 focus:border-teal-600 focus:ring-teal-600 shadow-xs placeholder:text-slate-400 py-2.5 px-3 outline-none"
                  />
                  <p className="text-[11px] text-slate-400">Egyptian national ID, 14 digits</p>
                </div>

                {/* Assigned Doctor */}
                <div className="space-y-1">
                  <label
                    className="block text-xs font-medium text-slate-700"
                    htmlFor="assigned-doctor"
                  >
                    Assigned doctor
                  </label>
                  <div className="relative">
                    <select
                      id="assigned-doctor"
                      value={assignedDoctor}
                      onChange={(e) => setAssignedDoctor(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-200 focus:border-teal-600 focus:ring-teal-600 shadow-xs py-2.5 px-3 text-slate-700 bg-white cursor-pointer outline-none"
                    >
                      <option value="Dr. Demo">Dr. Demo</option>
                      <option value="Dr. Ahmed Ali">Dr. Ahmed Ali</option>
                      <option value="Dr. Sarah Ibrahim">Dr. Sarah Ibrahim</option>
                    </select>
                  </div>
                  <p className="text-[11px] text-slate-400">Responsible for this patient</p>
                </div>
              </div>

              {/* Single Field: Country & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700" htmlFor="country">
                    Country
                  </label>
                  <div className="relative">
                    <select
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-200 focus:border-teal-600 focus:ring-teal-600 shadow-xs py-2.5 px-3 text-slate-700 bg-white cursor-pointer outline-none"
                    >
                      <option value="Egypt">Egypt</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Jordan">Jordan</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700" htmlFor="address">
                    Street Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Tanta Street"
                    className="w-full text-xs rounded-lg border border-slate-200 focus:border-teal-600 focus:ring-teal-600 shadow-xs py-2.5 px-3 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Additional Information Card */}
            <div
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4"
              id="additional-info-section"
            >
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold tracking-wider uppercase text-slate-800">
                  Additional Information
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Clinical background, chronic diseases, or known drug allergies
                </p>
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter clinical notes, known allergies, prior surgeries..."
                rows={3}
                className="w-full text-xs rounded-lg border border-slate-200 focus:border-teal-600 focus:ring-teal-600 p-3 outline-none placeholder:text-slate-400"
              />
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};
