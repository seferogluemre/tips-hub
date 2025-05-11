import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TipTagPlain = t.Object({
  id: t.String(),
  tipId: t.String(),
  tagId: t.String(),
});

export const TipTagRelations = t.Object({
  tip: t.Object({
    id: t.String(),
    title: t.String(),
    content: t.String(),
    authorId: t.String(),
    createdAt: t.Date(),
  }),
  tag: t.Object({ id: t.String(), name: t.String(), createdAt: t.Date() }),
});

export const TipTagPlainInputCreate = t.Object({});

export const TipTagPlainInputUpdate = t.Object({});

export const TipTagRelationsInputCreate = t.Object({
  tip: t.Object({
    connect: t.Object({
      id: t.String(),
    }),
  }),
  tag: t.Object({
    connect: t.Object({
      id: t.String(),
    }),
  }),
});

export const TipTagRelationsInputUpdate = t.Partial(
  t.Object({
    tip: t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
    tag: t.Object({
      connect: t.Object({
        id: t.String(),
      }),
    }),
  }),
);

export const TipTagWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          OR: t.Array(Self, { additionalProperties: true }),
          id: t.String(),
          tipId: t.String(),
          tagId: t.String(),
        },
        { additionalProperties: true },
      ),
    { $id: "TipTag" },
  ),
);

export const TipTagWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            {
              id: t.String(),
              tipId_tagId: t.Object(
                { tipId: t.String(), tagId: t.String() },
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
              tipId_tagId: t.Object(
                { tipId: t.String(), tagId: t.String() },
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
          t.Object({ id: t.String(), tipId: t.String(), tagId: t.String() }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "TipTag" },
);

export const TipTagSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    tip: t.Boolean(),
    tipId: t.Boolean(),
    tag: t.Boolean(),
    tagId: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const TipTagInclude = t.Partial(
  t.Object({ tip: t.Boolean(), tag: t.Boolean(), _count: t.Boolean() }),
);

export const TipTagOrderBy = t.Partial(
  t.Object({
    id: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    tipId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    tagId: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const TipTag = t.Composite([TipTagPlain, TipTagRelations]);

export const TipTagInputCreate = t.Composite([
  TipTagPlainInputCreate,
  TipTagRelationsInputCreate,
]);

export const TipTagInputUpdate = t.Composite([
  TipTagPlainInputUpdate,
  TipTagRelationsInputUpdate,
]);
