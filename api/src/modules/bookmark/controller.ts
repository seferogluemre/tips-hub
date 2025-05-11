import { Elysia, t } from "elysia";
import prisma from "../../core/prisma";
import { requireAuth } from "../../middlewares/auth-middleware";
import { errorResponseDto } from "../../utils/error-response";
import { TipService } from "../tip/service";
import {
  bookmarkCreateDto,
  bookmarkDestroyDto,
  bookmarkIndexDto,
} from "./dtos";
import { BookmarkService } from "./service";

export const BookmarkController = new Elysia({ prefix: "/api/bookmarks" })
  .use(requireAuth)
  .get(
    "/",
    async ({ userId, query }) => {
      // Kullanıcının tüm bookmark'larını getir
      const bookmarks = await BookmarkService.getByUser(userId);

      return {
        data: bookmarks,
        meta: {
          page: Number(query.page) || 1,
          total: bookmarks.length,
          lastPage: Math.ceil(bookmarks.length / (Number(query.limit) || 10)),
        },
      };
    },
    {
      ...bookmarkIndexDto,
      detail: {
        ...bookmarkIndexDto.detail,
        tags: ["Bookmarks"],
      },
    }
  )
  .post(
    "/",
    async ({ body, userId, set }) => {
      try {
        // Bookmark oluştur
        const bookmark = await BookmarkService.create(userId, body);

        return bookmark;
      } catch (error: any) {
        set.status = 422;
        return {
          errors: [
            {
              message: error.message || "İpucu kaydedilemedi",
              field: "tipId",
            },
          ],
          message: "İpucu kaydetme hatası",
        };
      }
    },
    {
      ...bookmarkCreateDto,
      detail: {
        ...bookmarkCreateDto.detail,
        tags: ["Bookmarks"],
      },
    }
  )
  .post(
    "/toggle/:tipId",
    async ({ params, userId, set }) => {
      try {
        // İpucunun varlığını kontrol et
        const tip = await TipService.getById(params.tipId);

        if (!tip) {
          set.status = 404;
          return { message: "İpucu bulunamadı" };
        }

        // Kullanıcının bu ipucunu daha önce kaydetmiş mi kontrol et
        const existingBookmark = await prisma.bookmark.findUnique({
          where: {
            userId_tipId: {
              userId,
              tipId: params.tipId,
            },
          },
        });

        // Eğer zaten kaydedilmişse, sil (toggle off)
        if (existingBookmark) {
          await BookmarkService.deleteByTipAndUser(userId, params.tipId);
          return {
            message: "İpucu kaydı kaldırıldı",
            bookmarked: false,
          };
        }

        // Yoksa kaydet (toggle on)
        await BookmarkService.create(userId, { tipId: params.tipId });
        return {
          message: "İpucu kaydedildi",
          bookmarked: true,
        };
      } catch (error: any) {
        set.status = 422;
        return {
          message: error.message || "İşlem sırasında bir hata oluştu",
        };
      }
    },
    {
      params: t.Object({
        tipId: t.String(),
      }),
      response: {
        200: t.Object({
          message: t.String(),
          bookmarked: t.Boolean(),
        }),
        404: errorResponseDto[404],
        422: errorResponseDto[422],
      },
      detail: {
        summary: "İpucu Kayıt Durumunu Değiştir",
        description: "İpucunu kaydet veya kaydı kaldır",
        tags: ["Bookmarks"],
      },
    }
  )
  .delete(
    "/:uuid",
    async ({ params, userId, set }) => {
      try {
        // Önce bookmark'ı bul
        const bookmark = await BookmarkService.getById(params.uuid);

        // Bookmark bulunamadı
        if (!bookmark) {
          set.status = 404;
          return { message: "Kayıt bulunamadı" };
        }

        // Kullanıcı bu kaydın sahibi değilse
        if (bookmark.userId !== userId) {
          set.status = 403;
          return { message: "Bu kaydı silme yetkiniz yok" };
        }

        // Kaydı sil
        await BookmarkService.delete(params.uuid);
        return { message: "Kayıt başarıyla silindi" };
      } catch (error) {
        set.status = 500;
        return { message: "Kayıt silinirken bir hata oluştu" };
      }
    },
    {
      ...bookmarkDestroyDto,
      detail: {
        ...bookmarkDestroyDto.detail,
        tags: ["Bookmarks"],
      },
    }
  );
