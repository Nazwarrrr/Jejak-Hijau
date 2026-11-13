import { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  Medal,
  Crown,
  Search,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import useAuth from '../contexts/AuthContext';
import { formatAmount } from '../lib/utils';

const MOCK_LEADERBOARD = [
  { id: 'mock-1', name: 'Dewi Lestari', emissions: 1.8, logsCount: 18, badge: 'Eco Master' },
  { id: 'mock-2', name: 'Rizky Pratama', emissions: 2.3, logsCount: 15, badge: 'Green Pioneer' },
  { id: 'mock-3', name: 'Siti Nurhaliza', emissions: 2.9, logsCount: 12, badge: 'Earth Guardian' },
  { id: 'mock-4', name: 'Budi Santoso', emissions: 3.5, logsCount: 14, badge: 'Energy Saver' },
  { id: 'mock-5', name: 'Anisa Rahmawati', emissions: 4.1, logsCount: 10, badge: 'Eco Warrior' },
  { id: 'mock-6', name: 'Fajar Hidayat', emissions: 4.8, logsCount: 11, badge: 'Tree Planter' },
  { id: 'mock-7', name: 'Maya Putri', emissions: 5.2, logsCount: 9, badge: 'Nature Friend' },
  { id: 'mock-8', name: 'Dimas Anggara', emissions: 5.9, logsCount: 8, badge: 'Conscious User' },
  { id: 'mock-9', name: 'Citra Kirana', emissions: 6.4, logsCount: 7, badge: 'Green Starter' },
];

export default function LeaderboardPage() {
  const { user, profile } = useAuth();
  const [timeframe, setTimeframe] = useState('minggu'); // 'minggu', 'bulan', 'semua'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadError, setLoadError] = useState('');

  const currentUserName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Kamu';

  useEffect(() => {
    let mounted = true;

    async function fetchLeaderboard() {
      setLoading(true);
      setLoadError('');
      try {
        if (isSupabaseConfigured && supabase) {
          const leaderboardView = {
            minggu: 'leaderboard_weekly',
            bulan: 'leaderboard_monthly',
            semua: 'leaderboard_all_time',
          }[timeframe];
          const { data, error } = await supabase
            .from(leaderboardView)
            .select('*')
            .order('total_emissions', { ascending: true })
            .limit(50);

          if (error) throw error;

          if (mounted && data) {
            const formatted = data.map((item) => ({
              id: item.user_id,
              name: item.full_name || 'Pejuang Hijau',
              emissions: Number(item.total_emissions || 0),
              logsCount: Number(item.total_logs || 0),
              badge: item.badge || 'Pejuang Hijau',
              isCurrentUser: user && item.user_id === user.id,
            }));
            setLeaderboardData(formatted);
            return;
          }
        } else if (mounted) {
          // Demo-only leaderboard when Supabase is not configured.
          const mockList = MOCK_LEADERBOARD.map((item) => ({ ...item }));
          const userAlreadyPresent = mockList.some((m) => m.name.toLowerCase() === currentUserName.toLowerCase());
          if (!userAlreadyPresent && user) {
            mockList.splice(3, 0, {
              id: user.id || 'curr-user',
              name: `${currentUserName} (Kamu)`,
              emissions: 3.2,
              logsCount: 11,
              badge: 'Pejuang Aktif',
              isCurrentUser: true,
            });
          }
          setLeaderboardData(mockList);
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        if (mounted) {
          setLeaderboardData([]);
          setLoadError('Leaderboard gagal dimuat dari Supabase. Coba lagi nanti.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchLeaderboard();

    return () => {
      mounted = false;
    };
  }, [user, currentUserName, timeframe]);

  // Filter and rank actual totals returned for the selected period.
  const filteredAndSortedList = useMemo(() => {
    return leaderboardData
      .map((item) => ({
        ...item,
        displayEmissions: item.emissions,
        displayLogs: item.logsCount,
      }))
      .filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
      .sort((a, b) => a.displayEmissions - b.displayEmissions); // Lower emission is higher rank!
  }, [leaderboardData, searchQuery]);

  // Find current user rank
  const currentUserRank = useMemo(() => {
    const idx = filteredAndSortedList.findIndex(
      (item) => item.isCurrentUser || item.name.toLowerCase().includes(currentUserName.toLowerCase())
    );
    return idx !== -1 ? idx + 1 : null;
  }, [filteredAndSortedList, currentUserName]);

  const topThree = filteredAndSortedList.slice(0, 3);

  const getInitials = (name) => {
    return name
      .replace('(Kamu)', '')
      .trim()
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="page-enter mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50/80 px-3 py-1 text-xs font-bold text-amber-800 shadow-sm backdrop-blur-md">
            <Trophy size={14} className="text-amber-600" />
            <span>PAPAN PERINGKAT</span>
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Pahlawan Hijau
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Siapa yang paling hemat emisi karbon? Semakin rendah emisi, semakin tinggi peringkatmu!
          </p>
        </div>

        {currentUserRank && (
          <div className="self-start rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 shadow-sm sm:self-auto">
            <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              Posisimu
            </p>
            <p className="text-xl font-black text-emerald-700">
              #{currentUserRank}{' '}
              <span className="text-xs font-semibold text-emerald-600">dari {filteredAndSortedList.length}</span>
            </p>
          </div>
        )}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Timeframe Tabs */}
        <div className="flex rounded-2xl bg-white/70 p-1 border border-white/80 shadow-sm backdrop-blur-xl">
          {[
            { id: 'minggu', label: 'Minggu Ini' },
            { id: 'bulan', label: 'Bulan Ini' },
            { id: 'semua', label: 'Sepanjang Masa' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTimeframe(tab.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                timeframe === tab.id
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pejuang..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-white/80 bg-white/70 py-2 pl-9 pr-4 text-xs font-medium text-slate-800 shadow-sm backdrop-blur-xl placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <LoadingSkeleton variant="card" height={220} className="rounded-3xl" />
            <LoadingSkeleton variant="card" height={240} className="rounded-3xl" />
            <LoadingSkeleton variant="card" height={220} className="rounded-3xl" />
          </div>
          <LoadingSkeleton variant="card" height={300} className="rounded-3xl" />
        </div>
      ) : loadError ? (
        <Card className="px-6 py-10 text-center">
          <p className="font-bold text-slate-800">{loadError}</p>
        </Card>
      ) : (
        <>
          {/* Top 3 Podium Cards */}
          {topThree.length >= 3 && !searchQuery && (
            <div className="stagger-children grid grid-cols-1 items-end gap-4 pt-6 sm:grid-cols-3">
              {/* #2 Silver (Left) */}
              <Card className="order-2 sm:order-1 p-6 text-center border-slate-200/80 bg-gradient-to-b from-slate-50 to-white/90">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-200 text-slate-700 shadow-md">
                  <Medal size={24} />
                </span>
                <Badge variant="default" className="mt-3 bg-slate-200 text-slate-800">
                  Juara 2
                </Badge>
                <div className="mx-auto mt-3 grid h-14 w-14 place-items-center rounded-full bg-slate-300 text-lg font-black text-slate-800">
                  {getInitials(topThree[1].name)}
                </div>
                <h3 className="mt-3 truncate font-black text-slate-900">{topThree[1].name}</h3>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {formatAmount(topThree[1].displayEmissions)}{' '}
                  <span className="text-xs font-semibold text-slate-400">kg CO₂</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">{topThree[1].displayLogs} aktivitas</p>
              </Card>

              {/* #1 Gold (Center, Taller) */}
              <Card className="order-1 sm:order-2 p-7 text-center border-amber-300 bg-gradient-to-b from-amber-50 via-white to-amber-50/40 shadow-2xl shadow-amber-500/10 scale-105 z-10">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-white shadow-lg shadow-amber-400/30">
                  <Crown size={28} />
                </span>
                <Badge variant="warning" className="mt-3 bg-amber-100 text-amber-900 border-amber-300 font-black">
                  JUARA 1
                </Badge>
                <div className="mx-auto mt-3 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-tr from-amber-400 to-yellow-400 text-xl font-black text-white shadow-md">
                  {getInitials(topThree[0].name)}
                </div>
                <h3 className="mt-3 truncate text-lg font-black text-slate-900">{topThree[0].name}</h3>
                <p className="mt-1 text-3xl font-black text-amber-900">
                  {formatAmount(topThree[0].displayEmissions)}{' '}
                  <span className="text-xs font-bold text-amber-700">kg CO₂</span>
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{topThree[0].displayLogs} aktivitas</p>
              </Card>

              {/* #3 Bronze (Right) */}
              <Card className="order-3 sm:order-3 p-6 text-center border-amber-200/60 bg-gradient-to-b from-orange-50/50 to-white/90">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-800 shadow-md">
                  <Medal size={24} />
                </span>
                <Badge variant="warning" className="mt-3 bg-orange-100 text-orange-900">
                  Juara 3
                </Badge>
                <div className="mx-auto mt-3 grid h-14 w-14 place-items-center rounded-full bg-amber-200 text-lg font-black text-amber-900">
                  {getInitials(topThree[2].name)}
                </div>
                <h3 className="mt-3 truncate font-black text-slate-900">{topThree[2].name}</h3>
                <p className="mt-1 text-2xl font-black text-slate-900">
                  {formatAmount(topThree[2].displayEmissions)}{' '}
                  <span className="text-xs font-semibold text-slate-400">kg CO₂</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">{topThree[2].displayLogs} aktivitas</p>
              </Card>
            </div>
          )}

          {/* Leaderboard List */}
          <Card className="overflow-hidden p-0">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-extrabold text-slate-900">
                Peringkat Lengkap
              </h2>
            </div>

            <ul className="divide-y divide-slate-100">
              {filteredAndSortedList.map((entry, index) => {
                const rank = index + 1;
                const isHighlight =
                  entry.isCurrentUser ||
                  entry.name.toLowerCase().includes(currentUserName.toLowerCase());

                return (
                  <li
                    key={entry.id || index}
                    className={`flex items-center gap-4 px-6 py-4 transition ${
                      isHighlight
                        ? 'bg-emerald-50/70 border-l-4 border-l-emerald-600'
                        : 'hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Rank Number */}
                    <div className="w-8 text-center font-black text-sm">
                      {rank <= 3 ? (
                        <Medal
                          size={20}
                          className={
                            rank === 1
                              ? 'text-amber-500'
                              : rank === 2
                              ? 'text-slate-400'
                              : 'text-orange-500'
                          }
                          aria-label={`Peringkat ${rank}`}
                        />
                      ) : (
                        <span className="text-slate-400">#{rank}</span>
                      )}
                    </div>

                    {/* Initials Avatar */}
                    <div
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-black text-sm ${
                        isHighlight
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {getInitials(entry.name)}
                    </div>

                    {/* Name & Badge */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-bold text-slate-900 text-sm">
                          {entry.name}
                        </p>
                        {isHighlight && (
                          <Badge variant="success" size="sm" className="text-[10px] py-0.5">
                            Kamu
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{entry.displayLogs} aktivitas tercatat</p>
                    </div>

                    {/* Emissions Stat */}
                    <div className="text-right">
                      <p className="font-black text-slate-900 text-sm sm:text-base">
                        {formatAmount(entry.displayEmissions)}{' '}
                        <span className="text-xs font-semibold text-slate-400">kg CO₂</span>
                      </p>
                      <span className="text-[11px] font-bold text-emerald-700">
                        {entry.badge}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            {filteredAndSortedList.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-sm">
                Tidak ada data pejuang yang cocok dengan pencarianmu.
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
