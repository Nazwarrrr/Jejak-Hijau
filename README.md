# 🌿 JejakHijau — Track Your Footprint for a Greener Future

> Aplikasi pelacak jejak karbon harian, pembangun kebiasaan hijau, dan gamifikasi konservasi bumi berbasis **React 19**, **Tailwind CSS 4**, dan **Supabase**.

![JejakHijau Banner](https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80)

---

## ✨ Fitur Unggulan

- ⚡ **Kalkulator Emisi Karbon Real-time**: Hitung emisi dari transportasi (Motor, Mobil Bensin, Mobil Listrik, Bus, Kereta) dan pemakaian listrik rumah tangga (kWh).
- 📊 **Dashboard Interaktif**: Visualisasi batas harian, progress bar adaptif, kartu statistik cerdas, dan grafik batang 7 hari terakhir (Recharts).
- 🔐 **Autentikasi & Keamanan (Supabase Auth)**:
  - Registrasi, Login, dan Logout berbasis sesi aman.
  - Row Level Security (RLS) PostgreSQL memastikan setiap pengguna hanya dapat membaca & menulis datanya sendiri.
  - **Offline/Demo Fallback**: Tetap dapat digunakan langsung tanpa Supabase (menggunakan storage lokal terenkripsi di browser).
- 🌳 **Gamifikasi Pohon Virtual**: Akumulasi pengurangan emisi karbon mengubah benih harapan menjadi tunas, semak, pohon muda, hingga pohon rindang!
- 🏆 **Eco Challenges (Tantangan Ramah Lingkungan)**: Ikuti misi harian/mingguan seperti *Tanpa Mobil*, *Bersepeda ke Kantor*, *Hemat Listrik 20%*, dan kumpulkan poin hijau.
- 👑 **Leaderboard Pahlawan Hijau**: Papan peringkat mingguan, bulanan, dan sepanjang masa dengan podium 3 besar (Emas, Perak, Perunggu) dan pencarian instan.
- 🎖️ **Sistem Prestasi (Badges & Achievements)**: Raih lencana pencapaian seperti *Langkah Pertama*, *Konsisten Seminggu*, *Penjaga Batas*, dan *Hutan Kecil*.
- 🍞 **Sistem Toast Notifikasi**: Umpan balik real-time yang elegan untuk setiap aksi kalkulasi, pendaftaran, dan update profil.
- 💎 **Desain Glassmorphism Nature-Inspired**: Nuansa kaca transparan (`backdrop-blur`), palet emerald-teal alami, mikro-animasi halus, dan responsif di semua perangkat.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router DOM v7, Vite 8
- **Styling**: Tailwind CSS v4, Lucide React (Icons)
- **Visualisasi Data**: Recharts 3
- **Backend & Database**: Supabase (PostgreSQL 15+, Supabase Auth, Row Level Security)
- **Deployment**: Vercel (SPA rewrite rules & asset edge caching)

---

## 📁 Struktur Direktori

```
jejakhijau/
├── public/                 # Static assets & icons
├── src/
│   ├── components/
│   │   ├── dashboard/      # CarbonCalculator, DailyProgress, RecentLogs, StatsCards, WeeklyChart, EcoTips
│   │   ├── layout/         # Header, ProtectedRoute
│   │   └── ui/             # Badge, Button, Card, Input, LoadingSkeleton
│   ├── contexts/
│   │   ├── AuthContext.jsx # Global Auth state (Supabase + localStorage fallback)
│   │   └── ToastContext.jsx# Global Toast Notification system
│   ├── hooks/
│   │   ├── useAuth.js      # Auth consumer hook
│   │   ├── useCarbonLogs.js# Carbon logs sync hook (Supabase/Local)
│   │   ├── useProfile.js   # User profile management hook
│   │   └── useToast.js     # Toast trigger hook
│   ├── lib/
│   │   ├── constants.js    # Emission factors, vehicles, challenges, badges
│   │   ├── supabase.js     # Supabase client singleton
│   │   └── utils.js        # Formatting, date helpers, virtual tree level
│   ├── pages/
│   │   ├── ChallengesPage.jsx # Eco challenges dashboard
│   │   ├── DashboardPage.jsx  # Main user dashboard
│   │   ├── LandingPage.jsx    # Hero & marketing page
│   │   ├── LeaderboardPage.jsx# Global carbon hero rankings
│   │   ├── LoginPage.jsx      # Authentication login form
│   │   ├── ProfilePage.jsx    # Profile, achievements & settings
│   │   └── RegisterPage.jsx   # New user registration
│   ├── App.jsx             # Root Router & Providers
│   ├── index.css           # Tailwind 4 & custom keyframes
│   └── main.jsx            # React 19 entrypoint
├── supabase-schema.sql     # Complete Supabase DDL, RLS & triggers
├── vercel.json             # Vercel deployment configuration
├── .env.example            # Environment variables template
└── package.json
```

---

## 🚀 Panduan Menjalankan Lokal

### 1. Kloning & Instal Dependensi

```bash
git clone https://github.com/Nazwarrrr/Jejak-Hijau.git
cd jejakhijau
npm install
```

### 2. Jalankan Mode Development

```bash
npm run dev
```

Buka peramban di `http://localhost:5173`. Aplikasi langsung dapat digunakan dalam mode **Local Demo/Offline** tanpa konfigurasi database tambahan!

---

## 🗄️ Menghubungkan ke Supabase (Database Nyata)

### 1. Buat Proyek Supabase
1. Buka [database.new](https://database.new) dan buat proyek baru.
2. Catat **Project URL** dan **anon / public key** dari menu *Project Settings > API*.

### 2. Eksekusi Skema SQL
1. Masuk ke menu **SQL Editor** di dashboard Supabase Anda.
2. Salin seluruh isi berkas [`supabase-schema.sql`](./supabase-schema.sql) pada repositori ini.
3. Klik **Run**. Skrip akan otomatis membuat:
   - Tabel `profiles` & trigger otomatis pembuatan profil saat pendaftaran akun.
   - Tabel `carbon_logs` untuk mencatat emisi per aktivitas.
   - Tabel `user_challenges` untuk melacak status tantangan hijau.
   - View `leaderboard_weekly` untuk kalkulasi peringkat mingguan.
   - Kebijakan **Row Level Security (RLS)** untuk proteksi data setiap pengguna.

### 3. Konfigurasi File Lingkungan (.env)
Buat berkas `.env` di direktori utama:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Restart server development (`npm run dev`). Aplikasi kini sepenuhnya tersinkronisasi ke PostgreSQL Supabase secara real-time!

---

## ☁️ Panduan Deploy ke Vercel

Proyek ini telah dilengkapi dengan [`vercel.json`](./vercel.json) yang menangani SPA routing fallback dan asset caching.

### Cara 1: Vercel Dashboard (Rekomendasi)
1. Push kode terbaru Anda ke GitHub/GitLab.
2. Buka [vercel.com](https://vercel.com) dan pilih **Add New Project**.
3. Import repositori **Jejak-Hijau**.
4. Di bagian **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL` = URL Supabase Anda
   - `VITE_SUPABASE_ANON_KEY` = Anon Key Supabase Anda
5. Klik **Deploy**!

### Cara 2: Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 🧪 Pengujian & Standar Kualitas

Proyek ini telah divalidasi dan memenuhi standar:
```bash
# Linter check (0 errors, 0 warnings)
npm run lint

# Production build test
npm run build
```

---

## 📄 Lisensi

Dibuat dengan kepedulian untuk bumi yang lebih hijau 🌱
MIT License © 2026 JejakHijau Team.
