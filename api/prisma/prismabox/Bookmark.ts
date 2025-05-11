import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const BookmarkPlain = t.Object({
  id: t.String(),
  userId: t.String(),
  tipId: t.String(),
  createdAt: t.Date(),
});

export const BookmarkRelations = t.Object({
  user: t.Object({
    id: t.String(),
    email: t.String(),
    name: __nullable__(t.String()),
    password: __nullable__(t.String()),
    createdAt: t.Date(),
  }),
  tip: t.Object({
    id: t.String(),
    title: t.String(),
    content: t.String(),
    authorId: t.String(),
    createdAt: t.Date(),
  }),
});

export const BookmarkPlainInputCreate = t.Object({});

export const BookmarkPlainInputUpdate = t.Object({});

export const BookmarkRelationsInputCreate = t.Object({
  user: t.Object({
    connect: t.Object({
      id: t.String(),
    }),
  }),
  tip: t.Object({
    connect: t.Object({
      id: t.String(),
    }),
  }),
});

export const BookmarkRelationsInputUpdate = t.Partial(
  t.Object({
    user: t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
    tip: t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
  }),
);

export const BookmarkWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          OR: t.Array(Self, { additionalProperties: true }),
          id: t.String(),
          userId: t.String(),
          tipId: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: true },
      ),
    { $id: "Bookmark" },
  ),
);

export const BookmarkWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              userId_tipId: t.Object(
                { userId: t.String(), tipId: t.String() },
                { additionalProperties: true },
              ),
            },
            { additionalProperties: true },
          ),
          { additionalProperties: true },
        ),
        t.Union(
          [
            t.Object({ id: t.String() }),
            t.Object({
              userId_tipId: t.Object(
                { userId: t.String(), tipId: t.String() },
                { additionalProperties: true },
              ),
            }),
          ],
          { additionalProperties: true },
        ),
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
            userId: t.String(),
            tipId: t.String(),
            createdAt: t.Date(),
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "Bookmark" },
);

export const BookmarkSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    user: t.Boolean(),
    userId: t.Boolean(),
    tip: t.Boolean(),
    tipId: t.Boolean(),
    createdAt: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const BookmarkInclude = t.Partial(
  t.Object({ user: t.Boolean(), tip: t.Boolean(), _count: t.Boolean() }),
);

export const BookmarkOrderBy = t.Partial(
  t.Object({
    id: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    userId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    tipId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const Bookmark = t.Composite([BookmarkPlain, BookmarkRelations]);

export const BookmarkInputCreate = t.Composite([
  BookmarkPlainInputCreate,
  BookmarkRelationsInputCreate,
]);

export const BookmarkInputUpdate = t.Composite([
  BookmarkPlainInputUpdate,
  BookmarkRelationsInputUpdate,
]);
