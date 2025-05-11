import { cookie } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";
import { AuthService } from "../modules/auth/service";

// JWT ve session yapılandırması
export const SESSION_EXPIRY = 15 * 60 * 1000; // 15 dakika
export const JWT_SECRET =
  process.env.JWT_SECRET || "super-secret-jwt-key-change-in-production";

/**
 * Auth middleware - tüm uygulamada kullanılabilir
 */
export const authMiddleware = (app: Elysia) =>
  app
    .use(cookie())
    .use(
      jwt({
        name: "jwt",
        secret: JWT_SECRET,
        exp: SESSION_EXPIRY,
      })
    )
    .derive({ as: "scoped" }, async (context) => {
      // Session cookie'sini kontrol et
      const sessionCookie = context.cookie.session;

      if (!sessionCookie) {
        return { user: null };
      }

      try {
        // JWT token'ı doğrula
        const payload = await context.jwt.verify(sessionCookie);

        if (!payload || !payload.userId) {
          return { user: null };
        }

        // Kullanıcı bilgilerini getir
        const user = await AuthService.getUser(payload.userId);
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
