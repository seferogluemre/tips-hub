import { z } from "zod";

export const createTipSchema = z.object({
  title: z
    .string()
    .min(5, "Başlık en az 5 karakter olmalıdır")
    .max(100, "Başlık en fazla 100 karakter olmalıdır"),
  content: z.string().min(20, "İçerik en az 20 karakter olmalıdır"),
  tags: z.string().min(1, "En az bir etiket eklemelisiniz"),
});

export type CreateTipFormValues = z.infer<typeof createTipSchema>;
