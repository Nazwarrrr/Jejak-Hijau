import { useState } from 'react';
import {
  Target,
  Clock,
  Star,
  CheckCircle,
} from 'lucide-react';
import { ECO_CHALLENGES } from '../lib/constants';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import useToast from '../contexts/ToastContext';

const STORAGE_CHALLENGES_KEY = 'jejakhijau-user-challenges';

export default function ChallengesPage() {
  const { addToast } = useToast();
  const [filter, setFilter] = useState('Semua');

  // Load saved challenge states from localStorage
  const [activeChallenges, setActiveChallenges] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CHALLENGES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const saveChallengeState = (updated) => {
    setActiveChallenges(updated);
    try {
      localStorage.setItem(STORAGE_CHALLENGES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save challenges to localStorage', e);
    }
  };

  const handleStartChallenge = (challenge) => {
    const updated = {
      ...activeChallenges,
      [challenge.id]: {
        status: 'active',
        startedAt: new Date().toISOString(),
        progress: 1,
      },
    };
    saveChallengeState(updated);
    addToast(`Tantangan "${challenge.title}" dimulai! 💪`, 'success');
  };

  const handleCompleteChallenge = (challenge) => {
    const updated = {
      ...activeChallenges,
      [challenge.id]: {
        status: 'completed',
        completedAt: new Date().toISOString(),
      },
    };
    saveChallengeState(updated);
    addToast(`Selamat! Kamu menyelesaikan tantangan "${challenge.title}" (+${challenge.points} poin)! 🎉`, 'success');
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
    <div className="mx-auto max-w-4xl px-5 py-8 space-y-8">
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

      {/* Challenge Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {filteredChallenges.map((challenge) => {
          const userState = activeChallenges[challenge.id];
          const isCompleted = userState?.status === 'completed';
          const isActive = userState?.status === 'active';

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
                  <span className="text-3xl" role="img" aria-label={challenge.title}>
                    {challenge.icon}
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
                      <CheckCircle size={14} /> Selesai ✓
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
                      className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700"
                    >
                      Tandai Selesai ✓
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleStartChallenge(challenge)}
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
