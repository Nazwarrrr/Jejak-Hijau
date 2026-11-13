import { useState } from 'react';
import {
  Activity,
  CarFront,
  Lightbulb,
  Utensils,
  Trash2,
  ChevronDown,
  Plus,
} from 'lucide-react';
import {
  VEHICLES,
  ELECTRICITY_RATE,
  FOOD_ITEMS,
  WASTE_ITEMS,
} from '../../lib/constants';
import { formatAmount } from '../../lib/utils';
import Button from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';
import EcoTips from './EcoTips';

export default function CarbonCalculator({ onAddLog }) {
  const [activeTab, setActiveTab] = useState('transportasi');
  const [vehicleType, setVehicleType] = useState(VEHICLES[0]?.value || 'motor');
  const [foodType, setFoodType] = useState(FOOD_ITEMS[0]?.value || 'beef');
  const [wasteType, setWasteType] = useState(WASTE_ITEMS[0]?.value || 'plastic-bag');
  const [distance, setDistance] = useState('');
  const [electricityUsage, setElectricityUsage] = useState('');
  const [foodPortion, setFoodPortion] = useState('');
  const [wasteQty, setWasteQty] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useToast();

  const selectedVehicle =
    VEHICLES.find((vehicle) => vehicle.value === vehicleType) || VEHICLES[0];
  const selectedFood =
    FOOD_ITEMS.find((food) => food.value === foodType) || FOOD_ITEMS[0];
  const selectedWaste =
    WASTE_ITEMS.find((waste) => waste.value === wasteType) || WASTE_ITEMS[0];

  let amount = 0;
  let rate = 0;
  let activity = '';
  let unit = '';

  if (activeTab === 'transportasi') {
    amount = Number(distance);
    rate = selectedVehicle.rate;
    activity = selectedVehicle.label;
    unit = selectedVehicle.unit;
  } else if (activeTab === 'listrik') {
    amount = Number(electricityUsage);
    rate = ELECTRICITY_RATE || 0.85;
    activity = 'Listrik';
    unit = 'kWh';
  } else if (activeTab === 'makanan') {
    amount = Number(foodPortion);
    rate = selectedFood.rate;
    activity = selectedFood.label;
    unit = selectedFood.unit;
  } else if (activeTab === 'sampah') {
    amount = Number(wasteQty);
    rate = selectedWaste.rate;
    activity = selectedWaste.label;
    unit = selectedWaste.unit;
  }

  const estimate = Number.isFinite(amount) && amount > 0 ? amount * rate : 0;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!Number.isFinite(amount) || amount <= 0) {
      addToast('Masukkan jumlah yang lebih besar dari 0 untuk menyimpan aktivitas.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      if (!onAddLog) throw new Error('Penyimpanan aktivitas belum tersedia.');
      const { error } = await onAddLog({
        activity,
        category: activeTab,
        amount,
        unit,
        emissions: estimate,
      });
      if (error) throw error;

      if (activeTab === 'transportasi') setDistance('');
      else if (activeTab === 'listrik') setElectricityUsage('');
      else if (activeTab === 'makanan') setFoodPortion('');
      else if (activeTab === 'sampah') setWasteQty('');

      addToast(`${activity} berhasil ditambahkan ke riwayat.`, 'success');
    } catch (error) {
      console.error('Gagal menyimpan aktivitas:', error);
      addToast('Aktivitas gagal disimpan. Periksa koneksi lalu coba lagi.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const getRateDescription = () => {
    if (activeTab === 'transportasi') return `${formatAmount(rate)} kg CO₂ / km`;
    if (activeTab === 'listrik') return `${formatAmount(rate)} kg CO₂ / kWh`;
    if (activeTab === 'makanan') return `${formatAmount(rate)} kg CO₂ / porsi`;
    if (activeTab === 'sampah') return `${formatAmount(rate)} kg CO₂ / ${unit}`;
    return '';
  };

  return (
    <div className="flex h-full w-full flex-col rounded-3xl border border-white/70 bg-white/65 p-5 shadow-xl shadow-emerald-900/[0.06] backdrop-blur-xl sm:p-7">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Kalkulator emisi 360°</p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
            Catat aktivitas
          </h2>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
          <Activity size={21} />
        </span>
      </div>

      {/* 4-Tab Switcher */}
      <div className="mb-6 grid grid-cols-2 gap-1 rounded-2xl bg-slate-100/90 p-1 sm:grid-cols-4">
        <button
          type="button"
          onClick={() => setActiveTab('transportasi')}
          className={`flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2.5 text-xs font-bold transition sm:text-sm ${
            activeTab === 'transportasi'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <CarFront size={16} />
          Transport
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('listrik')}
          className={`flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2.5 text-xs font-bold transition sm:text-sm ${
            activeTab === 'listrik'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Lightbulb size={16} />
          Listrik
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('makanan')}
          className={`flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2.5 text-xs font-bold transition sm:text-sm ${
            activeTab === 'makanan'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Utensils size={16} />
          Makanan
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sampah')}
          className={`flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2.5 text-xs font-bold transition sm:text-sm ${
            activeTab === 'sampah'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Trash2 size={16} />
          Sampah
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tab 1: Transportasi */}
        {activeTab === 'transportasi' && (
          <div className="space-y-4">
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
        )}

        {/* Tab 2: Listrik */}
        {activeTab === 'listrik' && (
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

        {/* Tab 3: Makanan */}
        {activeTab === 'makanan' && (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Menu / Sumber makanan
              </span>
              <span className="relative block">
                <select
                  value={foodType}
                  onChange={(event) => setFoodType(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white/80 px-4 py-3.5 pr-11 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                >
                  {FOOD_ITEMS.map((food) => (
                    <option key={food.value} value={food.value}>
                      {food.label}
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
                Jumlah porsi
              </span>
              <span className="relative block">
                <input
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={foodPortion}
                  onChange={(event) => setFoodPortion(event.target.value)}
                  placeholder="Contoh: 1 atau 2"
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3.5 pr-16 text-sm font-medium text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  porsi
                </span>
              </span>
            </label>
          </div>
        )}

        {/* Tab 4: Sampah */}
        {activeTab === 'sampah' && (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Jenis sampah / kemasan
              </span>
              <span className="relative block">
                <select
                  value={wasteType}
                  onChange={(event) => setWasteType(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white/80 px-4 py-3.5 pr-11 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                >
                  {WASTE_ITEMS.map((waste) => (
                    <option key={waste.value} value={waste.value}>
                      {waste.label}
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
                Jumlah sampah ({selectedWaste.unit})
              </span>
              <span className="relative block">
                <input
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={wasteQty}
                  onChange={(event) => setWasteQty(event.target.value)}
                  placeholder="Contoh: 3"
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3.5 pr-20 text-sm font-medium text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  {selectedWaste.unit}
                </span>
              </span>
            </label>
          </div>
        )}

        {/* Estimation Display */}
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3.5">
          <div>
            <p className="text-xs font-medium text-slate-500">Estimasi emisi karbon</p>
            <p className="mt-0.5 text-xs text-slate-400">{getRateDescription()}</p>
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
          loading={isSaving}
          disabled={isSaving}
          className="mt-5 w-full gap-2 shadow-lg shadow-emerald-700/20"
        >
          {!isSaving && <Plus size={18} />}
          {isSaving ? 'Menyimpan...' : 'Hitung & Simpan Log'}
        </Button>
      </form>

      <EcoTips />
    </div>
  );
}
