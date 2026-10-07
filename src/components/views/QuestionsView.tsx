import React, { useState } from 'react';
import { HelpCircle, Plus, CheckSquare } from 'lucide-react';

export const QuestionsView: React.FC = () => {
  const [questions, setQuestions] = useState([
    {
      id: 'q-1',
      question: 'Do you currently have a toothache or sensitivity to cold/hot food?',
      category: 'Dental Intake',
      type: 'Yes/No',
      required: true,
    },
    {
      id: 'q-2',
      question: 'Do you have any known medical allergies to Penicillin or local anesthetics?',
      category: 'Medical History',
      type: 'Yes/No + Details',
      required: true,
    },
    {
      id: 'q-3',
      question: 'Are you currently taking any blood-thinning medications (e.g. Aspirin, Warfarin)?',
      category: 'Surgical Safety',
      type: 'Yes/No',
      required: true,
    },
    {
      id: 'q-4',
      question: 'Have you had high blood pressure, diabetes, or cardiovascular issues?',
      category: 'General Clinical',
      type: 'Multiple Choice',
      required: false,
    },
  ]);

  return (
    <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clinical Intake Questionnaires</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Standard medical history questions completed during patient registration
          </p>
        </div>

        <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 shadow-xs transition">
          <Plus className="w-3.5 h-3.5" />
          <span>New Question</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
        {questions.map((q) => (
          <div key={q.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{q.question}</h4>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                  <span className="text-teal-700 font-medium">{q.category}</span>
                  <span>•</span>
                  <span>Format: {q.type}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {q.required && (
                <span className="text-[10px] bg-red-50 text-red-700 font-semibold px-2 py-0.5 rounded">
                  Required
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};
