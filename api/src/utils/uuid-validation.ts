import { t } from 'elysia';

export const uuidValidation = t.RegExp(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    { description: 'UUID v4' }
);