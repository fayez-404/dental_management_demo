import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { Patient } from '../../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportPatients: (patients: Partial<Patient>[]) => Promise<void>;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImportPatients,
}) => {
  const [importing, setImporting] = useState(false);
  const [importedCount, setImportedCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSampleImport = async () => {
    setImporting(true);
    // Sample patients
    const samples: Partial<Patient>[] = [
      {
        name: 'Mariam Hassan',
        gender: 'Female',
        dob: '1998-05-14',
        phone: '01098765432',
        email: 'mariam.h@example.com',
        nationalId: '29805140123456',
        country: 'Egypt',
        address: 'Alexandria Corniche',
        ageYears: 28,
        ageMonths: 4,
        ageDays: 23,
      },
      {
        name: 'Omar Khaled',
        gender: 'Male',
        dob: '2005-08-20',
        phone: '01123456789',
        email: 'omar.k@example.com',
        nationalId: '30508200123456',
        country: 'Egypt',
        address: 'Giza Dokki',
        ageYears: 21,
        ageMonths: 1,
        ageDays: 17,
      },
    ];

    try {
      await onImportPatients(samples);
      setImportedCount(samples.length);
      setTimeout(() => {
        setImporting(false);
        setImportedCount(null);
        onClose();
      }, 1000);
    } catch {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Import Patients</h3>
              <p className="text-[11px] text-slate-400">CSV or JSON file format</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {importedCount !== null ? (
          <div className="text-center py-6 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-xs font-bold text-slate-900">
              Successfully imported {importedCount} patients!
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-teal-500 cursor-pointer transition">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">Drag & drop CSV or Excel file here</p>
              <p className="text-[11px] text-slate-400 mt-1">Columns: Name, Gender, DOB, Phone, National ID</p>
            </div>

            <button
              onClick={handleSampleImport}
              disabled={importing}
              className="w-full py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg font-semibold shadow-xs transition"
            >
              {importing ? 'Importing sample records...' : 'Import Sample Records (2 Patients)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
