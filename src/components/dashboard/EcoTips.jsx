import { useState, useEffect } from 'react';
import {
  Zap,
  Lightbulb,
  Bus,
  Bike,
  TreePine,
  ShoppingBag,
  Thermometer,
  Footprints,
  ChefHat,
  RefreshCw,
} from 'lucide-react';
import { ECO_TIPS } from '../../lib/constants';

const iconMap = {
  Zap,
  Lightbulb,
  Bus,
  Bike,
  TreePine,
  ShoppingBag,
  Thermometer,
  Footprints,
  ChefHat,
};

export default function EcoTips() {
  const [currentIndex, setCurrentIndex] = useState(() =>
    ECO_TIPS.length > 0 ? Math.floor(Math.random() * ECO_TIPS.length) : 0
  );

  useEffect(() => {
    if (!ECO_TIPS || ECO_TIPS.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ECO_TIPS.length);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    if (!ECO_TIPS || ECO_TIPS.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ECO_TIPS.length);
  };

  if (!ECO_TIPS || ECO_TIPS.length === 0) return null;

  const currentTip = ECO_TIPS[currentIndex] || ECO_TIPS[0];
  const IconComponent = iconMap[currentTip.icon] || Zap;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-teal-100/70 bg-teal-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3 sm:items-center">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-700">
          <IconComponent size={19} />
        </span>
        <p className="text-xs leading-5 text-teal-900/90 sm:text-sm">
          <span className="font-bold text-teal-950">Tahukah kamu? </span>
          {currentTip.text}
        </p>
      </div>
      <button
        type="button"
        onClick={handleNext}
        className="inline-flex shrink-0 items-center gap-1.5 self-end rounded-lg px-2.5 py-1.5 text-xs font-bold text-teal-700 transition hover:bg-teal-100/70 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 sm:self-center"
      >
        <RefreshCw size={13} />
        Tip berikutnya
      </button>
    </div>
  );
}
