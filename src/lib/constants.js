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

export const ECO_TIPS = [
  { text: 'Memilih transportasi umum bisa mengurangi emisi hingga 80% dibanding mobil pribadi.', icon: 'Bus' },
  { text: 'Matikan lampu saat tidak digunakan — menghemat energi dan uang sekaligus!', icon: 'Lightbulb' },
  { text: 'Berjalan kaki untuk jarak dekat adalah cara termudah mengurangi jejak karbon.', icon: 'Footprints' },
  { text: 'Satu pohon dewasa menyerap sekitar 22 kg CO₂ per tahun.', icon: 'TreePine' },
  { text: 'Gunakan tas belanja sendiri. Produksi tas plastik menghasilkan 6 kg CO₂ per kg.', icon: 'ShoppingBag' },
  { text: 'Memasak di rumah menghasilkan emisi 8x lebih rendah dibanding makan di restoran.', icon: 'ChefHat' },
  { text: 'Kurangi pemakaian AC 1 jam per hari bisa menghemat 0,5 kg CO₂.', icon: 'Thermometer' },
  { text: 'Sepeda listrik hanya menghasilkan 0,02 kg CO₂ per km — 10x lebih rendah dari motor.', icon: 'Bike' },
];

export const ACHIEVEMENTS = [
  { id: 'first-log', title: 'Langkah Pertama', description: 'Catat aktivitas pertamamu', icon: '🌱', threshold: 1, type: 'total_logs' },
  { id: 'streak-7', title: 'Konsisten Seminggu', description: 'Login 7 hari berturut-turut', icon: '🔥', threshold: 7, type: 'streak' },
  { id: 'under-limit-3', title: 'Penjaga Batas', description: 'Di bawah batas harian 3 hari berturut', icon: '🛡️', threshold: 3, type: 'under_limit_streak' },
  { id: 'tree-1', title: 'Penghijauan Pertama', description: 'Tanam pohon virtual pertamamu', icon: '🌳', threshold: 1, type: 'trees' },
  { id: 'logs-50', title: 'Pencatat Ulung', description: 'Catat 50 aktivitas', icon: '📊', threshold: 50, type: 'total_logs' },
  { id: 'low-emission', title: 'Emisi Rendah', description: 'Total emisi harian di bawah 1 kg', icon: '💚', threshold: 1, type: 'low_day' },
  { id: 'tree-10', title: 'Hutan Kecil', description: 'Tanam 10 pohon virtual', icon: '🏕️', threshold: 10, type: 'trees' },
  { id: 'streak-30', title: 'Pahlawan Bulanan', description: 'Login 30 hari berturut-turut', icon: '🏆', threshold: 30, type: 'streak' },
];

export const ECO_CHALLENGES = [
  { id: 'no-car', title: 'Tanpa Mobil', description: 'Tidak menggunakan mobil pribadi selama 1 hari', duration: 1, points: 50, icon: '🚶', category: 'transportasi' },
  { id: 'bike-to-work', title: 'Bersepeda ke Kantor', description: 'Gunakan sepeda untuk pergi bekerja', duration: 1, points: 30, icon: '🚲', category: 'transportasi' },
  { id: 'save-electricity', title: 'Hemat Listrik', description: 'Kurangi pemakaian listrik 20% dari biasanya', duration: 7, points: 100, icon: '💡', category: 'listrik' },
  { id: 'public-transport', title: 'Naik Angkutan Umum', description: 'Gunakan transportasi umum selama 5 hari', duration: 5, points: 80, icon: '🚌', category: 'transportasi' },
  { id: 'zero-emission-day', title: 'Hari Tanpa Emisi', description: 'Capai 0 emisi dalam 1 hari', duration: 1, points: 150, icon: '🌟', category: 'semua' },
  { id: 'under-limit-week', title: 'Seminggu Terjaga', description: 'Di bawah batas harian selama 7 hari', duration: 7, points: 200, icon: '🏅', category: 'semua' },
];
