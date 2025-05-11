import { cors } from "@elysiajs/cors";
import dotenv from "dotenv";
import { Elysia } from "elysia";
import { handleElysiaError } from "./config/error-handler";
import { swaggerConfig } from "./config/swagger";
import { TagController } from "./modules/tag/controller";
import { TipController } from "./modules/tip/controller";

dotenv.config();

const app = new Elysia()
  .use(cors())
  .use(swaggerConfig)
  .use(TipController)
  .use(TagController)
  .onError(handleElysiaError)
  .get("", () => "Hello World")
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
