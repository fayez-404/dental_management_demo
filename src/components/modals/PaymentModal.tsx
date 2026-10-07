import React, { useState } from 'react';
import { X, CreditCard, Banknote, ShieldCheck } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitFee: number;
  onConfirm: (amount: number, method: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  visitFee,
  onConfirm,
}) => {
  const [amount, setAmount] = useState<number>(visitFee || 150);
  const [method, setMethod] = useState<'Cash' | 'Card' | 'Insurance'>('Cash');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(amount, method);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Record Visit Payment</h3>
              <p className="text-[11px] text-slate-400">Main Branch Billing Desk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-medium mb-1">Payment Amount (EGP)</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="0"
                step="5"
                className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 font-semibold focus:border-teal-600 focus:ring-teal-600 outline-none"
                required
              />
              <span className="absolute right-3 top-2.5 text-slate-400 font-bold">EGP</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('Cash')}
                className={`py-2 px-3 border rounded-lg flex items-center justify-center gap-1.5 font-medium transition ${
                  method === 'Cash'
                    ? 'border-teal-600 bg-teal-50 text-teal-800 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>Cash</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('Card')}
                className={`py-2 px-3 border rounded-lg flex items-center justify-center gap-1.5 font-medium transition ${
                  method === 'Card'
                    ? 'border-teal-600 bg-teal-50 text-teal-800 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Card</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('Insurance')}
                className={`py-2 px-3 border rounded-lg flex items-center justify-center gap-1.5 font-medium transition ${
                  method === 'Insurance'
                    ? 'border-teal-600 bg-teal-50 text-teal-800 font-semibold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Insurance</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg font-semibold shadow-xs"
            >
              Confirm Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
