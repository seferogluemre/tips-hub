import { Elysia } from "elysia";
import {
  commentCreateDto,
  commentDestroyDto,
  commentIndexDto,
  commentShowDto,
  commentUpdateDto,
} from "./dtos";
import { CommentService } from "./service";

export const CommentController = new Elysia({ prefix: "/api/comments" })
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
    async ({ body }) => {
      try {
        const comment = await CommentService.create(body);
        return comment;
      } catch (error) {
        return {
          errors: [{ message: "Failed to create comment", field: "body" }],
          message: "Failed to create comment",
        };
      }
    },
    {
      ...commentCreateDto,
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
    async ({ params, body }) => {
      try {
        const comment = await CommentService.update(params.uuid, body);
        return comment;
      } catch (error) {
        return { message: "Comment not found" };
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
    async ({ params }) => {
      try {
        await CommentService.delete(params.uuid);
        return { message: "Comment deleted successfully" };
      } catch (error) {
        return { message: "Comment not found" };
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
