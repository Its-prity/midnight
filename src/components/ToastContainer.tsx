import React from 'react';
import { ToastNotification } from '../types';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item toast-${toast.type}`}>
          <span className="toast-icon">
            {toast.type === 'success' && '✨'}
            {toast.type === 'error' && '⚠️'}
            {toast.type === 'info' && 'ℹ️'}
          </span>
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-close"
            onClick={() => onClose(toast.id)}
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
