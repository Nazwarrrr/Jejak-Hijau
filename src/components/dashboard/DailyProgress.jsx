import { formatAmount } from '../../lib/utils';

export default function DailyProgress({
  todayTotal = 0,
  dailyLimit = 5.0,
  onLimitChange,
}) {
  const currentLimit = Number(dailyLimit);
  const validLimit = Number.isFinite(currentLimit) && currentLimit > 0 ? currentLimit : 5.0;
  const overLimit = todayTotal >= validLimit;
  const progress = Math.min((todayTotal / validLimit) * 100, 100);
  const remaining = Math.max(validLimit - todayTotal, 0);

  return (
    <div className="rounded-3xl border border-white/70 bg-white/65 p-5 shadow-xl shadow-emerald-900/[0.06] backdrop-blur-xl sm:p-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-slate-500">Dashboard hari ini</p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
            Jejak karbonmu
          </h2>
        </div>
        <label className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white/80 px-3 py-2 sm:self-auto">
          <span className="whitespace-nowrap text-xs font-semibold text-slate-500">
            Batas harian
          </span>
          <input
            type="number"
            min="0.1"
            step="0.1"
            aria-label="Batas emisi harian dalam kilogram CO2"
            value={dailyLimit}
            onChange={(event) => onLimitChange?.(event.target.value)}
            className="w-14 border-0 bg-transparent p-0 text-right text-sm font-extrabold text-slate-800 outline-none"
          />
          <span className="text-xs font-semibold text-slate-400">kg</span>
        </label>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-end justify-between">
          <p className="text-sm font-semibold text-slate-600">
            Pemakaian dari batas harian
          </p>
          <p
            className={`text-sm font-extrabold ${
              overLimit ? 'text-rose-600' : 'text-emerald-700'
            }`}
          >
            {formatAmount(todayTotal)}{' '}
            <span className="font-semibold text-slate-400">
              / {formatAmount(validLimit)} kg
            </span>
          </p>
        </div>
        <div
          role="progressbar"
          aria-label="Pemakaian batas emisi harian"
          aria-valuemin={0}
          aria-valuemax={validLimit}
          aria-valuenow={Math.min(todayTotal, validLimit)}
          className="h-3 overflow-hidden rounded-full bg-slate-100"
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              overLimit ? 'bg-rose-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          {overLimit
            ? 'Kamu sudah melewati batas harian. Yuk, rencanakan aktivitas rendah emisi.'
            : `${formatAmount(remaining)} kg CO₂ tersisa dari batas harianmu.`}
        </p>
      </div>
    </div>
  );
}
