import { t } from "elysia";

export const TipPlain = t.Object({
  id: t.String(),
  title: t.String(),
  content: t.String(),
  authorId: t.String(),
  createdAt: t.Date(),
});

export const TipPlainInputCreate = t.Object({
  title: t.String(),
  content: t.String(),
  authorId: t.String(),
});

export const TipPlainInputUpdate = t.Object({
  title: t.Optional(t.String()),
  content: t.Optional(t.String()),
});
