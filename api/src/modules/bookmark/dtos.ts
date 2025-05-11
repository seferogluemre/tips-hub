import { t } from "elysia";
import { ControllerHook } from "../../utils/controller-hook";
import { errorResponseDto } from "../../utils/error-response";
import {
  paginationQueryDto,
  paginationResponseDto,
} from "../../utils/pagination-helper";
import { uuidValidation } from "../../utils/uuid-validation";

// Bookmark model
export const BookmarkPlain = t.Object({
  id: t.String(),
  userId: t.String(),
  tipId: t.String(),
  createdAt: t.Date(),
});

// Bookmark response (ilişkili verilerle birlikte)
export const bookmarkResponseDto = t.Object({
  id: t.String(),
  createdAt: t.Date(),
  tip: t.Object({
    id: t.String(),
    title: t.String(),
    content: t.String(),
    author: t.Object({
      id: t.String(),
      name: t.Optional(t.Nullable(t.String())),
    }),
    createdAt: t.Date(),
  }),
  user: t.Object({
    id: t.String(),
    name: t.Optional(t.Nullable(t.String())),
  }),
});

// Bookmark create DTO
export const BookmarkPlainInputCreate = t.Object({
  tipId: t.String({
    error: "Kaydedilecek ipucu ID'si gereklidir",
  }),
});

// Bookmark index DTO
export const bookmarkIndexDto = {
  query: t.Object({
    ...paginationQueryDto.properties,
  }),
  response: {
    200: paginationResponseDto(bookmarkResponseDto),
  },
  detail: {
    summary: "Kullanıcı Kayıtları",
    description: "Kullanıcının kaydettiği ipuçlarını listeler",
  },
} satisfies ControllerHook;

// Bookmark create DTO
export const bookmarkCreateDto = {
  body: BookmarkPlainInputCreate,
  response: {
    200: bookmarkResponseDto,
    422: errorResponseDto[422],
    400: errorResponseDto[400],
  },
  detail: {
    summary: "İpucu Kaydet",
    description: "Bir ipucunu kaydet",
  },
} satisfies ControllerHook;

// Bookmark destroy DTO
export const bookmarkDestroyDto = {
  params: t.Object({
    uuid: uuidValidation,
  }),
  response: {
    200: t.Object({ message: t.String() }),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Kaydı Sil",
    description: "Kaydedilmiş bir ipucunu kaldır",
  },
} satisfies ControllerHook;
