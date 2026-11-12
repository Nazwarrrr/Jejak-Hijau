import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { generateId } from '../lib/utils';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = generateId();
    const newToast = { id, message, type };

    setToasts((prev) => {
      // Keep maximum 5 toasts (remove oldest if exceeds 5)
      const current = prev.length >= 5 ? prev.slice(prev.length - 4) : prev;
      return [...current, newToast];
    });

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);

    return id;
  }, [removeToast]);

  const value = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);

  const getToastStyle = (type) => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-rose-600 text-white',
          icon: <XCircle className="w-5 h-5 shrink-0 text-white" />,
        };
      case 'info':
        return {
          bg: 'bg-sky-600 text-white',
          icon: <Info className="w-5 h-5 shrink-0 text-white" />,
        };
      case 'success':
      default:
        return {
          bg: 'bg-emerald-600 text-white',
          icon: <CheckCircle className="w-5 h-5 shrink-0 text-white" />,
        };
    }
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Notification Container */}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const config = getToastStyle(toast.type);
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl shadow-black/10 backdrop-blur-md transition-all duration-300 ease-out animate-[fade-in-up_0.2s_ease-out] ${config.bg}`}
              style={{
                animation: 'toastSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                {config.icon}
                <span className="text-sm font-medium leading-snug break-words">
                  {toast.message}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Tutup notifikasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast harus digunakan di dalam ToastProvider');
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export default useToast;
