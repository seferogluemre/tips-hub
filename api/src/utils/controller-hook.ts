import type { ObjectSchema } from 'elysia';

export type ControllerHook = {
    body?: ObjectSchema;
    query?: ObjectSchema;
    params?: ObjectSchema;
    response: Record<number, ObjectSchema>;
    detail?: {
        summary?: string;
        description?: string;
    };
};
