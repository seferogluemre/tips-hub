import { t } from "elysia";

// CUID formatı veya basit sayısal ID'leri kabul et
export const uuidValidation = t.Union([
  // CUID formatı (c ile başlayan en az 21 karakter)
  t.RegExp(/^c[a-z0-9]{21,}$/, {
    description: "CUID format",
  }),
  // Basit sayısal ID'ler için
  t.RegExp(/^\d+$/, {
    description: "Numeric ID",
  }),
]);
