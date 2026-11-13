export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatAmount(amount) {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatTime(timestamp) {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(date));
}

export function formatShortDate(date) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(date));
}

export function getDayName(date) {
  return new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(date);
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}

export function getTreeLevel(totalSaved) {
  if (totalSaved >= 100) return { level: 5, name: 'Pohon Rindang', next: null, progress: 100 };
  if (totalSaved >= 50) return { level: 4, name: 'Pohon Muda', next: 100, progress: ((totalSaved - 50) / 50) * 100 };
  if (totalSaved >= 20) return { level: 3, name: 'Semak Hijau', next: 50, progress: ((totalSaved - 20) / 30) * 100 };
  if (totalSaved >= 5) return { level: 2, name: 'Tunas Baru', next: 20, progress: ((totalSaved - 5) / 15) * 100 };
  return { level: 1, name: 'Biji Harapan', next: 5, progress: (totalSaved / 5) * 100 };
}
