import { cookie } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";
import {
  commentCreateDto,
  commentDestroyDto,
  commentIndexDto,
  commentShowDto,
  commentUpdateDto,
} from "./dtos";
import { CommentService } from "./service";

// JWT secret - controller içinde auth işlemleri için
const JWT_SECRET =
  process.env.JWT_SECRET || "super-secret-jwt-key-change-in-production";

export const CommentController = new Elysia({ prefix: "/api/comments" })
  .use(cookie())
  .use(
    jwt({
      name: "jwt",
      secret: JWT_SECRET,
    })
  )
  .derive(async ({ cookie, jwt }) => {
    // Session cookie'sini kontrol et
    const sessionCookie = cookie.session as unknown as string | undefined;

    if (!sessionCookie) {
      return { userId: null };
    }

    try {
      const payload = await jwt.verify(sessionCookie);
      if (!payload || !payload.userId) {
        return { userId: null };
      }
      return { userId: payload.userId as string };
    } catch (error) {
      return { userId: null };
    }
  })
  .get(
    "/",
    async ({ query }) => {
      const comments = await CommentService.getAll({
        tipId: query.tipId,
        authorId: query.authorId,
      });
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedComments = comments.slice(startIndex, endIndex);

      return {
        data: paginatedComments,
        meta: {
          page,
          total: comments.length,
          lastPage: Math.ceil(comments.length / limit),
        },
      };
    },
    {
      ...commentIndexDto,
      detail: {
        ...commentIndexDto.detail,
        tags: ["Comments"],
      },
    }
  )
  .post(
    "/",
    async ({ body, userId, set }) => {
      if (!userId) {
        set.status = 401;
        return {
          message: "Bu işlem için giriş yapmalısınız",
        };
      }

      try {
        // Mevcut kullanıcı ID'sini authorId olarak kullan
        const comment = await CommentService.create({
          ...body,
          authorId: userId,
        });
        return comment;
      } catch (error: any) {
        if (error.message === "Tip not found") {
          set.status = 422;
          return {
            errors: [{ message: error.message, field: "tipId" }],
            message: error.message,
          };
        }

        if (error.message === "User not found") {
          set.status = 422;
          return {
            errors: [{ message: error.message, field: "authorId" }],
            message: error.message,
          };
        }

        // Generic error handling
        set.status = 422;
        return {
          errors: [{ message: "Failed to create comment", field: "body" }],
          message: "Failed to create comment",
        };
      }
    },
    {
      body: {
        content: commentCreateDto.body.properties.content,
        tipId: commentCreateDto.body.properties.tipId,
        // authorId artık gerekli değil, otomatik ekleniyor
      },
      response: commentCreateDto.response,
      detail: {
        ...commentCreateDto.detail,
        tags: ["Comments"],
      },
    }
  )
  .get(
    "/:uuid",
    async ({ params }) => {
      const comment = await CommentService.getById(params.uuid);
      if (!comment) {
        return { message: "Comment not found" };
      }
      return comment;
    },
    {
      ...commentShowDto,
      detail: {
        ...commentShowDto.detail,
        tags: ["Comments"],
      },
    }
  )
  .put(
    "/:uuid",
    async ({ params, body, userId, set }) => {
      // Kullanıcı giriş yapmamış
      if (!userId) {
        set.status = 401;
        return {
          message: "Bu işlem için giriş yapmalısınız",
        };
      }

      try {
        // Önce yorumu bul
        const comment = await CommentService.getById(params.uuid);

        // Yorum bulunamadı
        if (!comment) {
          set.status = 404;
          return { message: "Comment not found" };
        }

        // Yalnızca kendi yorumunu güncelleyebilir
        if (comment.authorId !== userId) {
          set.status = 403;
          return { message: "Bu yorumu güncelleme yetkiniz yok" };
        }

        // Yorumu güncelle
        const updatedComment = await CommentService.update(params.uuid, body);
        return updatedComment;
      } catch (error: any) {
        set.status = 500;
        return {
          message: "Failed to update comment",
          errors: [{ message: "Failed to update comment", field: "body" }],
        };
      }
    },
    {
      ...commentUpdateDto,
      detail: {
        ...commentUpdateDto.detail,
        tags: ["Comments"],
      },
    }
  )
  .delete(
    "/:uuid",
    async ({ params, userId, set }) => {
      // Kullanıcı giriş yapmamış
      if (!userId) {
        set.status = 401;
        return {
          message: "Bu işlem için giriş yapmalısınız",
        };
      }

      try {
        // Önce yorumu bul
        const comment = await CommentService.getById(params.uuid);

        // Yorum bulunamadı
        if (!comment) {
          set.status = 404;
          return { message: "Comment not found" };
        }

        // Yalnızca kendi yorumunu silebilir
        if (comment.authorId !== userId) {
          set.status = 403;
          return { message: "Bu yorumu silme yetkiniz yok" };
        }

        // Yorumu sil
        await CommentService.delete(params.uuid);
        return { message: "Comment deleted successfully" };
      } catch (error) {
        set.status = 500;
        return { message: "Failed to delete comment" };
      }
    },
    {
      ...commentDestroyDto,
      detail: {
        ...commentDestroyDto.detail,
        tags: ["Comments"],
      },
    }
  );
