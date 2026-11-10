import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bike,
  CarFront,
  Check,
  ChevronDown,
  Leaf,
  Lightbulb,
  Plus,
  Sparkles,
  Trash2,
  Zap,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const LOGS_STORAGE_KEY = 'jejakhijau-logs';
const LIMIT_STORAGE_KEY = 'jejakhijau-daily-limit';
const DEFAULT_DAILY_LIMIT = '5.0';

const VEHICLES = [
  { value: 'motor', label: 'Motor', rate: 0.1, unit: 'km', icon: Bike },
  { value: 'gasoline-car', label: 'Mobil Bensin', rate: 0.2, unit: 'km', icon: CarFront },
  { value: 'electric-car', label: 'Mobil Listrik', rate: 0.05, unit: 'km', icon: CarFront },
];

const INITIAL_WEEK = [3.2, 4.1, 2.8, 3.6, 4.4, 3.1];

function readStoredLogs() {
  try {
    const storedLogs = window.localStorage.getItem(LOGS_STORAGE_KEY);
    if (!storedLogs) return [];

    const parsedLogs = JSON.parse(storedLogs);
    if (!Array.isArray(parsedLogs)) {
      throw new Error('Data riwayat JejakHijau tidak berbentuk daftar.');
    }

    return parsedLogs.filter(
      (log) =>
        log &&
        typeof log.id === 'string' &&
        typeof log.activity === 'string' &&
        typeof log.emissions === 'number' &&
        typeof log.date === 'string',
    );
  } catch (error) {
    console.error('Gagal membaca riwayat JejakHijau dari localStorage.', error);
    return [];
  }
}

function readStoredLimit() {
  try {
    const storedLimit = window.localStorage.getItem(LIMIT_STORAGE_KEY);
    if (!storedLimit) return DEFAULT_DAILY_LIMIT;

    const parsedLimit = Number(storedLimit);
    return Number.isFinite(parsedLimit) && parsedLimit > 0
      ? String(parsedLimit)
      : DEFAULT_DAILY_LIMIT;
  } catch (error) {
    console.error('Gagal membaca batas harian JejakHijau dari localStorage.', error);
    return DEFAULT_DAILY_LIMIT;
  }
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatAmount(amount) {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatTime(timestamp) {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

function App() {
  const [activeTab, setActiveTab] = useState('transportasi');
  const [vehicleType, setVehicleType] = useState(VEHICLES[0].value);
  const [distance, setDistance] = useState('');
  const [electricityUsage, setElectricityUsage] = useState('');
  const [logs, setLogs] = useState(readStoredLogs);
  const [dailyLimit, setDailyLimit] = useState(readStoredLimit);
  const [notice, setNotice] = useState('');
  const logIdPrefix = useId();
  const logSequence = useRef(0);
  const todayKey = getLocalDateKey();

  useEffect(() => {
    try {
      window.localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Gagal menyimpan riwayat JejakHijau ke localStorage.', error);
    }
  }, [logs]);

  useEffect(() => {
    const parsedLimit = Number(dailyLimit);
    if (!Number.isFinite(parsedLimit) || parsedLimit <= 0) return;

    try {
      window.localStorage.setItem(LIMIT_STORAGE_KEY, String(parsedLimit));
    } catch (error) {
      console.error('Gagal menyimpan batas harian JejakHijau ke localStorage.', error);
    }
  }, [dailyLimit]);

  const selectedVehicle = VEHICLES.find((vehicle) => vehicle.value === vehicleType);
  const amount = Number(activeTab === 'transportasi' ? distance : electricityUsage);
  const rate = activeTab === 'transportasi' ? selectedVehicle.rate : 0.85;
  const estimate = Number.isFinite(amount) && amount > 0 ? amount * rate : 0;
  const currentLimit = Number(dailyLimit);
  const validLimit = Number.isFinite(currentLimit) && currentLimit > 0
    ? currentLimit
    : Number(DEFAULT_DAILY_LIMIT);

  const todayLogs = useMemo(
    () => logs.filter((log) => log.date === todayKey),
    [logs, todayKey],
  );
  const todayTotal = todayLogs.reduce((total, log) => total + log.emissions, 0);

  const weekLogs = useMemo(() => {
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - 6);
    return logs.filter((log) => new Date(`${log.date}T00:00:00`) >= startOfWeek);
  }, [logs]);
  const weekTotal = weekLogs.reduce((total, log) => total + log.emissions, 0);
  const progress = Math.min((todayTotal / validLimit) * 100, 100);
  const overLimit = todayTotal >= validLimit;

  const chartData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const dateKey = getLocalDateKey(date);
      const isToday = dateKey === todayKey;
      const actualTotal = logs
        .filter((log) => log.date === dateKey)
        .reduce((total, log) => total + log.emissions, 0);

      return {
        day: new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(date),
        total: isToday ? actualTotal : actualTotal || INITIAL_WEEK[index],
        isToday,
      };
    });
  }, [logs, todayKey]);

  function handleSubmit(event) {
    event.preventDefault();
    if (!Number.isFinite(amount) || amount <= 0) {
      setNotice('Masukkan jumlah yang lebih besar dari 0 untuk menyimpan aktivitas.');
      return;
    }

    const activity = activeTab === 'transportasi'
      ? selectedVehicle.label
      : 'Listrik';
    let id;
    do {
      id = `${logIdPrefix}-${logSequence.current++}`;
    } while (logs.some((log) => log.id === id));

    const newLog = {
      id,
      activity,
      amount,
      unit: activeTab === 'transportasi' ? selectedVehicle.unit : 'kWh',
      emissions: estimate,
      date: getLocalDateKey(),
      timestamp: new Date().toISOString(),
    };

    setLogs((currentLogs) => [newLog, ...currentLogs]);
    setDistance('');
    setElectricityUsage('');
    setNotice(`${activity} berhasil ditambahkan ke riwayat.`);
  }

  function handleDelete(logId) {
    setLogs((currentLogs) => currentLogs.filter((log) => log.id !== logId));
    setNotice('Aktivitas dihapus dari riwayat.');
  }

  const latestLogs = [...logs]
    .sort((first, second) => new Date(second.timestamp) - new Date(first.timestamp))
    .slice(0, 5);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-emerald-50 to-teal-100 text-slate-800">
      <div className="pointer-events-none absolute -left-32 top-56 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-24 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl" />

      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#" className="flex items-center gap-2.5" aria-label="JejakHijau beranda">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
              <Leaf size={22} strokeWidth={2.5} />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Jejak<span className="text-emerald-700">Hijau</span>
            </span>
          </a>

          <div className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold sm:text-sm ${
            overLimit
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}>
            <span className={`h-2 w-2 rounded-full ${overLimit ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            {overLimit ? 'Batas Terlampaui' : 'Aman'}
          </div>
        </nav>
      </header>

      <main className="relative mx-auto max-w-7xl px-5 pb-12 pt-9 sm:px-8 sm:pt-14">
        <section className="mb-9 flex flex-col items-start justify-between gap-6 md:mb-11 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/60 px-3 py-1.5 text-xs font-semibold tracking-wide text-emerald-800 shadow-sm">
              <Sparkles size={14} />
              LANGKAH KECIL, DAMPAK BESAR
            </div>
            <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-slate-900 sm:text-5xl">
              Track your footprint for a{' '}
              <span className="text-emerald-700">greener future.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Kenali jejak karbonmu, bangun kebiasaan yang lebih baik, dan rawat bumi mulai dari hari ini.
            </p>
          </div>
          <div className="hidden items-center gap-3 rounded-2xl border border-white/70 bg-white/55 px-4 py-3 shadow-sm backdrop-blur sm:flex">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-100 text-teal-700">
              <Leaf size={20} />
            </span>
            <div>
              <p className="text-xs font-medium text-slate-500">Hari ini</p>
              <p className="font-bold text-slate-800">
                {new Intl.DateTimeFormat('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                }).format(new Date())}
              </p>
            </div>
          </div>
        </section>

        <section className="grid items-start gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-3xl border border-white/70 bg-white/65 p-5 shadow-xl shadow-emerald-900/[0.06] backdrop-blur-xl sm:p-7">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-700">Kalkulator karbon</p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
                  Catat aktivitas
                </h2>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Activity size={21} />
              </span>
            </div>

            <div className="mb-6 grid grid-cols-2 rounded-2xl bg-slate-100/80 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('transportasi')}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition ${
                  activeTab === 'transportasi'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <CarFront size={17} />
                Transportasi
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('listrik')}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition ${
                  activeTab === 'listrik'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Lightbulb size={17} />
                Listrik
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {activeTab === 'transportasi' ? (
                <div className="space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">Jenis kendaraan</span>
                    <span className="relative block">
                      <select
                        value={vehicleType}
                        onChange={(event) => setVehicleType(event.target.value)}
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-white/80 px-4 py-3.5 pr-11 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      >
                        {VEHICLES.map((vehicle) => (
                          <option key={vehicle.value} value={vehicle.value}>{vehicle.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    </span>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">Jarak tempuh</span>
                    <span className="relative block">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        inputMode="decimal"
                        value={distance}
                        onChange={(event) => setDistance(event.target.value)}
                        placeholder="Contoh: 15"
                        className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3.5 pr-14 text-sm font-medium text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">KM</span>
                    </span>
                  </label>
                </div>
              ) : (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Pemakaian listrik</span>
                  <span className="relative block">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      inputMode="decimal"
                      value={electricityUsage}
                      onChange={(event) => setElectricityUsage(event.target.value)}
                      placeholder="Contoh: 2.5"
                      className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3.5 pr-14 text-sm font-medium text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">kWh</span>
                  </span>
                </label>
              )}

              <div className="mt-6 flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3.5">
                <div>
                  <p className="text-xs font-medium text-slate-500">Estimasi emisi karbon</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {activeTab === 'transportasi'
                      ? `${formatAmount(rate)} kg CO₂ / km`
                      : '0,85 kg CO₂ / kWh'}
                  </p>
                </div>
                <p className="text-xl font-extrabold text-emerald-800">
                  {formatAmount(estimate)} <span className="text-xs font-semibold">kg CO₂</span>
                </p>
              </div>

              <button
                type="submit"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/25"
              >
                <Plus size={18} />
                Hitung &amp; Simpan Log
              </button>
              {notice && (
                <p aria-live="polite" className="mt-3 text-center text-xs font-medium text-slate-500">
                  {notice}
                </p>
              )}
            </form>

            <div className="mt-6 flex gap-3 rounded-2xl bg-teal-50/80 p-4">
              <span className="mt-0.5 text-teal-700"><Zap size={17} /></span>
              <p className="text-xs leading-5 text-teal-900/80">
                <span className="font-bold">Tahukah kamu?</span> Memilih transportasi yang lebih ramah lingkungan bisa membantu menekan emisi harian.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/70 bg-white/65 p-5 shadow-xl shadow-emerald-900/[0.06] backdrop-blur-xl sm:p-7">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Dashboard hari ini</p>
                  <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">Jejak karbonmu</h2>
                </div>
                <label className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white/80 px-3 py-2 sm:self-auto">
                  <span className="whitespace-nowrap text-xs font-semibold text-slate-500">Batas harian</span>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    aria-label="Batas emisi harian dalam kilogram CO2"
                    value={dailyLimit}
                    onChange={(event) => setDailyLimit(event.target.value)}
                    onBlur={() => {
                      if (!Number.isFinite(Number(dailyLimit)) || Number(dailyLimit) <= 0) {
                        setDailyLimit(DEFAULT_DAILY_LIMIT);
                      }
                    }}
                    className="w-14 border-0 bg-transparent p-0 text-right text-sm font-extrabold text-slate-800 outline-none"
                  />
                  <span className="text-xs font-semibold text-slate-400">kg</span>
                </label>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-end justify-between">
                  <p className="text-sm font-semibold text-slate-600">Pemakaian dari batas harian</p>
                  <p className={`text-sm font-extrabold ${overLimit ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {formatAmount(todayTotal)} <span className="font-semibold text-slate-400">/ {formatAmount(validLimit)} kg</span>
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
                    className={`h-full rounded-full transition-all duration-500 ${overLimit ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  {overLimit
                    ? 'Kamu sudah melewati batas harian. Yuk, rencanakan aktivitas rendah emisi.'
                    : `${formatAmount(Math.max(validLimit - todayTotal, 0))} kg CO₂ tersisa dari batas harianmu.`}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-emerald-100/80 bg-gradient-to-br from-emerald-50 to-white p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><Leaf size={18} /></span>
                    {todayTotal > 0
                      ? <ArrowUpRight size={17} className="text-emerald-600" />
                      : <Check size={17} className="text-emerald-600" />}
                  </div>
                  <p className="mt-4 text-xs font-semibold text-slate-500">Total Hari Ini</p>
                  <p className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                    {formatAmount(todayTotal)} <span className="text-xs font-semibold text-slate-400">kg</span>
                  </p>
                </div>
                <div className="rounded-2xl border border-teal-100/80 bg-gradient-to-br from-teal-50 to-white p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-100 text-teal-700"><Activity size={18} /></span>
                    <ArrowDownRight size={17} className="text-teal-600" />
                  </div>
                  <p className="mt-4 text-xs font-semibold text-slate-500">Total Minggu Ini</p>
                  <p className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                    {formatAmount(weekTotal)} <span className="text-xs font-semibold text-slate-400">kg</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/65 p-5 shadow-xl shadow-emerald-900/[0.06] backdrop-blur-xl sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Konsistensi kecil berarti</p>
                  <h3 className="mt-1 text-lg font-extrabold text-slate-900">Tren 7 hari terakhir</h3>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">kg CO₂</span>
              </div>
              <div className="h-48 w-full" role="img" aria-label="Grafik emisi karbon selama tujuh hari terakhir">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#e8f0ed" strokeDasharray="4 4" />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                      dy={8}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      cursor={{ fill: '#f0fdf4' }}
                      formatter={(value) => [`${formatAmount(Number(value))} kg CO₂`, 'Emisi']}
                      contentStyle={{
                        border: '1px solid #d1fae5',
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(15, 23, 42, .08)',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="total" radius={[7, 7, 2, 2]} maxBarSize={34}>
                      {chartData.map((entry) => (
                        <Cell key={entry.day} fill={entry.isToday ? '#059669' : '#a7d8c6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/70 bg-white/65 p-5 shadow-xl shadow-emerald-900/[0.05] backdrop-blur-xl sm:p-7">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Jejak aktivitasmu</p>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">Riwayat terbaru</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">
              {logs.length} aktivitas
            </span>
          </div>

          {latestLogs.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {latestLogs.map((log) => (
                <li key={log.id} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0 sm:gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                    {log.activity === 'Listrik' ? <Lightbulb size={18} /> : <CarFront size={18} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800">{log.activity}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatAmount(log.amount)} {log.unit} <span className="mx-1 text-slate-300">·</span> {formatTime(log.timestamp)}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-right text-sm font-extrabold text-slate-800">
                    {formatAmount(log.emissions)} <span className="text-xs font-semibold text-slate-400">kg CO₂</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDelete(log.id)}
                    aria-label={`Hapus aktivitas ${log.activity}`}
                    className="ml-1 rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 px-4 py-9 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm"><Leaf size={22} /></span>
              <p className="mt-3 text-sm font-bold text-slate-700">Belum ada aktivitas tercatat</p>
              <p className="mt-1 text-xs text-slate-500">Aktivitas yang kamu simpan akan muncul di sini.</p>
            </div>
          )}
        </section>

        <footer className="pb-2 pt-8 text-center text-xs font-medium text-slate-400">
          Dibuat dengan kepedulian untuk bumi yang lebih hijau <span className="text-emerald-600">♥</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
