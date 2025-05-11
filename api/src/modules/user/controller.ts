import { Elysia } from "elysia";
import {
  userCreateDto,
  userDestroyDto,
  userIndexDto,
  userShowDto,
  userUpdateDto,
} from "./dtos";
import { UserService } from "./service";

export const UserController = new Elysia({ prefix: "/api/users" })
  .get(
    "/",
    async ({ query }) => {
      const users = await UserService.getAll(query.search);
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedUsers = users.slice(startIndex, endIndex);

      return {
        data: paginatedUsers,
        meta: {
          page,
          total: users.length,
          lastPage: Math.ceil(users.length / limit),
        },
      };
    },
    {
      ...userIndexDto,
      detail: {
        ...userIndexDto.detail,
        tags: ["Users"],
      },
    }
  )
  .post(
    "/",
    async ({ body }) => {
      try {
        const user = await UserService.create(body);
        return user;
      } catch (error) {
        return {
          errors: [{ message: "Failed to create user", field: "body" }],
          message: "Failed to create user",
        };
      }
    },
    {
      ...userCreateDto,
      detail: {
        ...userCreateDto.detail,
        tags: ["Users"],
      },
    }
  )
  .get(
    "/:uuid",
    async ({ params }) => {
      const user = await UserService.getById(params.uuid);
      if (!user) {
        return { message: "User not found" };
      }
      return user;
    },
    {
      ...userShowDto,
      detail: {
        ...userShowDto.detail,
        tags: ["Users"],
      },
    }
  )
  .put(
    "/:uuid",
    async ({ params, body }) => {
      try {
        const user = await UserService.update(params.uuid, body);
        return user;
      } catch (error) {
        return { message: "User not found" };
      }
    },
    {
      ...userUpdateDto,
      detail: {
        ...userUpdateDto.detail,
        tags: ["Users"],
      },
    }
  )
  .delete(
    "/:uuid",
    async ({ params }) => {
      try {
        await UserService.delete(params.uuid);
        return { message: "User deleted successfully" };
      } catch (error) {
        return { message: "User not found" };
      }
    },
    {
      ...userDestroyDto,
      detail: {
        ...userDestroyDto.detail,
        tags: ["Users"],
      },
    }
  );
