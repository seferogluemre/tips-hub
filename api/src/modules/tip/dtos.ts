import { t } from 'elysia';
import { TipPlain, TipPlainInputCreate, TipPlainInputUpdate } from '../../../prisma/prismabox/Tip';
import { paginationQueryDto, paginationResponseDto } from '../../utils/pagination-helper';
import { ControllerHook } from '../../utils/controller-hook';
import { errorResponseDto } from '../../utils/error-response';
import { uuidValidation } from '../../utils/uuid-validation';

export const tipResponseDto = t.Composite([
    TipPlain,
    t.Object({
        tags: t.Array(
            t.Object({
                id: t.String(),
                name: t.String(),
            })
        ),
        author: t.Object({
            id: t.String(),
            name: t.String(),
        }),
    }),
]);

export const tipIndexDto = {
    query: t.Object({
        ...paginationQueryDto.properties,
        search: t.Optional(t.String()),
    }),
    response: {
        200: paginationResponseDto(tipResponseDto),
    },
    detail: {
        summary: 'Index',
        description: 'Tip listesini döndürür',
    },
} satisfies ControllerHook;

export const tipCreateDto = {
    body: TipPlainInputCreate,
    response: { 200: tipResponseDto, 422: errorResponseDto[422] },
    detail: {
        summary: 'Create',
        description: 'Yeni tip oluşturur',
    },
} satisfies ControllerHook;

export const tipUpdateDto = {
    params: t.Object({
        uuid: uuidValidation,
    }),
    body: TipPlainInputUpdate,
    response: { 200: tipResponseDto, 404: errorResponseDto[404], 422: errorResponseDto[422] },
    detail: {
        summary: 'Update',
        description: 'Tip günceller',
    },
} satisfies ControllerHook;

export const tipShowDto = {
    params: t.Object({
        uuid: uuidValidation,
    }),
    response: { 200: tipResponseDto, 404: errorResponseDto[404] },
    detail: {
        summary: 'Show',
        description: 'Tip detaylarını döndürür',
    },
} satisfies ControllerHook;

export const tipDestroyDto = {
    ...tipShowDto,
    response: { 200: t.Object({ message: t.String() }), 404: errorResponseDto[404] },
    detail: {
        summary: 'Destroy',
        description: 'Tip siler',
    },
} satisfies ControllerHook;
