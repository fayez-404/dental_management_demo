import React, { useState } from 'react';
import { X, Megaphone, CheckCircle2, PhoneCall, Bot, Stethoscope, Sparkles } from 'lucide-react';

interface AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssistantModal: React.FC<AssistantModalProps> = ({ isOpen, onClose }) => {
  const [calledState, setCalledState] = useState<'idle' | 'calling' | 'connected'>('idle');
  const [selectedTask, setSelectedTask] = useState<string>('');

  if (!isOpen) return null;

  const handleCall = (task: string) => {
    setSelectedTask(task);
    setCalledState('calling');
    setTimeout(() => {
      setCalledState('connected');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Clinical Desk Assistant</h3>
              <p className="text-[11px] text-slate-400">Nurse & Desk Communication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {calledState === 'connected' ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Assistant Notified!</h4>
            <p className="text-xs text-slate-500">
              Clinical Assistant Nour has received your signal:{' '}
              <span className="font-semibold text-slate-700">"{selectedTask}"</span>. Staff is
              en-route to the examination room.
            </p>
            <button
              onClick={() => {
                setCalledState('idle');
                onClose();
              }}
              className="mt-3 px-4 py-2 bg-teal-800 text-white rounded-lg text-xs font-semibold hover:bg-teal-900 transition"
            >
              Done
            </button>
          </div>
        ) : calledState === 'calling' ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center mx-auto animate-pulse">
              <PhoneCall className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-slate-700">Calling assistant Nour...</p>
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              Select a quick clinical prompt or page the head nurse to Room dental:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleCall('Page Nurse into Room')}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-teal-600 hover:bg-teal-50/50 transition font-medium flex items-center justify-between"
              >
                <span>🔔 Page Nurse into Room</span>
                <span className="text-[10px] text-slate-400">Urgent</span>
              </button>
              <button
                onClick={() => handleCall('Prepare Dental Sterile Tray')}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-teal-600 hover:bg-teal-50/50 transition font-medium flex items-center justify-between"
              >
                <span>🩺 Prepare Dental Sterile Tray</span>
                <span className="text-[10px] text-slate-400">Supplies</span>
              </button>
              <button
                onClick={() => handleCall('Call Next Patient in Queue')}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-teal-600 hover:bg-teal-50/50 transition font-medium flex items-center justify-between"
              >
                <span>📢 Call Next Waiting Patient</span>
                <span className="text-[10px] text-slate-400">Queue</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
