import { Elysia } from "elysia";
import {
  tipCreateDto,
  tipDestroyDto,
  tipIndexDto,
  tipShowDto,
  tipUpdateDto,
} from "./dtos";
import { TipService } from "./service";

export const tipController = new Elysia({ prefix: "/tips" })
  .get(
    "/",
    async ({ query }) => {
      const tips = await TipService.getAll();
      return {
        data: tips.map((tip) => ({
          ...tip,
          tags: tip.tags || [],
          author: tip.author || { id: "", name: "" },
        })),
        meta: {
          page: Number(query.page) || 1,
          total: tips.length,
          lastPage: Math.ceil(tips.length / (Number(query.limit) || 10)),
        },
      };
    },
    tipIndexDto
  )
  .post(
    "/",
    async ({ body }) => {
      const tip = await TipService.create(body);
      if (!tip) {
        return {
          errors: [{ message: "Failed to create tip", field: "body" }],
          message: "Failed to create tip",
        };
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
    tipCreateDto
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
    tipShowDto
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
        tags: tip.tags || [],
        author: tip.author || { id: "", name: "" },
      };
    },
    tipUpdateDto
  )
  .delete(
    "/:uuid",
    async ({ params }) => {
      await TipService.delete(params.uuid);
      return { message: "Tip deleted successfully" };
    },
    tipDestroyDto
  );
