import { t } from "elysia";

export const errorMessageDto = t.Object(
  {
    message: t.String(),
    errors: t.Optional(
      t.Array(
        t.Object({
          field: t.String(),
          message: t.String(),
        })
      )
    ),
  },
  {
    description: "Hata mesajı şablonu",
  }
);

export const errorResponseDto = {
  400: t.Object({
    message: t.String({ default: "Bad Request" }),
  }),
  401: t.Object({
    message: t.String(),
  }),
  404: t.Object({
    message: t.String({ default: "Not Found" }),
  }),
  422: t.Object({
    message: t.String({ default: "Validation Error" }),
    errors: t.Optional(
      t.Array(
        t.Object({
          field: t.String(),
          message: t.String(),
        })
      )
    ),
  }),
};
