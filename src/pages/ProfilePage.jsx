import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../contexts/AuthContext';
import useProfile from '../hooks/useProfile';
import useCarbonLogs from '../hooks/useCarbonLogs';
import useToast from '../contexts/ToastContext';
import { formatAmount, getTreeLevel, formatDate } from '../lib/utils';
import { ACHIEVEMENTS } from '../lib/constants';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import {
  Mail,
  Leaf,
  TreePine,
  Target,
  Calendar,
  Edit3,
  Save,
  X,
  LogOut,
  Flame,
  Sprout,
  ShieldCheck,
  BarChart3,
  Heart,
  Trees,
  Trophy,
  Check,
  Lock,
  Share2,
} from 'lucide-react';
import GreenCardModal from '../components/dashboard/GreenCardModal';

const ACHIEVEMENT_ICONS = {
  Sprout,
  Flame,
  ShieldCheck,
  TreePine,
  BarChart3,
  Heart,
  Trees,
  Trophy,
};

export default function ProfilePage() {
  const { user, signOut, updateProfile } = useAuth();
  const { profile, dailyLimit, updateDailyLimit } = useProfile();
  const { logs } = useCarbonLogs();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile?.full_name || '');
  const [limitInput, setLimitInput] = useState(dailyLimit);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isSavingLimit, setIsSavingLimit] = useState(false);

  const [showGreenCard, setShowGreenCard] = useState(false);
  const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Pengguna';
  const email = user?.email || 'pengguna@jejakhijau.id';
  const memberSince = profile?.created_at || user?.created_at || new Date().toISOString();

  // Avatar initials
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'JH';

  // Stats
  const totalEmissions = logs.reduce((sum, log) => sum + (Number(log.emissions) || 0), 0);
  const totalLogs = logs.length;
  const streak = profile?.streak_days || 1;
  const totalSaved = profile?.points || (profile?.total_trees ? profile.total_trees * 20 : Math.max(0, 30));
  const treeInfo = getTreeLevel(totalSaved);

  const handleSaveName = async () => {
    if (!nameInput.trim()) {
      addToast('Nama tidak boleh kosong.', 'error');
      return;
    }
    setIsSavingName(true);
    try {
      const { error } = await updateProfile({ full_name: nameInput.trim() });
      if (error) {
        addToast('Gagal memperbarui nama profil.', 'error');
      } else {
        addToast('Nama profil berhasil diperbarui.', 'success');
        setIsEditingName(false);
      }
    } catch {
      addToast('Terjadi kesalahan saat menyimpan nama.', 'error');
    } finally {
      setIsSavingName(false);
    }
  };

  const handleSaveLimit = async () => {
    const num = parseFloat(limitInput);
    if (isNaN(num) || num <= 0) {
      addToast('Batas harian harus berupa angka lebih dari 0.', 'error');
      return;
    }
    setIsSavingLimit(true);
    try {
      const { error } = await updateDailyLimit(num);
      if (error) {
        addToast('Gagal memperbarui batas harian.', 'error');
      } else {
        addToast(`Batas harian berhasil diatur ke ${formatAmount(num)} kg CO₂`, 'success');
      }
    } catch {
      addToast('Terjadi kesalahan saat menyimpan batas.', 'error');
    } finally {
      setIsSavingLimit(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      addToast('Kamu berhasil keluar. Sampai jumpa lagi.', 'info');
      navigate('/login');
    } catch (err) {
      addToast('Gagal keluar akun: ' + (err?.message || ''), 'error');
    }
  };

  const isEarned = (ach) => {
    switch (ach.type) {
      case 'total_logs':
        return totalLogs >= ach.threshold;
      case 'streak':
        return streak >= ach.threshold;
      case 'under_limit_streak':
        return streak >= ach.threshold;
      case 'trees':
        return (profile?.total_trees || (treeInfo.level > 1 ? 1 : 0)) >= ach.threshold;
      case 'low_day':
        return logs.some((l) => Number(l.emissions) < 1.0) || totalLogs > 0;
      default:
        return false;
    }
  };

  return (
    <div className="page-enter mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Profile Header Card */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          {/* Large Avatar */}
          <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-3xl font-black text-white shadow-xl shadow-emerald-600/30">
            {initials}
            <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-white text-emerald-600 shadow-md">
              <Leaf size={16} />
            </span>
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            {isEditingName ? (
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="rounded-xl border border-emerald-400 bg-white px-3 py-1.5 text-lg font-bold text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/20"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="primary"
                  loading={isSavingName}
                  onClick={handleSaveName}
                  className="px-3 py-2"
                >
                  <Save size={15} /> Simpan
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setNameInput(fullName);
                    setIsEditingName(false);
                  }}
                  className="px-2 py-2"
                >
                  <X size={15} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                  {fullName}
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setNameInput(fullName);
                    setIsEditingName(true);
                  }}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-emerald-700 transition"
                  title="Ubah nama"
                >
                  <Edit3 size={17} />
                </button>
              </div>
            )}

            <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500 sm:justify-start">
              <span className="flex items-center gap-1.5">
                <Mail size={14} className="text-slate-400" />
                {email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-400" />
                Bergabung {formatDate(memberSince)}
              </span>
            </div>

            <div className="mt-4 flex justify-center sm:justify-start">
              <button
                type="button"
                onClick={() => setShowGreenCard(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 transition"
              >
                <Share2 size={14} />
                <span>Lihat &amp; Bagikan Rapor Hijau</span>
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Stats Overview */}
      <section>
        <h2 className="mb-4 text-lg font-extrabold text-slate-900">Ringkasan Statistik</h2>
        <div className="stagger-children grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {/* Total Emisi */}
          <Card className="p-4 sm:p-5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
              <Leaf size={18} />
            </span>
            <p className="mt-4 text-xs font-semibold text-slate-500">Total Emisi Dicatat</p>
            <p className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              {formatAmount(totalEmissions)}{' '}
              <span className="text-xs font-semibold text-slate-400">kg</span>
            </p>
          </Card>

          {/* Total Aktivitas */}
          <Card className="p-4 sm:p-5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-100 text-teal-700">
              <Target size={18} />
            </span>
            <p className="mt-4 text-xs font-semibold text-slate-500">Total Aktivitas</p>
            <p className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              {totalLogs}{' '}
              <span className="text-xs font-semibold text-slate-400">log</span>
            </p>
          </Card>

          {/* Pohon Virtual */}
          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-green-100 text-green-700">
                <TreePine size={18} />
              </span>
              <TreePine size={20} className="text-emerald-700" aria-hidden="true" />
            </div>
            <p className="mt-4 text-xs font-semibold text-slate-500">Pohon Virtual</p>
            <p className="mt-1 truncate text-lg sm:text-xl font-black tracking-tight text-slate-900">
              {treeInfo.name}
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${treeInfo.progress}%` }}
              />
            </div>
          </Card>

          {/* Streak */}
          <Card className="p-4 sm:p-5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-700">
              <Flame size={18} />
            </span>
            <p className="mt-4 text-xs font-semibold text-slate-500">Streak Harian</p>
            <p className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              {streak}{' '}
              <span className="text-xs font-semibold text-slate-400">hari</span>
            </p>
          </Card>
        </div>
      </section>

      {/* 3. Achievements Section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Lencana & Penghargaan</h2>
            <p className="text-xs text-slate-500">Buka lencana dengan konsisten mencatat dan hemat emisi</p>
          </div>
          <Badge variant="success">
            {ACHIEVEMENTS.filter(isEarned).length} / {ACHIEVEMENTS.length} Terbuka
          </Badge>
        </div>

        <div className="stagger-children grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {ACHIEVEMENTS.map((ach) => {
            const earned = isEarned(ach);
            const AchievementIcon = ACHIEVEMENT_ICONS[ach.icon];
            return (
              <Card
                key={ach.id}
                className={`p-4 transition-all duration-200 ${
                  earned
                    ? 'border-emerald-200/90 bg-emerald-50/40'
                    : 'opacity-55 grayscale hover:grayscale-0'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                    <AchievementIcon size={22} aria-label={ach.title} />
                  </span>
                  {earned ? (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-600 text-white">
                      <Check size={14} />
                    </span>
                  ) : (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-200 text-slate-500">
                      <Lock size={12} />
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-sm font-black text-slate-900">{ach.title}</h3>
                <p className="mt-1 text-xs text-slate-500 leading-snug">{ach.description}</p>
                <span className="mt-2 inline-block text-[11px] font-bold text-emerald-800">
                  Target: {ach.threshold}
                </span>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 4. Settings Section */}
      <section>
        <h2 className="mb-4 text-lg font-extrabold text-slate-900">Pengaturan Akun</h2>
        <Card className="divide-y divide-slate-100 p-6">
          {/* Daily Limit Setting */}
          <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Target Batas Emisi Harian</h3>
              <p className="text-xs text-slate-500">
                Tentukan batas maksimal emisi karbon harianmu (kg CO₂).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
                className="w-20 rounded-xl border border-slate-300 bg-white px-3 py-2 text-right text-sm font-black text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
              />
              <span className="text-xs font-semibold text-slate-400">kg</span>
              <Button
                size="sm"
                variant="primary"
                loading={isSavingLimit}
                onClick={handleSaveLimit}
              >
                Simpan
              </Button>
            </div>
          </div>

          {/* Sign Out */}
          <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Keluar dari Akun</h3>
              <p className="text-xs text-slate-500">
                Akhiri sesi saat ini pada perangkat ini.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={handleSignOut}
              className="self-start sm:self-auto gap-1.5"
            >
              <LogOut size={16} /> Keluar
            </Button>
          </div>
        </Card>
      </section>

      {/* Green Card Shareable Modal */}
      <GreenCardModal
        isOpen={showGreenCard}
        onClose={() => setShowGreenCard(false)}
        userName={fullName}
        totalSaved={totalSaved}
        streakDays={streak}
        totalLogs={totalLogs}
      />
    </div>
  );
}
