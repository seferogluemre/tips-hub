import { cors } from "@elysiajs/cors";
import dotenv from "dotenv";
import { Elysia } from "elysia";
import { handleElysiaError } from "./config/error-handler";

dotenv.config();

const app = new Elysia()
  .use(cors())
  .onError(handleElysiaError)
  .get("/", () => "Hello World")
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
