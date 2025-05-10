import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CommentPlain = t.Object({
  id: t.String(),
  content: t.String(),
  tipId: t.String(),
  authorId: t.String(),
  createdAt: t.Date(),
});

export const CommentRelations = t.Object({
  tip: t.Object({
    id: t.String(),
    title: t.String(),
    content: t.String(),
    authorId: t.String(),
    createdAt: t.Date(),
  }),
  author: t.Object({
    id: t.String(),
    email: t.String(),
    name: __nullable__(t.String()),
    createdAt: t.Date(),
  }),
});

export const CommentPlainInputCreate = t.Object({ content: t.String() });

export const CommentPlainInputUpdate = t.Object({
  content: t.Optional(t.String()),
});

export const CommentRelationsInputCreate = t.Object({
  tip: t.Object({
    connect: t.Object({
      id: t.String(),
    }),
  }),
  author: t.Object({
    connect: t.Object({
      id: t.String(),
    }),
  }),
});

export const CommentRelationsInputUpdate = t.Partial(
  t.Object({
    tip: t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
    author: t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
  }),
);

export const CommentWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          OR: t.Array(Self, { additionalProperties: true }),
          id: t.String(),
          content: t.String(),
          tipId: t.String(),
          authorId: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: true },
      ),
    { $id: "Comment" },
  ),
);

export const CommentWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object({ id: t.String() }, { additionalProperties: true }),
          { additionalProperties: true },
        ),
        t.Union([t.Object({ id: t.String() })], { additionalProperties: true }),
        t.Partial(
          t.Object({
            AND: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
            NOT: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
            OR: t.Array(Self, { additionalProperties: true }),
          }),
          { additionalProperties: true },
        ),
        t.Partial(
          t.Object({
            id: t.String(),
            content: t.String(),
            tipId: t.String(),
            authorId: t.String(),
            createdAt: t.Date(),
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "Comment" },
);

export const CommentSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    content: t.Boolean(),
    tip: t.Boolean(),
    tipId: t.Boolean(),
    author: t.Boolean(),
    authorId: t.Boolean(),
    createdAt: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const CommentInclude = t.Partial(
  t.Object({ tip: t.Boolean(), author: t.Boolean(), _count: t.Boolean() }),
);

export const CommentOrderBy = t.Partial(
  t.Object({
    id: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    content: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    tipId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    authorId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const Comment = t.Composite([CommentPlain, CommentRelations]);

export const CommentInputCreate = t.Composite([
  CommentPlainInputCreate,
  CommentRelationsInputCreate,
]);

export const CommentInputUpdate = t.Composite([
  CommentPlainInputUpdate,
  CommentRelationsInputUpdate,
]);
