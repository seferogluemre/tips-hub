import { z } from "zod";

export const profileFormSchema = z
  .object({
    name: z.string().min(2, {
      message: "İsim en az 2 karakter olmalıdır",
    }),
    email: z.string().email({
      message: "Geçerli bir e-posta adresi giriniz",
    }),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => !data.newPassword || data.newPassword.length >= 8, {
    message: "Şifre en az 8 karakter olmalıdır",
    path: ["newPassword"],
  })
  .refine((data) => !data.newPassword || data.currentPassword, {
    message: "Mevcut şifrenizi giriniz",
    path: ["currentPassword"],
  })
  .refine(
    (data) => !data.newPassword || data.newPassword === data.confirmPassword,
    {
      message: "Şifreler eşleşmiyor",
      path: ["confirmPassword"],
    }
  );

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
