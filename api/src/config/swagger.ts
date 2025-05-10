import { swagger } from "@elysiajs/swagger";

export const swaggerConfig = swagger({
  documentation: {
    info: {
      title: "Tips Hub API",
      version: "1.0.0",
      description: "API documentation for Tips Hub",
    },
    tags: [
      { name: "Tips", description: "Tips management endpoints" },
      { name: "Users", description: "User management endpoints" },
      { name: "Tags", description: "Tag management endpoints" },
    ],
  },
  swagger: {
    path: "/swagger",
  },
});
