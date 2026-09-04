import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="confirm-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
    >
      <div
        id="confirm-modal-content"
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/90 space-y-4"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Please confirm this action</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-md transition-colors cursor-pointer ${
              confirmVariant === 'danger'
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/60'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/60'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
