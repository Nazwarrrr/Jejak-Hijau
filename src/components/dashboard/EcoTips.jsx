import { useState, useEffect } from 'react';
import {
  Zap,
  Lightbulb,
  Bus,
  Recycle,
  ShoppingBag,
  ChefHat,
  RefreshCw,
} from 'lucide-react';
import { ECO_FACTS } from '../../lib/constants';

const iconMap = {
  Zap,
  Lightbulb,
  Bus,
  Recycle,
  ShoppingBag,
  ChefHat,
};

export default function EcoTips() {
  const [currentIndex, setCurrentIndex] = useState(() =>
    ECO_FACTS.length > 0 ? Math.floor(Math.random() * ECO_FACTS.length) : 0
  );

  useEffect(() => {
    if (ECO_FACTS.length <= 1) return undefined;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ECO_FACTS.length);
    }, 12000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    if (ECO_FACTS.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ECO_FACTS.length);
  };

  if (ECO_FACTS.length === 0) return null;

  const currentTip = ECO_FACTS[currentIndex] || ECO_FACTS[0];
  const IconComponent = iconMap[currentTip.icon] || Zap;

  return (
    <div className="mt-6 flex flex-1 flex-col justify-center rounded-2xl border border-teal-100/70 bg-gradient-to-br from-teal-50/90 to-emerald-50/70 p-5 sm:min-h-40 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-teal-800">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/80 text-teal-700 shadow-sm">
            <Zap size={16} />
          </span>
          <span className="text-xs font-extrabold uppercase tracking-[0.12em]">Fakta menarik</span>
        </div>
        <span className="rounded-full border border-teal-200/70 bg-white/70 px-2.5 py-1 text-[10px] font-bold text-teal-700">
          {currentTip.category}
        </span>
      </div>

      <div key={currentIndex} className="mt-5 flex items-start gap-4 animate-fade-in-up">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100">
          <IconComponent size={23} strokeWidth={1.8} />
        </span>
        <p aria-live="polite" className="text-sm font-medium leading-6 text-slate-700 sm:text-base">
          {currentTip.text}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex gap-1.5" aria-label={`Fakta ${currentIndex + 1} dari ${ECO_FACTS.length}`}>
          {ECO_FACTS.map((fact, index) => (
            <span
              key={fact.category + fact.text}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-6 bg-teal-600' : 'w-1.5 bg-teal-200'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={handleNext}
          className="pressable inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-teal-700 hover:bg-white/70 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          aria-label="Tampilkan fakta menarik berikutnya"
        >
          <RefreshCw size={13} />
          Fakta berikutnya
        </button>
      </div>
    </div>
  );
}
