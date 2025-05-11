import { Elysia, t } from "elysia";
import { errorResponseDto } from "../../utils/error-response";
import {
  tipTagCreateDto,
  tipTagDestroyDto,
  tipTagIndexDto,
  tipTagShowDto,
} from "./dtos";
import { TipTagService } from "./service";

export const TipTagController = new Elysia({ prefix: "/api/tiptags" })
  .get(
    "/",
    async ({ query }) => {
      const tipTags = await TipTagService.getAll({
        tipId: query.tipId,
        tagId: query.tagId,
      });
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedTipTags = tipTags.slice(startIndex, endIndex);

      return {
        data: paginatedTipTags,
        meta: {
          page,
          total: tipTags.length,
          lastPage: Math.ceil(tipTags.length / limit),
        },
      };
    },
    {
      ...tipTagIndexDto,
      detail: {
        ...tipTagIndexDto.detail,
        tags: ["TipTags"],
      },
    }
  )
  .post(
    "/",
    async ({ body }) => {
      try {
        const tipTag = await TipTagService.create(body);
        return tipTag;
      } catch (error: any) {
        // Specific error handling
        if (error.message === "Tip not found") {
          return {
            errors: [{ message: error.message, field: "tipId" }],
            message: error.message,
          };
        }

        if (error.message === "Tag not found") {
          return {
            errors: [{ message: error.message, field: "tagId" }],
            message: error.message,
          };
        }

        // Generic error handling
        return {
          errors: [
            { message: "Failed to create tip-tag relation", field: "body" },
          ],
          message: "Failed to create tip-tag relation",
        };
      }
    },
    {
      ...tipTagCreateDto,
      detail: {
        ...tipTagCreateDto.detail,
        tags: ["TipTags"],
      },
    }
  )
  .get(
    "/:uuid",
    async ({ params }) => {
      const tipTag = await TipTagService.getById(params.uuid);
      if (!tipTag) {
        return { message: "Tip-tag relation not found" };
      }
      return tipTag;
    },
    {
      ...tipTagShowDto,
      detail: {
        ...tipTagShowDto.detail,
        tags: ["TipTags"],
      },
    }
  )
  .delete(
    "/:uuid",
    async ({ params }) => {
      try {
        await TipTagService.delete(params.uuid);
        return { message: "Tip-tag relation deleted successfully" };
      } catch (error: any) {
        return {
          message: error.message || "Tip-tag relation not found",
        };
      }
    },
    {
      ...tipTagDestroyDto,
      detail: {
        ...tipTagDestroyDto.detail,
        tags: ["TipTags"],
      },
    }
  )
  .delete(
    "/by-tip-tag",
    async ({ query }) => {
      if (!query.tipId || !query.tagId) {
        return {
          message: "Both tipId and tagId are required",
          errors: [
            { message: "tipId is required", field: "tipId" },
            { message: "tagId is required", field: "tagId" },
          ],
        };
      }

      try {
        await TipTagService.deleteByTipAndTag(query.tipId, query.tagId);
        return { message: "Tip-tag relation deleted successfully" };
      } catch (error: any) {
        return {
          message: error.message || "Tip-tag relation not found",
        };
      }
    },
    {
      query: t.Object({
        tipId: t.String(),
        tagId: t.String(),
      }),
      response: {
        200: t.Object({ message: t.String() }),
        422: errorResponseDto[422],
      },
      detail: {
        summary: "Delete By Tip and Tag",
        description: "Deletes a tip-tag relation by tip ID and tag ID",
        tags: ["TipTags"],
      },
    }
  );
