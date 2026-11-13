import { useState } from 'react';
import useAuth from '../contexts/AuthContext';
import useCarbonLogs from '../hooks/useCarbonLogs';
import useProfile from '../hooks/useProfile';
import { getGreeting, formatDate } from '../lib/utils';
import { Sparkles, Share2, CalendarDays } from 'lucide-react';
import StatsCards from '../components/dashboard/StatsCards';
import CarbonCalculator from '../components/dashboard/CarbonCalculator';
import WeeklyChart from '../components/dashboard/WeeklyChart';
import RecentLogs from '../components/dashboard/RecentLogs';
import DailyProgress from '../components/dashboard/DailyProgress';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import GreenCardModal from '../components/dashboard/GreenCardModal';

export default function DashboardPage() {
  const { user } = useAuth();
  const { profile, dailyLimit, updateDailyLimit, loading: profileLoading } = useProfile();
  const {
    logs,
    todayTotal,
    weekTotal,
    chartData,
    addLog,
    deleteLog,
    loading: logsLoading,
    loadError: logsError,
  } = useCarbonLogs();

  const [showGreenCard, setShowGreenCard] = useState(false);
  const isLoading = logsLoading || profileLoading;
  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Pengguna';
  const streak = profile?.streak_days || 1;
  const totalSaved = profile?.points || (profile?.total_trees ? profile.total_trees * 20 : Math.max(0, (dailyLimit - todayTotal) * 3));

  return (
    <div className="page-enter mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      {/* Hero / Greeting Section */}
      <section className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-white/80 px-3 py-1 text-xs font-bold text-emerald-800 shadow-sm backdrop-blur-md">
            <Sparkles size={13} className="text-emerald-600" />
            <span>LANGKAH KECIL, DAMPAK BESAR</span>
          </div>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            {getGreeting()}, {displayName}
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-600">
            Kenali jejak karbonmu hari ini dan buat perubahan positif.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowGreenCard(true)}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 transition"
          >
            <Share2 size={15} />
            <span>Rapor Hijau</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-white/70 bg-white/65 px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm backdrop-blur-xl">
            <CalendarDays size={15} aria-hidden="true" />
            <span>{formatDate(new Date())}</span>
          </div>
        </div>
      </section>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <LoadingSkeleton variant="card" height={420} className="rounded-3xl" />
            <div className="flex flex-col gap-6">
              <LoadingSkeleton variant="card" height={150} className="rounded-3xl" />
              <div className="grid grid-cols-2 gap-3">
                <LoadingSkeleton variant="card" height={120} className="rounded-2xl" />
                <LoadingSkeleton variant="card" height={120} className="rounded-2xl" />
                <LoadingSkeleton variant="card" height={120} className="rounded-2xl" />
                <LoadingSkeleton variant="card" height={120} className="rounded-2xl" />
              </div>
              <LoadingSkeleton variant="chart" height={220} className="rounded-3xl" />
            </div>
          </div>
          <LoadingSkeleton variant="card" height={260} className="rounded-3xl" />
        </div>
      ) : (
        <div className="space-y-8">
          {logsError && (
            <div
              role="alert"
              className="rounded-2xl border border-rose-200 bg-rose-50/90 px-5 py-4 text-sm font-semibold text-rose-700"
            >
              {logsError}
            </div>
          )}

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            {/* Left Column: Carbon Calculator */}
            <div className="flex">
              <CarbonCalculator onAddLog={addLog} />
            </div>

            {/* Right Column: Daily Progress + Stats + Weekly Chart */}
            <div className="flex flex-col gap-6">
              <DailyProgress
                todayTotal={todayTotal}
                dailyLimit={dailyLimit}
                onLimitChange={updateDailyLimit}
              />

              <StatsCards
                todayTotal={todayTotal}
                weekTotal={weekTotal}
                totalSaved={totalSaved}
                streak={streak}
              />

              <WeeklyChart chartData={chartData} />
            </div>
          </div>

          {/* Full-width Recent Logs */}
          <section>
            <RecentLogs
              logs={logs}
              onDelete={deleteLog}
              totalCount={logs.length}
            />
          </section>
        </div>
      )}

      {/* Green Card Shareable Modal */}
      <GreenCardModal
        isOpen={showGreenCard}
        onClose={() => setShowGreenCard(false)}
        userName={displayName}
        totalSaved={totalSaved}
        streakDays={streak}
        totalLogs={logs.length}
      />
    </div>
  );
}
