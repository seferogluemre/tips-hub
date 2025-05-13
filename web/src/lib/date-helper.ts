/**
 * Verilen tarihi "... önce" formatına dönüştürür
 * @param dateString ISO formatında tarih string'i (örn. "2025-05-11T22:12:04.864Z")
 * @returns "... önce" formatında metin (örn. "2 gün önce", "3 saat önce")
 */
export function formatTimeAgo(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();

  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Negatif zaman farkı kontrolü (gelecek tarihler için)
  if (seconds < 0) {
    return "henüz";
  }

  // Zaman aralıkları
  const intervals = {
    yıl: 31536000, // 365 * 24 * 60 * 60
    ay: 2592000, // 30 * 24 * 60 * 60
    hafta: 604800, // 7 * 24 * 60 * 60
    gün: 86400, // 24 * 60 * 60
    saat: 3600, // 60 * 60
    dakika: 60,
    saniye: 1,
  };

  // En uygun zaman aralığını bul
  let counter;
  let interval;

  for (const [key, value] of Object.entries(intervals)) {
    counter = Math.floor(seconds / value);
    if (counter > 0) {
      interval = key;
      break;
    }
  }

  // "0 saniye önce" yerine "şimdi" göster
  if (counter === 0) {
    return "şimdi";
  }

  // Çoğul kontrol
  if (counter === 1 && interval === "gün") {
    return "dün";
  }

  // Normal format
  return `${counter} ${interval} önce`;
}

/**
 * Verilen tarihi Türkçe formatında görüntüler
 * @param dateString ISO formatında tarih string'i (örn. "2025-05-11T22:12:04.864Z")
 * @returns "GG Ay YYYY" formatında metin (örn. "11 Mayıs 2025")
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  const day = date.getDate();

  const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];

  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
