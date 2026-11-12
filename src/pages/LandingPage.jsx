import { Link } from 'react-router-dom';
import {
  Leaf,
  ArrowRight,
  Shield,
  Zap,
  BarChart3,
  TreePine,
  Users,
  Target,
  ChevronRight,
  Globe,
  Sparkles,
} from 'lucide-react';

export default function LandingPage() {
  const scrollToFeatures = (e) => {
    e.preventDefault();
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: Zap,
      title: 'Kalkulator Karbon',
      description: 'Hitung emisi dari transportasi & listrik dalam hitungan detik dengan kalkulasi akurat.',
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      icon: BarChart3,
      title: 'Dashboard Real-time',
      description: 'Pantau jejak karbonmu dengan grafik interaktif mingguan dan metrik yang informatif.',
      color: 'bg-teal-100 text-teal-700',
    },
    {
      icon: Target,
      title: 'Tantangan Hijau',
      description: 'Ikuti tantangan ramah lingkungan untuk membangun kebiasaan baik dan dapatkan poin.',
      color: 'bg-amber-100 text-amber-700',
    },
    {
      icon: TreePine,
      title: 'Pohon Virtual',
      description: 'Tanam pohon virtual sebagai reward atas konsistensimu menjaga batas emisi harian.',
      color: 'bg-green-100 text-green-700',
    },
    {
      icon: Users,
      title: 'Leaderboard',
      description: 'Bersaing secara sehat dengan pengguna lain untuk menjadi pejuang paling hijau.',
      color: 'bg-sky-100 text-sky-700',
    },
    {
      icon: Shield,
      title: 'Keamanan Data',
      description: 'Data pribadimu aman dengan enkripsi modern dan tersimpan terlindungi di cloud.',
      color: 'bg-indigo-100 text-indigo-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-emerald-50 to-teal-100 text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Decorative background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-300/30 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-teal-300/30 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25">
              <Leaf size={22} strokeWidth={2.5} />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Jejak<span className="text-emerald-700">Hijau</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-white/60 hover:text-emerald-700"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white shadow-md shadow-emerald-700/20 transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/25"
            >
              <span>Daftar</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/80 px-4 py-1.5 text-xs font-bold text-emerald-800 shadow-sm backdrop-blur-md">
            <Sparkles size={14} className="text-emerald-600" />
            <span className="tracking-wide">LANGKAH KECIL, DAMPAK BESAR</span>
          </div>

          <h1 className="mt-8 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl sm:leading-[1.15]">
            Lacak jejak karbonmu untuk masa depan yang lebih hijau
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base font-normal leading-relaxed text-slate-600 sm:text-lg">
            Kenali jejak karbonmu, bangun kebiasaan yang lebih baik, dan rawat bumi mulai dari hari ini dengan pemantauan emisi harian yang mudah dan menyenangkan.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-emerald-700/25 transition duration-200 hover:bg-emerald-800 sm:w-auto"
            >
              <span>Mulai Sekarang — Gratis</span>
              <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              onClick={scrollToFeatures}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-7 py-3.5 text-base font-bold text-slate-700 shadow-sm backdrop-blur-md transition duration-200 hover:bg-white hover:text-emerald-700 sm:w-auto"
            >
              <span>Pelajari Lebih Lanjut</span>
            </a>
          </div>

          {/* Stats Row */}
          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-xl shadow-emerald-900/[0.05] backdrop-blur-xl">
              <p className="text-3xl font-black text-emerald-700 sm:text-4xl">1,200+</p>
              <p className="mt-1 text-sm font-semibold text-slate-600">Pengguna Aktif</p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-xl shadow-emerald-900/[0.05] backdrop-blur-xl">
              <p className="text-3xl font-black text-teal-700 sm:text-4xl">50K+</p>
              <p className="mt-1 text-sm font-semibold text-slate-600">Log Tercatat</p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/65 p-6 shadow-xl shadow-emerald-900/[0.05] backdrop-blur-xl">
              <p className="text-3xl font-black text-emerald-800 sm:text-4xl">10K+ kg</p>
              <p className="mt-1 text-sm font-semibold text-slate-600">CO₂ Dikurangi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800">
              FITUR UNGGULAN
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Semua yang Kamu Butuhkan untuk Hidup Ramah Lingkungan
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
              Pantau emisi, ubah gaya hidup, dan nikmati prosesnya bersama komunitas yang peduli terhadap kelestarian lingkungan.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-white/70 bg-white/65 p-7 shadow-xl shadow-emerald-900/[0.05] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/[0.08]"
                >
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl ${feature.color} shadow-sm`}>
                    <Icon size={24} />
                  </span>
                  <h3 className="mt-5 text-xl font-extrabold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 p-8 shadow-2xl shadow-emerald-900/20 sm:p-14 text-white text-center sm:text-left relative">
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10 flex flex-col items-center justify-between gap-8 sm:flex-row">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                <Globe size={14} /> Komunitas Hijau
              </span>
              <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-4xl">
                Bergabung dengan komunitas hijau sekarang
              </h2>
              <p className="mt-3 text-sm text-emerald-100 sm:text-base leading-relaxed">
                Mulai dari satu langkah hari ini untuk mewujudkan lingkungan yang lebih sehat bagi generasi mendatang. Gratis tanpa biaya apapun.
              </p>
            </div>
            <Link
              to="/register"
              className="shrink-0 rounded-2xl bg-white px-7 py-4 text-base font-bold text-emerald-800 shadow-xl transition duration-200 hover:bg-emerald-50 hover:shadow-2xl"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-white/50 backdrop-blur-md py-8 text-center">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-600 text-white">
              <Leaf size={16} />
            </span>
            <span className="font-extrabold text-slate-800">JejakHijau</span>
          </div>
          <p className="text-xs text-slate-500">
            Dibuat dengan ♥ untuk bumi yang lebih hijau. &copy; {new Date().getFullYear()} JejakHijau. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
