import { useState } from 'react';
import {
  X,
  Share2,
  Sparkles,
  Check,
  Copy,
  Leaf,
  Shield,
  Flame,
  TreePine,
} from 'lucide-react';
import { formatAmount, getTreeLevel } from '../../lib/utils';
import Button from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';

export default function GreenCardModal({
  isOpen,
  onClose,
  userName = 'Pejuang Hijau',
  totalSaved = 0,
  streakDays = 1,
  totalLogs = 0,
}) {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  if (!isOpen) return null;

  const treeInfo = getTreeLevel(totalSaved);

  const shareText = `🌿 Rapor Aksi Hijau Saya di JejakHijau!
━━━━━━━━━━━━━━━━━━
👤 Pejuang: ${userName}
🌳 Status Pohon: ${treeInfo.emoji} ${treeInfo.name}
🛡️ Emisi Ditekan: ${formatAmount(totalSaved)} kg CO₂
🔥 Streak Konsisten: ${streakDays} Hari
📊 Catatan Aksi: ${totalLogs} Aktivitas

Langkah kecil bersama JejakHijau untuk bumi yang lebih lestari. Yuk hitung jejak karbonmu di jejakhijau.vercel.app! #JejakHijau #Sustainability`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      addToast('Teks rapor berhasil disalin! Siap dibagikan ke medsos 📋', 'success');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      addToast('Gagal menyalin teks.', 'error');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Rapor Hijau JejakHijau',
          text: shareText,
          url: window.location.origin,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 p-6 text-white shadow-2xl ring-1 ring-white/10 sm:p-7">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="mb-5 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <Sparkles size={16} />
          </span>
          <div>
            <h3 className="text-base font-bold text-white">Kartu Prestasi Hijau</h3>
            <p className="text-xs text-slate-400">Bagikan aksimu ke media sosial</p>
          </div>
        </div>

        {/* Visual Shareable Card (Spotify Wrapped Style) */}
        <div
          id="green-card-preview"
          className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-6 text-center shadow-xl"
        >
          {/* Ambient Decorative Blurs */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-500/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-teal-500/20 blur-2xl" />

          {/* Card Top Brand */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500 text-slate-950">
                <Leaf size={16} strokeWidth={2.5} />
              </span>
              <span className="text-sm font-black tracking-tight text-white">
                Jejak<span className="text-emerald-400">Hijau</span>
              </span>
            </div>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
              RAPOR 2026
            </span>
          </div>

          {/* Center Tree Avatar & Level */}
          <div className="my-6">
            <div className="relative mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-500/30 ring-4 ring-emerald-500/40 shadow-inner">
              <span className="text-5xl animate-float">{treeInfo.emoji}</span>
            </div>
            <h4 className="mt-3 text-lg font-black text-white">{userName}</h4>
            <p className="text-xs font-semibold text-emerald-400">
              Peringkat: {treeInfo.name}
            </p>
          </div>

          {/* 3 Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 border-t border-b border-white/10 py-3 my-4">
            <div className="rounded-xl bg-white/5 p-2">
              <span className="mx-auto block text-emerald-400 mb-1">
                <Shield size={14} className="mx-auto" />
              </span>
              <p className="text-xs font-black text-white">{formatAmount(totalSaved)} kg</p>
              <p className="text-[9px] text-slate-400 font-medium">Emisi Ditekan</p>
            </div>
            <div className="rounded-xl bg-white/5 p-2">
              <span className="mx-auto block text-amber-400 mb-1">
                <Flame size={14} className="mx-auto" />
              </span>
              <p className="text-xs font-black text-white">{streakDays} Hari</p>
              <p className="text-[9px] text-slate-400 font-medium">Streak</p>
            </div>
            <div className="rounded-xl bg-white/5 p-2">
              <span className="mx-auto block text-teal-400 mb-1">
                <TreePine size={14} className="mx-auto" />
              </span>
              <p className="text-xs font-black text-white">{totalLogs}</p>
              <p className="text-[9px] text-slate-400 font-medium">Aksi Tercatat</p>
            </div>
          </div>

          {/* Card Slogan & Watermark */}
          <p className="text-[11px] italic text-slate-300 px-2">
            &ldquo;Satu langkah kecil hari ini, napas segar untuk bumi esok hari.&rdquo;
          </p>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>#PahlawanBumi</span>
            <span>jejakhijau.vercel.app</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleCopyText}
            className="w-full gap-2 text-xs bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
          >
            {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
            {copied ? 'Tersalin!' : 'Salin Teks'}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleNativeShare}
            className="w-full gap-2 text-xs bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30"
          >
            <Share2 size={15} />
            Bagikan Medsos
          </Button>
        </div>
      </div>
    </div>
  );
}
