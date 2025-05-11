import { t } from "elysia";
import { ControllerHook } from "../../utils/controller-hook";
import { errorResponseDto } from "../../utils/error-response";

// Login DTO
export const loginInputDto = t.Object({
  email: t.String({
    format: "email",
    error: "Geçerli bir e-posta adresi giriniz",
  }),
  password: t.String({
    minLength: 6,
    error: "Şifre en az 6 karakter olmalıdır",
  }),
});

// Register DTO
export const registerInputDto = t.Object({
  email: t.String({
    format: "email",
    error: "Geçerli bir e-posta adresi giriniz",
  }),
  name: t.String({
    minLength: 2,
    error: "İsim en az 2 karakter olmalıdır",
  }),
  password: t.String({
    minLength: 6,
    error: "Şifre en az 6 karakter olmalıdır",
  }),
});

// Auth response DTO
export const authResponseDto = t.Object({
  id: t.String(),
  email: t.String(),
  name: t.Optional(t.Nullable(t.String())),
});

// Login controller
export const loginDto = {
  body: loginInputDto,
  response: {
    200: authResponseDto,
    401: errorResponseDto[401],
  },
  detail: {
    summary: "Login",
    description: "Giriş yap",
  },
} satisfies ControllerHook;

// Register controller
export const registerDto = {
  body: registerInputDto,
  response: {
    200: authResponseDto,
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Register",
    description: "Kayıt ol",
  },
} satisfies ControllerHook;

// Me controller
export const meDto = {
  response: {
    200: authResponseDto,
    401: errorResponseDto[401],
  },
  detail: {
    summary: "Me",
    description: "Mevcut kullanıcı bilgilerini getir",
  },
} satisfies ControllerHook;

// Logout controller
export const logoutDto = {
  response: {
    200: t.Object({
      message: t.String(),
    }),
  },
  detail: {
    summary: "Logout",
    description: "Çıkış yap",
  },
} satisfies ControllerHook;
