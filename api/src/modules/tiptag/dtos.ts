import { t } from "elysia";
import { ControllerHook } from "../../utils/controller-hook";
import { errorResponseDto } from "../../utils/error-response";
import {
  paginationQueryDto,
  paginationResponseDto,
} from "../../utils/pagination-helper";
import { uuidValidation } from "../../utils/uuid-validation";

// TipTag model
export const TipTagPlain = t.Object({
  id: t.String(),
  tipId: t.String(),
  tagId: t.String(),
});

// TipTag response DTO
export const tipTagResponseDto = TipTagPlain;

// TipTag create DTO
export const TipTagPlainInputCreate = t.Object({
  tipId: t.String(),
  tagId: t.String(),
});

export const tipTagIndexDto = {
  query: t.Object({
    ...paginationQueryDto.properties,
    tipId: t.Optional(t.String()),
    tagId: t.Optional(t.String()),
  }),
  response: {
    200: paginationResponseDto(tipTagResponseDto),
  },
  detail: {
    summary: "Index",
    description: "Returns list of tip-tag relations",
  },
} satisfies ControllerHook;

export const tipTagCreateDto = {
  body: TipTagPlainInputCreate,
  response: { 200: tipTagResponseDto, 422: errorResponseDto[422] },
  detail: {
    summary: "Create",
    description: "Creates a new tip-tag relation",
  },
} satisfies ControllerHook;

export const tipTagShowDto = {
  params: t.Object({
    uuid: uuidValidation,
  }),
  response: { 200: tipTagResponseDto, 404: errorResponseDto[404] },
  detail: {
    summary: "Show",
    description: "Returns tip-tag relation details",
  },
} satisfies ControllerHook;

export const tipTagDestroyDto = {
  ...tipTagShowDto,
  response: {
    200: t.Object({ message: t.String() }),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Destroy",
    description: "Deletes a tip-tag relation",
  },
} satisfies ControllerHook;
