import { cors } from "@elysiajs/cors";
import dotenv from "dotenv";
import { Elysia } from "elysia";
import { handleElysiaError } from "./config/error-handler";
import { swaggerConfig } from "./config/swagger";
import { authController } from "./modules/auth";
import { CommentController } from "./modules/comment/controller";
import { TagController } from "./modules/tag/controller";
import { TipController } from "./modules/tip/controller";
import { TipTagController } from "./modules/tiptag/controller";
import { UserController } from "./modules/user/controller";

dotenv.config();
const app = new Elysia()
  .use(cors())
  .use(swaggerConfig)
  .use(TipController)
  .use(TagController)
  .use(UserController)
  .use(CommentController)
  .use(TipTagController)
  .use(authController)
  .onError(handleElysiaError)
  .get("/", () => "Tips Hub API")
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
