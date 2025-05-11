import { t } from "elysia";
import { ControllerHook } from "../../utils/controller-hook";
import { errorResponseDto } from "../../utils/error-response";
import {
  paginationQueryDto,
  paginationResponseDto,
} from "../../utils/pagination-helper";
import { uuidValidation } from "../../utils/uuid-validation";

// Basit Tag modeli
export const TagPlain = t.Object({
  id: t.String(),
  name: t.String(),
  createdAt: t.Date(),
});

// Basit Tag Yanıt DTO'su
export const tagResponseDto = TagPlain;

// Tag Oluşturma DTO'su
export const TagPlainInputCreate = t.Object({
  name: t.String(),
});

// Tag Güncelleme DTO'su
export const TagPlainInputUpdate = t.Object({
  name: t.Optional(t.String()),
});

export const tagIndexDto = {
  query: t.Object({
    ...paginationQueryDto.properties,
    search: t.Optional(t.String()),
  }),
  response: {
    200: paginationResponseDto(tagResponseDto),
  },
  detail: {
    summary: "Index",
    description: "Tag listesini döndürür",
  },
} satisfies ControllerHook;

export const tagCreateDto = {
  body: TagPlainInputCreate,
  response: { 200: tagResponseDto, 422: errorResponseDto[422] },
  detail: {
    summary: "Create",
    description: "Yeni tag oluşturur",
  },
} satisfies ControllerHook;

export const tagUpdateDto = {
  params: t.Object({
    uuid: uuidValidation,
  }),
  body: TagPlainInputUpdate,
  response: {
    200: tagResponseDto,
    404: errorResponseDto[404],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Update",
    description: "Tag günceller",
  },
} satisfies ControllerHook;

export const tagShowDto = {
  params: t.Object({
    uuid: uuidValidation,
  }),
  response: { 200: tagResponseDto, 404: errorResponseDto[404] },
  detail: {
    summary: "Show",
    description: "Tag detaylarını döndürür",
  },
} satisfies ControllerHook;

export const tagDestroyDto = {
  ...tagShowDto,
  response: {
    200: t.Object({ message: t.String() }),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Destroy",
    description: "Tag siler",
  },
} satisfies ControllerHook;
