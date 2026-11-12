import { useState } from 'react';
import {
  Activity,
  CarFront,
  Lightbulb,
  ChevronDown,
  Plus,
  Zap,
} from 'lucide-react';
import { VEHICLES, ELECTRICITY_RATE, ECO_TIPS } from '../../lib/constants';
import { formatAmount } from '../../lib/utils';
import Button from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';

export default function CarbonCalculator({ onAddLog }) {
  const [activeTab, setActiveTab] = useState('transportasi');
  const [vehicleType, setVehicleType] = useState(VEHICLES[0]?.value || 'motor');
  const [distance, setDistance] = useState('');
  const [electricityUsage, setElectricityUsage] = useState('');
  const { addToast } = useToast();

  const [randomTip] = useState(() => {
    if (!ECO_TIPS || ECO_TIPS.length === 0) return null;
    const index = Math.floor(Math.random() * ECO_TIPS.length);
    return ECO_TIPS[index];
  });

  const selectedVehicle =
    VEHICLES.find((vehicle) => vehicle.value === vehicleType) || VEHICLES[0];

  const amount = Number(activeTab === 'transportasi' ? distance : electricityUsage);
  const rate =
    activeTab === 'transportasi'
      ? selectedVehicle.rate
      : (ELECTRICITY_RATE || 0.85);

  const estimate = Number.isFinite(amount) && amount > 0 ? amount * rate : 0;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!Number.isFinite(amount) || amount <= 0) {
      addToast('Masukkan jumlah yang lebih besar dari 0 untuk menyimpan aktivitas.', 'error');
      return;
    }

    const activity = activeTab === 'transportasi' ? selectedVehicle.label : 'Listrik';
    const unit = activeTab === 'transportasi' ? selectedVehicle.unit : 'kWh';

    if (onAddLog) {
      onAddLog({
        activity,
        category: activeTab,
        amount,
        unit,
        emissions: estimate,
      });
    }

    if (activeTab === 'transportasi') {
      setDistance('');
    } else {
      setElectricityUsage('');
    }

    addToast(`${activity} berhasil ditambahkan ke riwayat.`, 'success');
  };

  return (
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

      {/* Tab Switcher */}
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
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Jenis kendaraan
              </span>
              <span className="relative block">
                <select
                  value={vehicleType}
                  onChange={(event) => setVehicleType(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white/80 px-4 py-3.5 pr-11 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                >
                  {VEHICLES.map((vehicle) => (
                    <option key={vehicle.value} value={vehicle.value}>
                      {vehicle.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
              </span>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Jarak tempuh
              </span>
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
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  KM
                </span>
              </span>
            </label>
          </div>
        ) : (
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Pemakaian listrik
            </span>
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
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                kWh
              </span>
            </span>
          </label>
        )}

        {/* Estimation Display */}
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3.5">
          <div>
            <p className="text-xs font-medium text-slate-500">Estimasi emisi karbon</p>
            <p className="mt-0.5 text-xs text-slate-400">
              {activeTab === 'transportasi'
                ? `${formatAmount(rate)} kg CO₂ / km`
                : `${formatAmount(rate)} kg CO₂ / kWh`}
            </p>
          </div>
          <p className="text-xl font-extrabold text-emerald-800">
            {formatAmount(estimate)}{' '}
            <span className="text-xs font-semibold">kg CO₂</span>
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="mt-5 w-full gap-2"
        >
          <Plus size={18} />
          Hitung &amp; Simpan Log
        </Button>
      </form>

      {/* Eco Tip Footer */}
      {randomTip && (
        <div className="mt-6 flex gap-3 rounded-2xl bg-teal-50/80 p-4">
          <span className="mt-0.5 text-teal-700">
            <Zap size={17} />
          </span>
          <p className="text-xs leading-5 text-teal-900/80">
            <span className="font-bold">Tahukah kamu? </span>
            {randomTip.text}
          </p>
        </div>
      )}
    </div>
  );
}
