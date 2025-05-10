import { t } from "elysia";

export const uuidValidation = t.RegExp(/^c[a-z0-9]{21,}$/, {
  description: "CUID format",
});
