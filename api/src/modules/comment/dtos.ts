import { t } from "elysia";
import { ControllerHook } from "../../utils/controller-hook";
import { errorResponseDto } from "../../utils/error-response";
import {
  paginationQueryDto,
  paginationResponseDto,
} from "../../utils/pagination-helper";
import { uuidValidation } from "../../utils/uuid-validation";

// Comment model
export const CommentPlain = t.Object({
  id: t.String(),
  content: t.String(),
  tipId: t.String(),
  authorId: t.String(),
  createdAt: t.Date(),
});

// Comment response DTO
export const commentResponseDto = CommentPlain;

// Comment create DTO
export const CommentPlainInputCreate = t.Object({
  content: t.String(),
  tipId: t.String(),
  authorId: t.String(),
});

// Comment update DTO
export const CommentPlainInputUpdate = t.Object({
  content: t.Optional(t.String()),
});

export const commentIndexDto = {
  query: t.Object({
    ...paginationQueryDto.properties,
    tipId: t.Optional(t.String()),
    authorId: t.Optional(t.String()),
  }),
  response: {
    200: paginationResponseDto(commentResponseDto),
  },
  detail: {
    summary: "Index",
    description: "Returns list of comments",
  },
} satisfies ControllerHook;

export const commentCreateDto = {
  body: CommentPlainInputCreate,
  response: { 200: commentResponseDto, 422: errorResponseDto[422] },
  detail: {
    summary: "Create",
    description: "Creates a new comment",
  },
} satisfies ControllerHook;

export const commentUpdateDto = {
  params: t.Object({
    uuid: uuidValidation,
  }),
  body: CommentPlainInputUpdate,
  response: {
    200: commentResponseDto,
    404: errorResponseDto[404],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Update",
    description: "Updates a comment",
  },
} satisfies ControllerHook;

export const commentShowDto = {
  params: t.Object({
    uuid: uuidValidation,
  }),
  response: { 200: commentResponseDto, 404: errorResponseDto[404] },
  detail: {
    summary: "Show",
    description: "Returns comment details",
  },
} satisfies ControllerHook;

export const commentDestroyDto = {
  ...commentShowDto,
  response: {
    200: t.Object({ message: t.String() }),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Destroy",
    description: "Deletes a comment",
  },
} satisfies ControllerHook;
