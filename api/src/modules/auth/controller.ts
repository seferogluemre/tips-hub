import { cookie } from "@elysiajs/cookie";
import { Elysia } from "elysia";
import {
  authResponseDto,
  loginDto,
  logoutDto,
  meDto,
  refreshTokenDto,
  registerDto,
} from "./dtos";
import { AuthService, SessionService } from "./service";

// Session süresi (15 dakika - milisaniye cinsinden)
const SESSION_EXPIRY = 15 * 60 * 1000; // 15 dakika
const SESSION_EXPIRY_SECONDS = SESSION_EXPIRY / 1000; // saniye

// Auth controller tanımı
export const AuthController = new Elysia({ prefix: "/api/auth" })
  .use(cookie())
  .get(
    "/me",
    async ({ cookie, set }) => {
      const sessionToken = cookie.session;

      if (!sessionToken) {
        set.status = 401;
        return { message: "Oturum bulunamadı veya süresi doldu" };
      }

      try {
        // Session token'ını doğrula
        const userId = await SessionService.verify(String(sessionToken));

        if (!userId) {
          set.status = 401;
          return { message: "Geçersiz oturum" };
        }

        const user = await AuthService.getUser(userId);

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
    async ({ body, set }) => {
      try {
        const userInfo = await AuthService.register(body);

        // Session token oluştur
        const token = await SessionService.create(userInfo.id);

        // Cookie'ye kaydet
        set.cookie = {
          session: {
            value: token,
            httpOnly: true,
            maxAge: SESSION_EXPIRY_SECONDS,
            path: "/",
          },
        };

        // Response
        return {
          user: userInfo,
          token,
        };
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
      response: {
        200: authResponseDto,
        422: registerDto.response[422],
      },
      detail: {
        ...registerDto.detail,
        tags: ["Auth"],
      },
    }
  )
  .post(
    "/login",
    async ({ body, set }) => {
      try {
        const userInfo = await AuthService.login(body);

        // Session token oluştur
        const token = await SessionService.create(userInfo.id);

        // Cookie'ye kaydet
        set.cookie = {
          session: {
            value: token,
            httpOnly: true,
            maxAge: SESSION_EXPIRY_SECONDS,
            path: "/",
          },
        };

        // Response
        return {
          user: userInfo,
          token,
        };
      } catch (error: any) {
        set.status = 401;
        return {
          message: "E-posta veya şifre hatalı",
        };
      }
    },
    {
      ...loginDto,
      response: {
        200: authResponseDto,
        401: loginDto.response[401],
      },
      detail: {
        ...loginDto.detail,
        tags: ["Auth"],
      },
    }
  )
  .post(
    "/refresh",
    async ({ body, set }) => {
      try {
        const { token } = body;

        if (!token) {
          set.status = 400;
          return { message: "Token sağlanmalıdır" };
        }

        // Mevcut token'ı doğrula
        const userId = await SessionService.verify(token);

        if (!userId) {
          set.status = 401;
          return { message: "Geçersiz veya süresi dolmuş token" };
        }

        const userInfo = await AuthService.getUser(userId);

        if (!userInfo) {
          set.status = 401;
          return { message: "Kullanıcı bulunamadı" };
        }

        // Yeni token oluştur
        const newToken = await SessionService.create(userId);

        // Eski token'ı iptal et
        await SessionService.revoke(token);

        // Cookie'yi yenile
        set.cookie = {
          session: {
            value: newToken,
            httpOnly: true,
            maxAge: SESSION_EXPIRY_SECONDS,
            path: "/",
          },
        };

        return {
          user: userInfo,
          token: newToken,
        };
      } catch (error) {
        set.status = 401;
        return { message: "Token yenileme başarısız" };
      }
    },
    {
      ...refreshTokenDto,
      detail: {
        ...refreshTokenDto.detail,
        tags: ["Auth"],
      },
    }
  )
  .post(
    "/logout",
    async ({ cookie, set }) => {
      const sessionToken = cookie.session;

      if (sessionToken) {
        // Session'ı iptal et
        await SessionService.revoke(String(sessionToken));
      }

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
