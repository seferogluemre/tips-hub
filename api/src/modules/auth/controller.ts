import { cookie } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";
import { loginDto, logoutDto, meDto, registerDto } from "./dtos";
import { AuthService } from "./service";

// JWT ve cookie yapılandırması
const SESSION_EXPIRY = 15 * 60 * 1000; // 15 dakika (milisaniye)
const SESSION_EXPIRY_SECONDS = SESSION_EXPIRY / 1000; // saniye
const JWT_SECRET =
  process.env.JWT_SECRET || "super-secret-jwt-key-change-in-production";

// Auth controller tanımı
export const AuthController = new Elysia({ prefix: "/api/auth" })
  .use(cookie())
  .use(
    jwt({
      name: "jwt",
      secret: JWT_SECRET,
      exp: SESSION_EXPIRY_SECONDS,
    })
  )
  .get(
    "/me",
    async ({ cookie, jwt, set }) => {
      const sessionCookie = cookie.session;

      if (!sessionCookie) {
        set.status = 401;
        return { message: "Oturum bulunamadı veya süresi doldu" };
      }

      try {
        const payload = await jwt.verify(String(sessionCookie));

        if (!payload || !payload.userId) {
          set.status = 401;
          return { message: "Geçersiz oturum" };
        }

        const user = await AuthService.getUser(String(payload.userId));

        if (!user) {
          set.status = 401;
          return { message: "Kullanıcı bulunamadı" };
        }

        return user;
      } catch (error) {
        set.status = 401;
        return { message: "Oturum bulunamadı veya süresi doldu" };
      }
    },
    {
      ...meDto,
      detail: {
        ...meDto.detail,
        tags: ["Auth"],
      },
    }
  )
  .post(
    "/register",
    async ({ body, jwt, set }) => {
      try {
        const user = await AuthService.register(body);

        // JWT token oluştur
        const token = await jwt.sign({ userId: user.id });

        // Cookie'ye kaydet
        set.cookie = {
          session: {
            value: token,
            httpOnly: true,
            maxAge: SESSION_EXPIRY_SECONDS,
            path: "/",
          },
        };

        return user;
      } catch (error: any) {
        if (error.message === "Bu e-posta adresi zaten kullanılıyor") {
          set.status = 422;
          return {
            errors: [{ field: "email", message: error.message }],
            message: error.message,
          };
        }

        set.status = 422;
        return {
          message: "Kayıt işlemi başarısız oldu",
          errors: [{ field: "email", message: "Kayıt işlemi başarısız oldu" }],
        };
      }
    },
    {
      ...registerDto,
      detail: {
        ...registerDto.detail,
        tags: ["Auth"],
      },
    }
  )
  .post(
    "/login",
    async ({ body, jwt, set }) => {
      try {
        const user = await AuthService.login(body);

        // JWT token oluştur
        const token = await jwt.sign({ userId: user.id });

        // Cookie'ye kaydet
        set.cookie = {
          session: {
            value: token,
            httpOnly: true,
            maxAge: SESSION_EXPIRY_SECONDS,
            path: "/",
          },
        };

        return user;
      } catch (error: any) {
        set.status = 401;
        return {
          message: "E-posta veya şifre hatalı",
        };
      }
    },
    {
      ...loginDto,
      detail: {
        ...loginDto.detail,
        tags: ["Auth"],
      },
    }
  )
  .get(
    "/refresh",
    async ({ cookie, jwt, set }) => {
      const sessionCookie = cookie.session;

      if (!sessionCookie) {
        set.status = 401;
        return { message: "Oturum bulunamadı veya süresi doldu" };
      }

      try {
        const payload = await jwt.verify(String(sessionCookie));

        if (!payload || !payload.userId) {
          set.status = 401;
          return { message: "Geçersiz oturum" };
        }

        const user = await AuthService.getUser(String(payload.userId));

        if (!user) {
          set.status = 401;
          return { message: "Kullanıcı bulunamadı" };
        }

        // Yeni token oluştur
        const token = await jwt.sign({ userId: user.id });

        // Cookie'yi yenile
        set.cookie = {
          session: {
            value: token,
            httpOnly: true,
            maxAge: SESSION_EXPIRY_SECONDS,
            path: "/",
          },
        };

        return user;
      } catch (error) {
        set.status = 401;
        return { message: "Oturum bulunamadı veya süresi doldu" };
      }
    },
    {
      ...meDto,
      detail: {
        summary: "Refresh",
        description: "Oturum süresini yenile",
        tags: ["Auth"],
      },
    }
  )
  .post(
    "/logout",
    async ({ set }) => {
      // Session cookie'sini sil
      set.cookie = {
        session: {
          value: "",
          httpOnly: true,
          maxAge: 0,
          path: "/",
        },
      };

      return {
        message: "Başarıyla çıkış yapıldı",
      };
    },
    {
      ...logoutDto,
      detail: {
        ...logoutDto.detail,
        tags: ["Auth"],
      },
    }
  );
