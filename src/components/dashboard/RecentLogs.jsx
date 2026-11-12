import { formatAmount, formatTime } from '../../lib/utils';
import {
  Lightbulb,
  CarFront,
  Trash2,
  Leaf,
  Bus,
  Train,
  Bike,
  Zap,
} from 'lucide-react';

function getActivityIcon(activity = '') {
  const lower = activity.toLowerCase();
  if (lower.includes('listrik')) return <Lightbulb size={18} />;
  if (lower.includes('motor')) return <Bike size={18} />;
  if (lower.includes('bus') || lower.includes('angkot')) return <Bus size={18} />;
  if (lower.includes('kereta')) return <Train size={18} />;
  if (lower.includes('mobil listrik')) return <Zap size={18} />;
  if (lower.includes('mobil')) return <CarFront size={18} />;
  return <Leaf size={18} />;
}

export default function RecentLogs({ logs = [], onDelete, totalCount = 0 }) {
  const displayCount = totalCount !== undefined ? totalCount : logs.length;

  return (
    <div className="rounded-3xl border border-white/70 bg-white/65 p-5 shadow-xl shadow-emerald-900/[0.05] backdrop-blur-xl sm:p-7">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Jejak aktivitasmu</p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">
            Riwayat terbaru
          </h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">
          {displayCount} aktivitas
        </span>
      </div>

      {logs && logs.length > 0 ? (
        <ul className="divide-y divide-slate-100">
          {logs.map((log) => (
            <li
              key={log.id}
              className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0 sm:gap-4"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                {getActivityIcon(log.activity)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800">
                  {log.activity}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {formatAmount(log.amount)} {log.unit}{' '}
                  <span className="mx-1 text-slate-300">·</span>{' '}
                  {formatTime(log.timestamp || log.created_at || new Date())}
                </p>
              </div>
              <p className="whitespace-nowrap text-right text-sm font-extrabold text-slate-800">
                {formatAmount(log.emissions)}{' '}
                <span className="text-xs font-semibold text-slate-400">kg CO₂</span>
              </p>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(log.id)}
                  aria-label={`Hapus aktivitas ${log.activity}`}
                  className="ml-1 rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 px-4 py-9 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm">
            <Leaf size={22} />
          </span>
          <p className="mt-3 text-sm font-bold text-slate-700">
            Belum ada aktivitas tercatat
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Aktivitas yang kamu simpan akan muncul di sini.
          </p>
        </div>
      )}
    </div>
  );
}
