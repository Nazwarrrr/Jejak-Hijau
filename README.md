<div align="center">

  # 🌿 JejakHijau
  ### *Track Your Footprint for a Greener Future*

  [![React](https://img.shields.io/badge/React-19.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-8.3.7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![Vercel](https://img.shields.io/badge/Vercel-Deployment_Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

  <p align="center">
    <strong>Aplikasi web pelacak jejak karbon harian, pembangun kebiasaan ramah lingkungan, dan gamifikasi konservasi bumi berbasis Cloud PostgreSQL & React.</strong>
  </p>

  <p align="center">
    <a href="#-tentang-proyek">Tentang Proyek</a> •
    <a href="#-fitur-utama">Fitur Utama</a> •
    <a href="#-teknologi-yang-digunakan">Teknologi</a> •
    <a href="#-struktur-direktori">Struktur</a> •
    <a href="#-panduan-instalasi-lokal">Instalasi</a> •
    <a href="#-konfigurasi-supabase">Supabase</a> •
    <a href="#-deploy-ke-vercel">Deploy ke Vercel</a>
  </p>

  ![JejakHijau Banner](https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80)

</div>

---

## 📖 Tentang Proyek

**JejakHijau** lahir dari kesadaran bahwa perubahan iklim global bermula dari tindakan sehari-hari kita. Seringkali masyarakat tidak menyadari seberapa besar emisi gas rumah kaca ($CO_2$) yang dihasilkan dari perjalanan harian atau penggunaan listrik di rumah.

JejakHijau hadir sebagai solusi modern yang:
1. **Mengukur**: Memberikan kalkulator emisi instan yang akurat untuk transportasi dan energi.
2. **Memantau**: Menyajikan visualisasi dashboard interaktif dengan batas emisi harian yang fleksibel.
3. **Mengedukasi & Memotivasi**: Menggunakan gamifikasi **Pohon Virtual**, **Tantangan Hijau (Eco Challenges)**, dan **Papan Peringkat (Leaderboard)** agar menjaga bumi terasa menyenangkan, kompetitif, dan bermakna.

---

## ✨ Fitur Utama

### 1. ⚡ Kalkulator Emisi Karbon Real-time
Menghitung estimasi pelepasan karbon secara langsung berdasarkan faktor emisi terstandarisasi:
- **Moda Transportasi**:
  - Motor (Roda Dua) — $0.10 \text{ kg } CO_2\text{/km}$
  - Mobil Bensin — $0.20 \text{ kg } CO_2\text{/km}$
  - Mobil Listrik (EV) — $0.05 \text{ kg } CO_2\text{/km}$
  - Bus / Angkutan Umum — $0.06 \text{ kg } CO_2\text{/km}$
  - Kereta Api (KRL/LRT) — $0.04 \text{ kg } CO_2\text{/km}$
- **Konsumsi Energi Listrik**:
  - Pemakaian listrik rumah tangga — $0.85 \text{ kg } CO_2\text{/kWh}$

### 2. 📊 Dashboard Interaktif & Riwayat Aktivitas
- **Batas Harian (Daily Limit)**: Pengguna dapat menyesuaikan target batas maksimal karbon harian (default $5.0 \text{ kg } CO_2$).
- **Progress Bar Adaptif**: Berubah warna dari hijau (*Aman*) menjadi merah mawar (*Batas Terlampaui*) jika kuota emisi harian habis.
- **Grafik Tren 7 Hari Terakhir**: Visualisasi batang interaktif berbasis Recharts dengan penanda khusus untuk hari ini (*today highlight*) dan tooltip glassmorphism.
- **Kartu Statistik**: Total emisi hari ini, total emisi minggu ini, jumlah hari beruntun (*streak*), dan status pohon virtual.
- **Riwayat Terbaru**: Daftar log aktivitas terbaru dengan icon kendaraan/energi kontekstual, waktu pencatatan, dan fitur hapus log.

### 3. 🌳 Gamifikasi Pohon Virtual (Virtual Forest)
Setiap kali pengguna berhasil menekan emisi di bawah batas harian, akumulasi penghematan karbon akan menumbuhkan pohon virtual:
- 🫘 **Level 1 — Biji Harapan**: Awal mula komitmen hijau ($< 5 \text{ kg}$ hemat).
- 🌱 **Level 2 — Tunas Baru**: Mulai terbentuk kebiasaan baik ($5 - 19 \text{ kg}$ hemat).
- 🌿 **Level 3 — Semak Hijau**: Konsistensi nyata ($20 - 49 \text{ kg}$ hemat).
- 🌲 **Level 4 — Pohon Muda**: Dampak signifikan bagi lingkungan ($50 - 99 \text{ kg}$ hemat).
- 🌳 **Level 5 — Pohon Rindang**: Pahlawan konservasi sejati ($\ge 100 \text{ kg}$ hemat).

### 4. 🏆 Tantangan Ramah Lingkungan (Eco Challenges)
Misi harian dan mingguan untuk membiasakan gaya hidup rendah emisi:
- *Tanpa Mobil*: Beraktivitas seharian tanpa kendaraan roda empat pribadi (+50 Poin).
- *Bersepeda ke Kantor*: Gunakan sepeda kayuh (+30 Poin).
- *Hemat Listrik*: Tekan pemakaian daya rumah hingga 20% selama 7 hari (+100 Poin).
- *Naik Angkutan Umum*: Gunakan bus/kereta selama 5 hari (+80 Poin).
- *Hari Tanpa Emisi*: Capai $0 \text{ kg } CO_2$ seharian penuh (+150 Poin).

### 5. 👑 Papan Peringkat Global (Pahlawan Hijau)
- Filter rentang waktu: **Minggu Ini**, **Bulan Ini**, dan **Sepanjang Masa**.
- **Podium Juara Tiga Besar**: Tampilan kartu visual khusus untuk Juara 1 (Mahkota Emas), Juara 2 (Medali Perak), dan Juara 3 (Medali Perunggu).
- **Pencarian Nama Cepat**: Cari teman atau komunitas sesama pejuang lingkungan secara instan.
- **Sorotan Akun**: Posisi akun kamu otomatis di-highlight dengan bingkai hijau emerald.

### 6. 🎖️ Sistem Lencana & Prestasi (Badges)
- *Langkah Pertama*: Mencatat aktivitas pertama.
- *Konsisten Seminggu*: Login 7 hari berturut-turut.
- *Penjaga Batas*: Di bawah batas harian selama 3 hari berturut-turut.
- *Penghijauan Pertama*: Menanam 1 pohon virtual pertama.
- *Pencatat Ulung*: Mencatat 50 aktivitas emisi.
- *Hutan Kecil*: Berhasil menumbuhkan 10 pohon virtual.

### 7. 🔐 Autentikasi Fleksibel (Supabase + Offline Fallback)
- **Mode Cloud Supabase**: Terhubung ke database PostgreSQL dan otentikasi Supabase dengan perlindungan data pengguna berbasis *Row Level Security (RLS)*.
- **Mode Demo / Offline**: Jika API key Supabase belum dimasukkan, aplikasi **tetap berfungsi 100%** menggunakan mock storage lokal browser tanpa error.

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi | Alasan Pemilihan |
|---|---|---|
| **Library UI** | [React 19](https://react.dev/) | Versi terbaru React dengan performa rendering optimal dan arsitektur hook modern. |
| **Build Tool** | [Vite 8](https://vitejs.dev/) + [Rolldown](https://rolldown.rs/) | Kompilasi super cepat, Hot Module Replacement (HMR) instan, dan optimasi chunk otomatis. |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Engine CSS terbaru dengan performa tinggi, utility classes ringkas, dan integrasi `@import "tailwindcss"`. |
| **Ikonografi** | [Lucide React](https://lucide.dev/) | Set ikon SVG modern yang konsisten, bersih, dan berbobot ringan. |
| **Visualisasi Data** | [Recharts 3](https://recharts.org/) | Grafik batang deklaratif dan responsif yang mendukung transisi serta animasi halus. |
| **Routing** | [React Router DOM v7](https://reactrouter.com/) | Manajemen multi-page SPA dengan perlindungan rute terautentikasi (`ProtectedRoute`). |
| **Backend & DB** | [Supabase](https://supabase.com/) | Backend-as-a-Service berbasis PostgreSQL, auth bawaan yang aman, dan Row Level Security (RLS). |
| **Hosting & CDN** | [Vercel](https://vercel.com/) | Deployment otomatis dengan CDN global, edge caching untuk static asset, dan dukungan rewrite SPA. |

---

## 📁 Struktur Direktori

```
jejakhijau/
├── public/                     # Aset statis (favicon, SVG icons)
├── src/
│   ├── components/
│   │   ├── dashboard/          # Modul fungsional dashboard
│   │   │   ├── CarbonCalculator.jsx  # Form input & kalkulasi emisi
│   │   │   ├── DailyProgress.jsx     # Bar batas emisi harian
│   │   │   ├── EcoTips.jsx           # Tips ramah lingkungan dinamis
│   │   │   ├── RecentLogs.jsx        # Daftar aktivitas terbaru
│   │   │   ├── StatsCards.jsx        # Kartu ringkasan statistik & pohon
│   │   │   └── WeeklyChart.jsx       # Grafik tren emisi Recharts
│   │   ├── layout/             # Komponen tata letak global
│   │   │   ├── Header.jsx            # Navigasi sticky & menu mobile
│   │   │   └── ProtectedRoute.jsx    # Guard halaman khusus member
│   │   └── ui/                 # Komponen dasar (Design System)
│   │       ├── Badge.jsx             # Label pill serbaguna
│   │       ├── Button.jsx            # Tombol dengan loading state
│   │       ├── Card.jsx              # Kontainer Glassmorphism
│   │       ├── Input.jsx             # Form input dengan suffix unit
│   │       └── LoadingSkeleton.jsx   # Indikator loading halus
│   ├── contexts/               # State management global
│   │   ├── AuthContext.jsx           # State otentikasi & profil user
│   │   └── ToastContext.jsx          # Sistem notifikasi toast
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useAuth.js                # Akses context autentikasi
│   │   ├── useCarbonLogs.js          # Sinkronisasi & kalkulasi data emisi
│   │   ├── useProfile.js             # Pengaturan profil & daily limit
│   │   └── useToast.js               # Trigger toast notifikasi
│   ├── lib/                    # Library pembantu & konfigurasi
│   │   ├── constants.js              # Faktor emisi, moda kendaraan, badges
│   │   ├── supabase.js               # Supabase Client singleton
│   │   └── utils.js                  # Helper tanggal, mata uang, kalkulasi level
│   ├── pages/                  # Halaman aplikasi
│   │   ├── ChallengesPage.jsx        # Halaman tantangan hijau
│   │   ├── DashboardPage.jsx         # Halaman dashboard utama
│   │   ├── LandingPage.jsx           # Halaman beranda promosi
│   │   ├── LeaderboardPage.jsx       # Halaman papan peringkat pahlawan
│   │   ├── LoginPage.jsx             # Halaman masuk akun
│   │   ├── ProfilePage.jsx           # Halaman profil & pengaturan akun
│   │   └── RegisterPage.jsx          # Halaman pendaftaran baru
│   ├── App.jsx                 # Provider wrapper & konfigurasi rute
│   ├── index.css               # Styling global & Tailwind 4 setup
│   └── main.jsx                # Entrypoint aplikasi React
├── supabase-schema.sql         # Skrip DDL PostgreSQL, RLS & triggers Supabase
├── vercel.json                 # Konfigurasi routing & caching Vercel
├── .env.example                # Template variabel lingkungan
└── package.json
```

---

## 🚀 Panduan Instalasi Lokal

### 1. Kloning Repositori
```bash
git clone https://github.com/Nazwarrrr/Jejak-Hijau.git
cd jejakhijau
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Jalankan Server Development
```bash
npm run dev
```
Aplikasi akan aktif di `http://localhost:5173`. Kamu bisa langsung mencoba seluruh fitur dalam mode demo lokal!

---

## 🗄️ Konfigurasi Supabase (Database Produksi)

Jika kamu ingin menghubungkan ke database PostgreSQL nyata:

### 1. Buat Proyek Supabase
1. Daftar atau masuk ke [Supabase Dashboard](https://supabase.com/dashboard).
2. Buat proyek baru dengan nama `Jejak-Hijau`.
3. Buka menu **Project Settings > API** dan salin:
   - **Project URL**
   - **anon / public key**

### 2. Jalankan Skema Database
1. Buka menu **SQL Editor** di dashboard Supabase kamu.
2. Buka berkas [`supabase-schema.sql`](./supabase-schema.sql) pada repositori ini, salin seluruh kodenya, dan tempel ke SQL Editor.
3. Klik tombol **Run**. Skrip dapat dijalankan ulang dan otomatis menyusun:
   - Tabel `profiles`: Menyimpan nama, batas emisi, poin, dan jumlah pohon.
   - Tabel `carbon_logs`: Menyimpan aktivitas transportasi/listrik dengan validasi data.
   - Tabel `user_challenges`: Melacak status tantangan pengguna.
   - View `leaderboard_weekly`, `leaderboard_monthly`, dan `leaderboard_all_time`: Menghitung peringkat berdasarkan emisi pada periode aktual.
   - **Row Level Security (RLS)**: Menjamin data log hanya bisa dibaca dan diubah oleh pemiliknya sendiri.
   - Trigger otomatis untuk sinkronisasi profil saat user baru mendaftar via Supabase Auth.

Jika proyek Supabase sudah pernah disiapkan, jalankan ulang `supabase-schema.sql` agar view leaderboard bulanan dan sepanjang masa tersedia. Kebijakan RLS pada skrip akan dibuat ulang dengan aman.

### 3. Set Variabel Lingkungan (.env)
Buat berkas `.env` di direktori utama:
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
Restart server dengan `npm run dev`. Aplikasi kini terhubung langsung ke database cloud. Jika konfirmasi email diaktifkan pada Supabase Auth, pengguna harus membuka tautan verifikasi sebelum masuk.

---

## ☁️ Deploy ke Vercel

Repositori ini sudah dilengkapi [`vercel.json`](./vercel.json) sehingga siap dideploy dalam hitungan menit tanpa masalah rute 404.

### Opsi 1: Melalui Dashboard Vercel (Paling Mudah)
1. Buka [Vercel](https://vercel.com) dan login dengan akun GitHub kamu.
2. Klik **Add New Project** lalu pilih repositori **`Nazwarrrr/Jejak-Hijau`**.
3. Di panel **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL`: URL project Supabase kamu.
   - `VITE_SUPABASE_ANON_KEY`: Anon Key Supabase kamu.
4. Klik **Deploy**. Selesai!

### Opsi 2: Menggunakan Vercel CLI
```bash
# Instal CLI Vercel jika belum ada
npm install -g vercel

# Login dan jalankan deployment
vercel
```

---

## 📜 Perintah yang Tersedia (NPM Scripts)

```bash
# Menjalankan server lokal pengembangan
npm run dev

# Membangun bundle produksi (Production Build)
npm run build

# Menjalankan pengecekan linter kode (ESLint)
npm run lint

# Meninjau hasil build lokal
npm run preview
```

---

## 🤝 Kontribusi

Kontribusi selalu terbuka untuk siapa saja yang peduli terhadap kelestarian lingkungan dan pengembangan software open-source!
1. Fork repositori ini
2. Buat branch fitur baru (`git checkout -b fitur/FiturKeren`)
3. Commit perubahan kamu (`git commit -m 'feat: menambahkan fitur keren'`)
4. Push ke branch kamu (`git push origin fitur/FiturKeren`)
5. Buka sebuah Pull Request

---

## 📄 Lisensi

Didistribusikan di bawah Lisensi **MIT**. Lihat berkas `LICENSE` untuk informasi selengkapnya.

<div align="center">
  <p>Dibuat dengan kepedulian untuk bumi yang lebih hijau 🌍💚</p>
  <p>© 2026 <strong>JejakHijau Team</strong></p>
</div>
