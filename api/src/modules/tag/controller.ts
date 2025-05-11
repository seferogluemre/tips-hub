import { Elysia } from "elysia";
import {
  tagCreateDto,
  tagDestroyDto,
  tagIndexDto,
  tagShowDto,
  tagUpdateDto,
} from "./dtos";
import { TagService } from "./service";

export const TagController = new Elysia({ prefix: "/api/tags" })
  .get(
    "/",
    async ({ query }) => {
      const tags = await TagService.getAll();
      return {
        data: tags,
        meta: {
          page: Number(query.page) || 1,
          total: tags.length,
          lastPage: Math.ceil(tags.length / (Number(query.limit) || 10)),
        },
      };
    },
    {
      ...tagIndexDto,
      detail: {
        ...tagIndexDto.detail,
        tags: ["Tags"],
      },
    }
  )
  .post(
    "/",
    async ({ body }) => {
      const tag = await TagService.create(body);
      if (!tag) {
        return {
          errors: [{ message: "Failed to create tag", field: "body" }],
          message: "Failed to create tag",
        };
      }
      return tag;
    },
    {
      ...tagCreateDto,
      detail: {
        ...tagCreateDto.detail,
        tags: ["Tags"],
      },
    }
  )
  .get(
    "/:uuid",
    async ({ params }) => {
      const tag = await TagService.getById(params.uuid);
      if (!tag) {
        return { message: "Tag not found" };
      }
      return tag;
    },
    {
      ...tagShowDto,
      detail: {
        ...tagShowDto.detail,
        tags: ["Tags"],
      },
    }
  )
  .put(
    "/:uuid",
    async ({ params, body }) => {
      const tag = await TagService.update(params.uuid, body);
      if (!tag) {
        return { message: "Tag not found" };
      }
      return tag;
    },
    {
      ...tagUpdateDto,
      detail: {
        ...tagUpdateDto.detail,
        tags: ["Tags"],
      },
    }
  )
  .delete(
    "/:uuid",
    async ({ params }) => {
      await TagService.delete(params.uuid);
      return { message: "Tag deleted successfully" };
    },
    {
      ...tagDestroyDto,
      detail: {
        ...tagDestroyDto.detail,
        tags: ["Tags"],
      },
    }
  );
