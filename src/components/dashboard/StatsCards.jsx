import { formatAmount, getTreeLevel } from '../../lib/utils';
import { Leaf, Activity, ArrowUpRight, ArrowDownRight, Check, TreePine, Flame } from 'lucide-react';

export default function StatsCards({
  todayTotal = 0,
  weekTotal = 0,
  totalSaved = 0,
  streak = 0,
}) {
  const treeInfo = getTreeLevel(totalSaved);

  return (
    <div className="stagger-children grid grid-cols-2 gap-3">
      {/* 1. Total Hari Ini */}
      <div className="rounded-2xl border border-emerald-100/80 bg-gradient-to-br from-emerald-50 to-white p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
            <Leaf size={18} />
          </span>
          {todayTotal > 0 ? (
            <ArrowUpRight size={17} className="text-emerald-600" />
          ) : (
            <Check size={17} className="text-emerald-600" />
          )}
        </div>
        <p className="mt-4 text-xs font-semibold text-slate-500">Total Hari Ini</p>
        <p className="mt-1 text-2xl font-black tracking-tight text-slate-900">
          {formatAmount(todayTotal)}{' '}
          <span className="text-xs font-semibold text-slate-400">kg</span>
        </p>
      </div>

      {/* 2. Total Minggu Ini */}
      <div className="rounded-2xl border border-teal-100/80 bg-gradient-to-br from-teal-50 to-white p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-100 text-teal-700">
            <Activity size={18} />
          </span>
          <ArrowDownRight size={17} className="text-teal-600" />
        </div>
        <p className="mt-4 text-xs font-semibold text-slate-500">Total Minggu Ini</p>
        <p className="mt-1 text-2xl font-black tracking-tight text-slate-900">
          {formatAmount(weekTotal)}{' '}
          <span className="text-xs font-semibold text-slate-400">kg</span>
        </p>
      </div>

      {/* 3. Pohon Virtual */}
      <div className="rounded-2xl border border-green-100/80 bg-gradient-to-br from-green-50 to-white p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-green-100 text-green-700">
            <TreePine size={18} />
          </span>
          <TreePine size={20} className="text-green-700" aria-hidden="true" />
        </div>
        <p className="mt-4 text-xs font-semibold text-slate-500">Pohon Virtual</p>
        <p className="mt-1 truncate text-xl sm:text-2xl font-black tracking-tight text-slate-900" title={treeInfo.name}>
          {treeInfo.name}
        </p>
      </div>

      {/* 4. Streak */}
      <div className="rounded-2xl border border-amber-100/80 bg-gradient-to-br from-amber-50 to-white p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-700">
            <Flame size={18} />
          </span>
          <span className="text-xs font-bold text-amber-700">Aktif</span>
        </div>
        <p className="mt-4 text-xs font-semibold text-slate-500">Streak</p>
        <p className="mt-1 text-2xl font-black tracking-tight text-slate-900">
          {streak}{' '}
          <span className="text-xs font-semibold text-slate-400">hari</span>
        </p>
      </div>
    </div>
  );
}
