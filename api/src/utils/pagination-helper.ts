import { t } from 'elysia';

export const paginationQueryDto = t.Object({
    page: t.Optional(t.Integer({ minimum: 1, default: 1 })),
    limit: t.Optional(t.Integer({ minimum: 1, maximum: 100, default: 10 })),
});

export const paginationMetaDto = t.Object({
    total: t.Integer(),
    page: t.Integer(),
    lastPage: t.Integer(),
});

export const paginationResponseDto = <T extends typeof t.BaseSchema>(itemSchema: T) =>
    t.Object({
        data: t.Array(itemSchema),
        meta: paginationMetaDto,
    });