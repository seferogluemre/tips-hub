import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const UserPlain = t.Object({
  id: t.String(),
  email: t.String(),
  name: __nullable__(t.String()),
  password: __nullable__(t.String()),
  createdAt: t.Date(),
});

export const UserRelations = t.Object({
  tips: t.Array(
    t.Object({
      id: t.String(),
      title: t.String(),
      content: t.String(),
      authorId: t.String(),
      createdAt: t.Date(),
    }),
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
  sessions: t.Array(
    t.Object({
      id: t.String(),
      token: t.String(),
      userId: t.String(),
      createdAt: t.Date(),
      updatedAt: t.Date(),
      expiresAt: t.Date(),
      revokedAt: __nullable__(t.Date()),
    }),
    { additionalProperties: true },
  ),
});

export const UserPlainInputCreate = t.Object({
  email: t.String(),
  name: t.Optional(__nullable__(t.String())),
  password: t.Optional(__nullable__(t.String())),
});

export const UserPlainInputUpdate = t.Object({
  email: t.Optional(t.String()),
  name: t.Optional(__nullable__(t.String())),
  password: t.Optional(__nullable__(t.String())),
});

export const UserRelationsInputCreate = t.Object({
  tips: t.Optional(
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
  sessions: t.Optional(
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

export const UserRelationsInputUpdate = t.Partial(
  t.Object({
    tips: t.Partial(
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
    sessions: t.Partial(
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

export const UserWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          NOT: t.Union([Self, t.Array(Self, { additionalProperties: true })]),
          OR: t.Array(Self, { additionalProperties: true }),
          id: t.String(),
          email: t.String(),
          name: t.String(),
          password: t.String(),
          createdAt: t.Date(),
        },
        { additionalProperties: true },
      ),
    { $id: "User" },
  ),
);

export const UserWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect(
      [
        t.Partial(
          t.Object(
            { id: t.String(), email: t.String() },
            { additionalProperties: true },
          ),
          { additionalProperties: true },
        ),
        t.Union(
          [t.Object({ id: t.String() }), t.Object({ email: t.String() })],
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
            email: t.String(),
            name: t.String(),
            password: t.String(),
            createdAt: t.Date(),
          }),
        ),
      ],
      { additionalProperties: true },
    ),
  { $id: "User" },
);

export const UserSelect = t.Partial(
  t.Object({
    id: t.Boolean(),
    email: t.Boolean(),
    name: t.Boolean(),
    password: t.Boolean(),
    tips: t.Boolean(),
    comments: t.Boolean(),
    sessions: t.Boolean(),
    createdAt: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const UserInclude = t.Partial(
  t.Object({
    tips: t.Boolean(),
    comments: t.Boolean(),
    sessions: t.Boolean(),
    _count: t.Boolean(),
  }),
);

export const UserOrderBy = t.Partial(
  t.Object({
    id: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    email: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    name: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    password: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
    createdAt: t.Union([t.Literal("asc"), t.Literal("desc")], {
      additionalProperties: true,
    }),
  }),
);

export const User = t.Composite([UserPlain, UserRelations]);

export const UserInputCreate = t.Composite([
  UserPlainInputCreate,
  UserRelationsInputCreate,
]);

export const UserInputUpdate = t.Composite([
  UserPlainInputUpdate,
  UserRelationsInputUpdate,
]);
