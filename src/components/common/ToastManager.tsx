import React, { useState, useEffect, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  autoDismiss: boolean;
  duration?: number;
}

/**
 * Toast container for displaying notifications
 */
const ToastManager: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Add a new toast
  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    
    // Automatically dismiss after duration
    if (toast.autoDismiss && toast.duration) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }
  }, []);

  // Remove a toast by id
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Register the toast manager as a global service
  useEffect(() => {
    // Expose methods to window for global access
    (window as any).toastManager = {
      success: (message: string, autoDismiss = true, duration = 3000) => {
        addToast({ message, type: 'success', autoDismiss, duration });
      },
      error: (message: string, autoDismiss = true, duration = 5000) => {
        addToast({ message, type: 'error', autoDismiss, duration });
      },
      info: (message: string, autoDismiss = true, duration = 3000) => {
        addToast({ message, type: 'info', autoDismiss, duration });
      },
      warning: (message: string, autoDismiss = true, duration = 4000) => {
        addToast({ message, type: 'warning', autoDismiss, duration });
      }
    };
    
    return () => {
      delete (window as any).toastManager;
    };
  }, [addToast]);

  // Toast is empty, don't render anything
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div 
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md" 
      role="log" 
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg shadow-lg p-4 flex items-start justify-between
            animate-fade-in-down transition-all duration-300 ease-in-out
            ${getToastStyles(toast.type)}`}
          role="alert"
        >
          <div className="flex items-start">
            <span className="mr-2 mt-0.5">
              {getToastIcon(toast.type)}
            </span>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 text-gray-600 hover:text-gray-800"
            aria-label="Dismiss"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

function getToastStyles(type: ToastType): string {
  switch (type) {
    case 'success':
      return 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500';
    case 'error':
      return 'bg-red-50 text-red-800 border-l-4 border-red-500';
    case 'warning':
      return 'bg-amber-50 text-amber-800 border-l-4 border-amber-500';
    case 'info':
    default:
      return 'bg-blue-50 text-blue-800 border-l-4 border-blue-500';
  }
}

function getToastIcon(type: ToastType) {
  switch (type) {
    case 'success':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    case 'error':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    case 'warning':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    case 'info':
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
  }
}

export default ToastManager;