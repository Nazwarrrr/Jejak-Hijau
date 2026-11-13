export const VEHICLES = [
  { value: 'motor', label: 'Motor', rate: 0.1, unit: 'km', icon: 'Bike', color: '#10b981' },
  { value: 'gasoline-car', label: 'Mobil Bensin', rate: 0.2, unit: 'km', icon: 'CarFront', color: '#f59e0b' },
  { value: 'electric-car', label: 'Mobil Listrik', rate: 0.05, unit: 'km', icon: 'Zap', color: '#3b82f6' },
  { value: 'bus', label: 'Bus / Angkot', rate: 0.06, unit: 'km', icon: 'Bus', color: '#8b5cf6' },
  { value: 'kereta', label: 'Kereta Api', rate: 0.04, unit: 'km', icon: 'Train', color: '#06b6d4' },
];

export const FOOD_ITEMS = [
  { value: 'beef', label: 'Daging Sapi (Porsi)', rate: 3.5, unit: 'porsi', icon: 'Beef', color: '#ef4444' },
  { value: 'chicken', label: 'Daging Ayam (Porsi)', rate: 0.9, unit: 'porsi', icon: 'Drumstick', color: '#f59e0b' },
  { value: 'fish', label: 'Ikan / Seafood (Porsi)', rate: 1.2, unit: 'porsi', icon: 'Fish', color: '#06b6d4' },
  { value: 'dairy', label: 'Susu / Olahan Susu (Porsi)', rate: 0.8, unit: 'porsi', icon: 'Milk', color: '#3b82f6' },
  { value: 'plant-based', label: 'Makanan Nabati / Sayur (Porsi)', rate: 0.25, unit: 'porsi', icon: 'Salad', color: '#10b981' },
];

export const WASTE_ITEMS = [
  { value: 'plastic-bag', label: 'Kantong Plastik', rate: 0.05, unit: 'kantong', icon: 'ShoppingBag', color: '#f43f5e' },
  { value: 'plastic-bottle', label: 'Botol Plastik PET', rate: 0.08, unit: 'botol', icon: 'Wine', color: '#ec4899' },
  { value: 'styrofoam', label: 'Wadah Styrofoam', rate: 0.15, unit: 'wadah', icon: 'Box', color: '#8b5cf6' },
  { value: 'food-waste', label: 'Sisa Makanan Terbuang', rate: 0.5, unit: 'kg', icon: 'Trash2', color: '#eab308' },
];

export const ELECTRICITY_RATE = 0.85;

export const DEFAULT_DAILY_LIMIT = 5.0;

export const STORAGE_KEYS = {
  LOGS: 'jejakhijau-logs',
  LIMIT: 'jejakhijau-daily-limit',
};

export const ECO_FACTS = [
  { text: 'Sisa makanan yang tertimbun di tempat pembuangan akhir dapat menghasilkan metana saat membusuk.', icon: 'Trash2', category: 'Sampah' },
  { text: 'Membersihkan dan mengeringkan kemasan sebelum didaur ulang membantu menjaga kualitas materialnya.', icon: 'Recycle', category: 'Sampah' },
  { text: 'Memakai ulang tas, botol, atau wadah membantu mengurangi kebutuhan barang sekali pakai.', icon: 'ShoppingBag', category: 'Sampah' },
  { text: 'Merencanakan porsi dan menyimpan bahan makanan dengan baik membantu mengurangi makanan terbuang.', icon: 'ChefHat', category: 'Makanan' },
  { text: 'Mematikan perangkat saat tidak digunakan dapat membantu mengurangi pemakaian listrik.', icon: 'Lightbulb', category: 'Energi' },
  { text: 'Menggabungkan beberapa tujuan dalam satu perjalanan dapat membantu mengurangi jarak tempuh.', icon: 'Bus', category: 'Transportasi' },
];

export const ACHIEVEMENTS = [
  { id: 'first-log', title: 'Langkah Pertama', description: 'Catat aktivitas pertamamu', icon: 'Sprout', threshold: 1, type: 'total_logs' },
  { id: 'streak-7', title: 'Konsisten Seminggu', description: 'Login 7 hari berturut-turut', icon: 'Flame', threshold: 7, type: 'streak' },
  { id: 'under-limit-3', title: 'Penjaga Batas', description: 'Di bawah batas harian 3 hari berturut', icon: 'ShieldCheck', threshold: 3, type: 'under_limit_streak' },
  { id: 'tree-1', title: 'Penghijauan Pertama', description: 'Tanam pohon virtual pertamamu', icon: 'TreePine', threshold: 1, type: 'trees' },
  { id: 'logs-50', title: 'Pencatat Ulung', description: 'Catat 50 aktivitas', icon: 'BarChart3', threshold: 50, type: 'total_logs' },
  { id: 'low-emission', title: 'Emisi Rendah', description: 'Total emisi harian di bawah 1 kg', icon: 'Heart', threshold: 1, type: 'low_day' },
  { id: 'tree-10', title: 'Hutan Kecil', description: 'Tanam 10 pohon virtual', icon: 'Trees', threshold: 10, type: 'trees' },
  { id: 'streak-30', title: 'Pahlawan Bulanan', description: 'Login 30 hari berturut-turut', icon: 'Trophy', threshold: 30, type: 'streak' },
];

export const ECO_CHALLENGES = [
  { id: 'no-car', title: 'Tanpa Mobil', description: 'Tidak menggunakan mobil pribadi selama 1 hari', duration: 1, points: 50, icon: 'Footprints', category: 'transportasi' },
  { id: 'bike-to-work', title: 'Bersepeda ke Kantor', description: 'Gunakan sepeda untuk pergi bekerja', duration: 1, points: 30, icon: 'Bike', category: 'transportasi' },
  { id: 'save-electricity', title: 'Hemat Listrik', description: 'Kurangi pemakaian listrik 20% dari biasanya', duration: 7, points: 100, icon: 'Lightbulb', category: 'listrik' },
  { id: 'public-transport', title: 'Naik Angkutan Umum', description: 'Gunakan transportasi umum selama 5 hari', duration: 5, points: 80, icon: 'Bus', category: 'transportasi' },
  { id: 'zero-emission-day', title: 'Hari Tanpa Emisi', description: 'Capai 0 emisi dalam 1 hari', duration: 1, points: 150, icon: 'Leaf', category: 'semua' },
  { id: 'under-limit-week', title: 'Seminggu Terjaga', description: 'Di bawah batas harian selama 7 hari', duration: 7, points: 200, icon: 'ShieldCheck', category: 'semua' },
];
