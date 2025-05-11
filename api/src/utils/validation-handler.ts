import { ValidationError } from "elysia";

/**
 * Validasyon hatalarını işlemek için yardımcı fonksiyon
 */
export function handleValidationErrors(error: any) {
  if (error instanceof ValidationError) {
    const errors = Object.entries(error.all).map(([field, message]) => ({
      field,
      message: String(message),
    }));

    return {
      errors,
      message: "Validation failed",
    };
  }

  // Eğer validasyon hatası değilse, hatayı olduğu gibi döndür
  return null;
}
