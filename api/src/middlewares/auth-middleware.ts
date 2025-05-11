import { cookie } from "@elysiajs/cookie";
import { Elysia } from "elysia";
import { AuthService, SessionService } from "../modules/auth/service";

// Session yapılandırması
export const SESSION_EXPIRY = 15 * 60 * 1000; // 15 dakika
export const SESSION_EXPIRY_SECONDS = SESSION_EXPIRY / 1000; // saniye

/**
 * Auth middleware - tüm uygulamada kullanılabilir
 */
export const authMiddleware = (app: Elysia) =>
  app.use(cookie()).derive({ as: "scoped" }, async (context) => {
    // Session cookie'sini kontrol et
    const sessionToken = context.cookie.session;

    if (!sessionToken) {
      return { user: null };
    }

    try {
      // Session token'ı doğrula
      const userId = await SessionService.verify(String(sessionToken));

      if (!userId) {
        return { user: null };
      }

      // Kullanıcı bilgilerini getir
      const user = await AuthService.getUser(userId);
      return { user };
    } catch (error) {
      return { user: null };
    }
  });

/**
 * Auth gerektiren route'lar için auth kontrolü
 */
export function requireAuth<T extends Elysia.App>(app: T) {
  return app.derive(async ({ user, set }) => {
    if (!user) {
      set.status = 401;
      return {
        success: false,
        message: "Yetkilendirme hatası: Lütfen giriş yapın",
      };
    }
    return { userId: user.id };
  });
}
