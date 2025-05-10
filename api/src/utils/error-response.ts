import { t } from 'elysia';

export const errorResponseDto = {
    404: t.Object({
        message: t.String({ default: 'Not Found' }),
    }),
    422: t.Object({
        message: t.String({ default: 'Validation Error' }),
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
