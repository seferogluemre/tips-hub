import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TipPlain = t.Object({
  id: t.String(),
  title: t.String(),
  content: t.String(),
  authorId: t.String(),
  createdAt: t.Date(),
});

export const TipRelations = t.Object({
  author: t.Object({
    id: t.String(),
    email: t.String(),
    name: __nullable__(t.String()),
    createdAt: t.Date(),
  }),
  tags: t.Array(
    t.Object({ id: t.String(), tipId: t.String(), tagId: t.String() }),
    { additionalProperties: true },
  ),
  comments: t.Array(
    t.Object({
      id: t.String(),
      content: t.String(),
      tipId: t.String(),
      authorId: t.String(),
      createdAt: t.Date(),
    }),
    { additionalProperties: true },
  ),
});

export const TipPlainInputCreate = t.Object({
  title: t.String(),
  content: t.String(),
});

export const TipPlainInputUpdate = t.Object({
  title: t.Optional(t.String()),
  content: t.Optional(t.String()),
});

export const TipRelationsInputCreate = t.Object({
  author: t.Object({
    connect: t.Object({
      id: t.String(),
    }),
  }),
  tags: t.Optional(
    t.Object({
      connect: t.Array(
        t.Object({
          id: t.String(),
        }),
        { additionalProperties: true },
      ),
    }),
  ),
  comments: t.Optional(
    t.Object({
      connect: t.Array(
        t.Object({
          id: t.String(),
        }),
        { additionalProperties: true },
      ),
    }),
  ),
});

export const TipRelationsInputUpdate = t.Partial(
  t.Object({
    author: t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
    tags: t.Partial(
      t.Object({
        connect: t.Array(
          t.Object({
            id: t.String(),
          }),
          { additionalProperties: true },
        ),
        disconnect: t.Array(
          t.Object({
            id: t.String(),
          }),
          { additionalProperties: true },
        ),
      }),
    ),
    comments: t.Partial(
      t.Object({
        connect: t.Array(
          t.Object({
            id: t.String(),
          }),
          { additionalProperties: true },
        ),
        disconnect: t.Array(
          t.Object({
            id: t.String(),
          }),
          { additionalProperties: true },
        ),
      }),
    ),
  }),
);

export const TipWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          OR: t.Array(Self, { additionalProperties: true }),
          id: t.String(),
          title: t.String(),
          content: t.String(),
          authorId: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: true },
      ),
    { $id: "Tip" },
  ),
);

export const TipWhereUnique = t.Recursive(
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
            title: t.String(),
            content: t.String(),
            authorId: t.String(),
            createdAt: t.Date(),
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "Tip" },
);

export const TipSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    title: t.Boolean(),
    content: t.Boolean(),
    author: t.Boolean(),
    authorId: t.Boolean(),
    tags: t.Boolean(),
    comments: t.Boolean(),
    createdAt: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const TipInclude = t.Partial(
  t.Object({
    author: t.Boolean(),
    tags: t.Boolean(),
    comments: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const TipOrderBy = t.Partial(
  t.Object({
    id: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    title: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    content: t.Union([t.Literal("asc"), t.Literal("desc")], {
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

export const Tip = t.Composite([TipPlain, TipRelations]);

export const TipInputCreate = t.Composite([
  TipPlainInputCreate,
  TipRelationsInputCreate,
]);

export const TipInputUpdate = t.Composite([
  TipPlainInputUpdate,
  TipRelationsInputUpdate,
]);
