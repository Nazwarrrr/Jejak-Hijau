import { useEffect, useState } from 'react';
import {
  Target,
  Clock,
  Star,
  CheckCircle,
  Footprints,
  Bike,
  Lightbulb,
  Bus,
  Leaf,
  ShieldCheck,
} from 'lucide-react';
import { ECO_CHALLENGES } from '../lib/constants';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import useToast from '../contexts/ToastContext';
import useAuth from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_CHALLENGES_KEY = 'jejakhijau-user-challenges';
const CHALLENGE_ICONS = { Footprints, Bike, Lightbulb, Bus, Leaf, ShieldCheck };

export default function ChallengesPage() {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [filter, setFilter] = useState('Semua');
  const [activeChallenges, setActiveChallenges] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [savingChallengeId, setSavingChallengeId] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadChallenges() {
      setLoading(true);
      setLoadError('');

      try {
        if (isSupabaseConfigured && supabase) {
          if (!user) throw new Error('Silakan masuk kembali untuk memuat tantangan.');

          const { data, error } = await supabase
            .from('user_challenges')
            .select('id, challenge_id, started_at, completed_at, status')
            .eq('user_id', user.id)
            .order('started_at', { ascending: false });

          if (error) throw error;

          const latestByChallenge = {};
          for (const row of data || []) {
            if (!latestByChallenge[row.challenge_id]) {
              latestByChallenge[row.challenge_id] = {
                id: row.id,
                status: row.status,
                startedAt: row.started_at,
                completedAt: row.completed_at,
              };
            }
          }

          if (mounted) setActiveChallenges(latestByChallenge);
          return;
        }

        const saved = localStorage.getItem(STORAGE_CHALLENGES_KEY);
        const parsed = saved ? JSON.parse(saved) : {};
        if (mounted) setActiveChallenges(parsed);
      } catch (error) {
        console.error('Gagal memuat tantangan:', error);
        if (mounted) {
          setActiveChallenges({});
          setLoadError('Tantangan gagal dimuat. Periksa koneksi lalu muat ulang halaman.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadChallenges();
    return () => {
      mounted = false;
    };
  }, [user]);

  const saveChallengeState = (updated) => {
    if (!isSupabaseConfigured || !supabase) {
      localStorage.setItem(STORAGE_CHALLENGES_KEY, JSON.stringify(updated));
    }
    setActiveChallenges(updated);
  };

  const handleStartChallenge = async (challenge) => {
    setSavingChallengeId(challenge.id);
    try {
      if (isSupabaseConfigured && supabase) {
        if (!user) throw new Error('Sesi pengguna tidak ditemukan. Silakan masuk kembali.');

        const { data, error } = await supabase
          .from('user_challenges')
          .insert({ user_id: user.id, challenge_id: challenge.id, status: 'active' })
          .select('id, started_at, status')
          .single();

        if (error) throw error;

        saveChallengeState({
          ...activeChallenges,
          [challenge.id]: {
            id: data.id,
            status: data.status,
            startedAt: data.started_at,
          },
        });
      } else {
        saveChallengeState({
          ...activeChallenges,
          [challenge.id]: {
            status: 'active',
            startedAt: new Date().toISOString(),
          },
        });
      }
      addToast(`Tantangan "${challenge.title}" dimulai.`, 'success');
    } catch (error) {
      console.error('Gagal memulai tantangan:', error);
      addToast('Tantangan gagal dimulai. Periksa koneksi lalu coba lagi.', 'error');
    } finally {
      setSavingChallengeId(null);
    }
  };

  const handleCompleteChallenge = async (challenge) => {
    const challengeState = activeChallenges[challenge.id];
    setSavingChallengeId(challenge.id);
    try {
      const completedAt = new Date().toISOString();
      if (isSupabaseConfigured && supabase) {
        if (!user) throw new Error('Sesi pengguna tidak ditemukan. Silakan masuk kembali.');
        if (!challengeState?.id) throw new Error('Data tantangan tidak lengkap. Muat ulang halaman.');

        const { data, error } = await supabase
          .from('user_challenges')
          .update({ status: 'completed', completed_at: completedAt })
          .eq('id', challengeState.id)
          .eq('user_id', user.id)
          .select('id')
          .single();

        if (error) throw error;
        if (!data) throw new Error('Tantangan tidak ditemukan untuk akun ini.');
      }

      saveChallengeState({
        ...activeChallenges,
        [challenge.id]: {
          ...challengeState,
          status: 'completed',
          completedAt,
        },
      });
      addToast(`Selamat! Kamu menyelesaikan tantangan "${challenge.title}" dan mendapat ${challenge.points} poin.`, 'success');
    } catch (error) {
      console.error('Gagal menyelesaikan tantangan:', error);
      addToast('Tantangan gagal diselesaikan. Periksa koneksi lalu coba lagi.', 'error');
    } finally {
      setSavingChallengeId(null);
    }
  };

  const filteredChallenges = ECO_CHALLENGES.filter((ch) => {
    if (filter === 'Semua') return true;
    if (filter === 'Transportasi') return ch.category === 'transportasi';
    if (filter === 'Listrik') return ch.category === 'listrik';
    return true;
  });

  const completedCount = Object.values(activeChallenges).filter(
    (c) => c.status === 'completed'
  ).length;

  return (
    <div className="page-enter mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3 py-1 text-xs font-bold text-emerald-800 shadow-sm backdrop-blur-md">
            <Target size={14} className="text-emerald-600" />
            <span>AKSI NYATA</span>
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Tantangan Hijau
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Ambil tantangan dan buktikan komitmenmu untuk bumi yang lebih sehat!
          </p>
        </div>

        <div className="self-start rounded-2xl border border-emerald-300 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-xl sm:self-auto">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Tantangan Selesai
          </p>
          <p className="text-xl font-black text-emerald-700">
            {completedCount}{' '}
            <span className="text-xs font-semibold text-slate-400">/ {ECO_CHALLENGES.length}</span>
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex rounded-2xl bg-white/70 p-1 border border-white/80 shadow-sm backdrop-blur-xl self-start w-fit">
        {['Semua', 'Transportasi', 'Listrik'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              filter === tab
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loadError && (
        <Card role="alert" className="border-rose-200 bg-rose-50/80 px-5 py-4 text-sm font-semibold text-rose-700">
          {loadError}
        </Card>
      )}

      {/* Challenge Cards Grid */}
      <div className="stagger-children grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {loading && (
          <Card className="col-span-full p-8 text-center text-sm font-semibold text-slate-500">
            Memuat status tantangan...
          </Card>
        )}
        {filteredChallenges.map((challenge) => {
          const userState = activeChallenges[challenge.id];
          const isCompleted = userState?.status === 'completed';
          const isActive = userState?.status === 'active';
          const ChallengeIcon = CHALLENGE_ICONS[challenge.icon];

          return (
            <Card
              key={challenge.id}
              className={`flex flex-col justify-between p-6 transition-all duration-300 ${
                isCompleted
                  ? 'border-emerald-300/80 bg-emerald-50/50'
                  : isActive
                  ? 'border-amber-300/80 bg-amber-50/40'
                  : 'hover:border-emerald-200'
              }`}
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <ChallengeIcon size={23} aria-label={challenge.title} />
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    <Badge variant="default" className="text-[11px] capitalize">
                      {challenge.category}
                    </Badge>
                    <Badge variant="warning" className="text-[11px]">
                      <Star size={11} className="fill-amber-500 text-amber-500" />
                      {challenge.points} poin
                    </Badge>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="mt-4 text-lg font-black tracking-tight text-slate-900">
                  {challenge.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {challenge.description}
                </p>

                {/* Duration indicator */}
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <Clock size={13} className="text-slate-400" />
                  <span>Durasi: {challenge.duration} hari</span>
                </div>
              </div>

              {/* Action Area */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                {isCompleted ? (
                  <div className="flex items-center justify-between w-full">
                    <Badge variant="success" className="gap-1 px-3 py-1 text-xs">
                      <CheckCircle size={14} /> Selesai
                    </Badge>
                    <span className="text-xs font-bold text-emerald-700">+{challenge.points} Poin didapat</span>
                  </div>
                ) : isActive ? (
                  <div className="flex items-center justify-between w-full gap-2">
                    <Badge variant="warning" className="gap-1 px-3 py-1 text-xs">
                      Sedang Berjalan
                    </Badge>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleCompleteChallenge(challenge)}
                      loading={savingChallengeId === challenge.id}
                      disabled={loading || Boolean(savingChallengeId)}
                      className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700"
                    >
                      Tandai Selesai
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleStartChallenge(challenge)}
                    loading={savingChallengeId === challenge.id}
                    disabled={loading || Boolean(savingChallengeId)}
                    className="w-full"
                  >
                    Ambil Tantangan
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
