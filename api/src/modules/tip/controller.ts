import { Elysia } from "elysia";
import { requireAuth } from "../../middlewares/auth-middleware";
import {
  tipCreateDto,
  tipDestroyDto,
  tipIndexDto,
  tipShowDto,
  tipUpdateDto,
} from "./dtos";
import { TipService } from "./service";

export const TipController = new Elysia({ prefix: "/api/tips" })
  .get(
    "/",
    async ({ query }) => {
      const tips = await TipService.getAll();
      return {
        data: tips.map((tip) => ({
          ...tip,
          tags: tip.tags.map((t) => t.tag),
          author: {
            id: tip.author.id,
            name: tip.author.name || "",
          },
        })),
        meta: {
          page: Number(query.page) || 1,
          total: tips.length,
          lastPage: Math.ceil(tips.length / (Number(query.limit) || 10)),
        },
      };
    },
    {
      ...tipIndexDto,
      detail: {
        ...tipIndexDto.detail,
        tags: ["Tips"],
      },
    }
  )
  .use(requireAuth)
  .post(
    "/",
    async ({ body, userId, set }) => {
      try {
        console.log("TIP CREATE REQUEST:", {
          body,
          userId,
          hasAuthorIdInBody: !!body?.authorId,
          bodyKeys: Object.keys(body || {}),
        });

        const tipWithAuthor = {
          ...body,
          authorId: userId || body.authorId, // Try to use userId from middleware first, then fall back to body
        };

        console.log("Creating tip with data:", tipWithAuthor);

        const tip = await TipService.create(tipWithAuthor);
        console.log("Tip created:", tip);

        return {
          ...tip,
          tags: tip.tags.map((t) => t.tag),
          author: {
            id: tip.author.id,
            name: tip.author.name || "",
          },
        };
      } catch (error: any) {
        console.error("Tip creation error:", error.message);
        set.status = 422;
        return {
          errors: [
            { message: error.message || "İpucu oluşturulamadı", field: "body" },
          ],
          message: "İpucu oluşturma hatası",
        };
      }
    },
    {
      ...tipCreateDto,
      detail: {
        ...tipCreateDto.detail,
        tags: ["Tips"],
      },
    }
  )
  .get(
    "/my-tips",
    async ({ userId }) => {
      // Kullanıcının kendi ipuçlarını getir
      const tips = await TipService.getByAuthor(userId);
      return {
        data: tips.map((tip) => ({
          ...tip,
          tags: tip.tags.map((t) => t.tag),
          author: {
            id: tip.author.id,
            name: tip.author.name || "",
          },
        })),
        meta: {
          total: tips.length,
        },
      };
    },
    {
      ...tipIndexDto,
      detail: {
        summary: "Kullanıcı İpuçları",
        description: "Giriş yapmış kullanıcının kendi ipuçlarını listeler",
        tags: ["Tips"],
      },
    }
  )
  .get(
    "/:uuid",
    async ({ params }) => {
      const tip = await TipService.getById(params.uuid);
      if (!tip) {
        return { message: "Tip not found" };
      }
      return {
        ...tip,
        tags: tip.tags.map((t) => t.tag),
        author: {
          id: tip.author.id,
          name: tip.author.name || "",
        },
      };
    },
    {
      ...tipShowDto,
      detail: {
        ...tipShowDto.detail,
        tags: ["Tips"],
      },
    }
  )
  .put(
    "/:uuid",
    async ({ params, body }) => {
      const tip = await TipService.update(params.uuid, body);
      if (!tip) {
        return { message: "Tip not found" };
      }
      return {
        ...tip,
        tags: tip.tags.map((t) => t.tag),
        author: {
          id: tip.author.id,
          name: tip.author.name || "",
        },
      };
    },
    {
      ...tipUpdateDto,
      detail: {
        ...tipUpdateDto.detail,
        tags: ["Tips"],
      },
    }
  )
  .delete(
    "/:uuid",
    async ({ params, userId, set }) => {
      try {
        // Önce ipucunu bul
        const tip = await TipService.getById(params.uuid);

        // İpucu bulunamadı
        if (!tip) {
          set.status = 404;
          return { message: "İpucu bulunamadı" };
        }

        // Kullanıcı bu ipucunun sahibi değilse
        if (tip.author.id !== userId) {
          set.status = 403;
          return { message: "Bu ipucunu silme yetkiniz yok" };
        }

        // İpucunu sil
        await TipService.delete(params.uuid);
        return { message: "İpucu başarıyla silindi" };
      } catch (error) {
        set.status = 500;
        return { message: "İpucu silinirken bir hata oluştu" };
      }
    },
    {
      ...tipDestroyDto,
      detail: {
        ...tipDestroyDto.detail,
        tags: ["Tips"],
      },
    }
  );
