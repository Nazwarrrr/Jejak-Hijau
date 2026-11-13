import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Leaf,
  LogOut,
  User,
  Trophy,
  Target,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react';
import useAuth from '../../contexts/AuthContext';
import useProfile from '../../hooks/useProfile';
import { cn } from '../../lib/utils';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tantangan', path: '/challenges', icon: Target },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Profil', path: '/profile', icon: User },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      setMobileMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Gagal keluar akun:', error);
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'User';

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
        {/* Left: Logo */}
        <Link
          to={user ? '/dashboard' : '/login'}
          className="flex items-center gap-2.5"
          aria-label="JejakHijau Beranda"
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
            <Leaf size={22} strokeWidth={2.5} />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Jejak<span className="text-emerald-700">Hijau</span>
          </span>
        </Link>

        {/* Center: Navigation Links (Desktop) */}
        {user && (
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition',
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  )}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Right Section */}
        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-semibold text-slate-700 sm:inline-block">
              Hai, <span className="font-extrabold text-slate-900">{displayName}</span>
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-rose-600"
              title="Keluar akun"
              aria-label="Keluar akun"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 md:hidden"
              aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800"
            >
              Daftar
            </Link>
          </div>
        )}
      </nav>

      {/* Mobile Menu Dropdown */}
      {user && mobileMenuOpen && (
        <div className="animate-slide-down border-b border-slate-200/80 bg-white/95 px-5 py-4 shadow-lg backdrop-blur-xl md:hidden">
          <div className="mb-3 border-b border-slate-100 pb-2">
            <p className="text-xs font-semibold text-slate-400">Masuk sebagai</p>
            <p className="text-sm font-bold text-slate-800">{displayName}</p>
          </div>
          <div className="flex flex-col gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition',
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
