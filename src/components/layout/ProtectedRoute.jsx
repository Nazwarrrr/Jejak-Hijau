import { Navigate, useLocation } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import useAuth from '../../contexts/AuthContext';
import LoadingSkeleton from '../ui/LoadingSkeleton';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-emerald-50 to-teal-100 p-4">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 animate-ping rounded-2xl bg-emerald-400/40" />
            <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/30">
              <Leaf size={32} strokeWidth={2.5} className="animate-pulse" />
            </div>
          </div>
          <p className="text-base font-bold text-slate-800">Memuat...</p>
          <p className="mt-1 text-xs text-slate-500">Menyiapkan JejakHijau untukmu</p>
          <div className="mt-6 w-48">
            <LoadingSkeleton variant="text" height={6} className="rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
